package com.hive.hiveaiagent.agent.model;

import cn.hutool.core.util.StrUtil;
import com.hive.hiveaiagent.attachment.AttachmentDto;
import com.hive.hiveaiagent.attachment.AttachmentRegistry;
import com.hive.hiveaiagent.attachment.AttachmentService;
import com.hive.hiveaiagent.attachment.ChatAttachment;
import lombok.Data;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import reactor.core.publisher.Flux;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;

/**
 * 抽象基础代理类，用于管理代理状态和执行流程。
 * <p>
 * 提供状态转换、内存管理和基于步骤的执行循环的基础功能。
 * 子类必须实现step方法。
 */
@Data
public abstract class BaseAgent {

    private static final Logger log = LoggerFactory.getLogger(BaseAgent.class);

    // 核心属性
    private String name;

    // 提示词
    private String systemPrompt;
    private String nextStepPrompt;
    private String summaryUserPrompt = "任务已结束。请根据以上的执行步骤和结果，为用户提供一个清晰、简洁的最终总结回答。";

    // 代理状态
    private AgentState state = AgentState.IDLE;

    // 执行步骤控制
    private int currentStep = 0;
    private int maxSteps = 10;

    // LLM 大模型
    private ChatClient chatClient;

    // Memory 记忆(需要自主维护会话上下文)
    private List<Message> messageList = new ArrayList<>();

    private transient AttachmentService attachmentService;

    /**
     * 运行代理
     *
     * @param userPrompt 用户提示词
     * @return 执行结果
     */
    public String run(String userPrompt) {
        // 基础校验
        if (this.state != AgentState.IDLE) {
            throw new RuntimeException("Cannot run agent from state: " + this.state);
        }
        if (StrUtil.isBlank(userPrompt)) {
            throw new RuntimeException("Cannot run agent with empty user prompt");
        }

        try {
            // 执行，更改状态
            this.state = AgentState.RUNNING;
            // 记录消息上下文
            messageList.add(new UserMessage(userPrompt));
            // 保存结果列表
            List<String> results = new ArrayList<>();
            // 执行循环
            for (int i = 0; i < maxSteps && state != AgentState.FINISHED; i++) {
                int stepNumber = i + 1;
                currentStep = stepNumber;
                log.info("Executing step {}/{}", stepNumber, maxSteps);
                // 单步执行
                String stepResult = step();
                String result = "Step " + stepNumber + ": " + stepResult;
                results.add(result);
            }
            // 检查是否超出步骤限制
            if (currentStep >= maxSteps) {
                state = AgentState.FINISHED;
                results.add("Terminated: Reached max steps (" + maxSteps + ")");
            }
            return String.join("\n", results);
        } catch (Exception e) {
            state = AgentState.ERROR;
            log.error("error executing agent", e);
            return "执行错误" + e.getMessage();
        } finally {
            // 总结

            //清理资源
            this.cleanup();
        }
    }

    /**
     * 运行代理
     *
     * @param userPrompt 用户提示词
     * @return 执行结果
     */
    public SseEmitter runStream(String userPrompt) {
        // 创建一个超时时间长的 SseEmitter
        SseEmitter sseEmitter = new SseEmitter(500000L); // 5 分钟超时
        // 线程异步处理, 避免阻塞主线程
        CompletableFuture.runAsync(
                () -> {
                    // 基础校验
                    try {
                        if (this.state != AgentState.IDLE) {
                            sseEmitter.send("错误: 无法从状态运行代理: " + this.state);
                            sseEmitter.complete();
                            return;
                        }
                        if (StrUtil.isBlank(userPrompt)) {
                            sseEmitter.send("错误: 不能使用空提示词进行代理: ");
                            sseEmitter.complete();
                            return;
                        }
                    } catch (IOException e) {
                        sseEmitter.completeWithError(e);
                    }

                    try {
                        AttachmentRegistry.begin();
                        // 执行，更改状态
                        this.state = AgentState.RUNNING;
                        // 记录消息上下文
                        messageList.add(new UserMessage(userPrompt));
                        // 保存结果列表
                        List<String> results = new ArrayList<>();
                        // 执行循环
                        for (int i = 0; i < maxSteps && state != AgentState.FINISHED; i++) {
                            int stepNumber = i + 1;
                            currentStep = stepNumber;
                            log.info("Executing step {}/{}", stepNumber, maxSteps);
                            // 单步执行
                            String stepResult = step();
                            String result = "Step " + stepNumber + ": " + stepResult;
                            results.add(result);
                            // 输出当前每一步的结果到 SSE
                            sseEmitter.send(result);
                            flushAttachmentEvents(sseEmitter);
                        }
                        // 检查是否超出步骤限制
                        if (currentStep >= maxSteps) {
                            state = AgentState.FINISHED;
                            results.add("Terminated: Reached max steps (" + maxSteps + ")");
                            sseEmitter.send("执行结束: 达到最大步骤 (" + maxSteps + ")");
                        }
                        // 流式生成总结
                        if (state == AgentState.FINISHED) {
                            List<Message> summaryContext = new ArrayList<>(messageList);
                            summaryContext.add(new UserMessage(this.summaryUserPrompt));

                            Prompt summaryPrompt = new Prompt(summaryContext);

                            log.info("开始流式生成最终总结...");

                            Flux<String> contentFlux = this.chatClient.prompt(summaryPrompt)
                                    .system(this.systemPrompt)
                                    .stream()
                                    .content();

                            // 订阅并发送
                            contentFlux.doOnNext(chunk -> {
                                        try {
                                            if (StrUtil.isNotBlank(chunk)) {
                                                sseEmitter.send(chunk);
                                            }
                                        } catch (IOException e) {
                                            throw new RuntimeException(e);
                                        }
                                    })
                                    .doOnError(e -> {
                                        log.error("总结流错误", e);
                                        try { sseEmitter.completeWithError(e); } catch (Exception ignored) {}
                                    })
                                    .doOnComplete(() -> {
                                        log.info("总结完成，关闭连接");
                                        try {
                                            flushAttachmentEvents(sseEmitter);
                                        } catch (Exception ignored) {
                                        }
                                        sseEmitter.complete();
                                    })
                                    .subscribe();

                            // 【关键】立即返回，让 subscribe 的回调去关闭连接
                            return;
                        }
                        sseEmitter.complete();

                    } catch (Exception e) {
                        state = AgentState.ERROR;
                        log.error("error executing agent", e);
                        try {
                            sseEmitter.send("执行错误: " + e.getMessage());
                        } catch (IOException ex) {
                            sseEmitter.completeWithError(ex);
                        }
                    } finally {
                        AttachmentRegistry.clear();
                        //清理资源
                        this.cleanup();
                    }
                }
        );
        // 设置超时回调
        sseEmitter.onTimeout(() -> {
            this.state = AgentState.ERROR;
            this.cleanup();
            log.warn("SSE 连接超时");
        });
        sseEmitter.onCompletion(() -> {
            if (this.state == AgentState.RUNNING) {
                this.state = AgentState.FINISHED;
            }
            this.cleanup();
            log.info("SSE 断开连接");
        });
        return sseEmitter;
    }


    /**
     * 定义单个步骤
     *
     * @return
     */
    public abstract String step();

    /**
     * 清理资源
     */
    protected void cleanup() {
        // 子类可以重写此方法来清理资源
    }

    private void flushAttachmentEvents(SseEmitter sseEmitter) throws IOException {
        if (attachmentService == null) {
            AttachmentRegistry.drainAll();
            return;
        }
        List<ChatAttachment> attachments = AttachmentRegistry.drainAll();
        for (ChatAttachment attachment : attachments) {
            AttachmentDto dto = attachmentService.toDto(attachment);
            sseEmitter.send(SseEmitter.event()
                    .name("attachment")
                    .data(dto));
        }
    }
}
