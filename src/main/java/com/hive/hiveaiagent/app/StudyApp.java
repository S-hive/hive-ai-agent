package com.hive.hiveaiagent.app;

import com.hive.hiveaiagent.adviso.MyLoggerAdvisor;
import com.hive.hiveaiagent.chatmemory.FileBasedChatMemory;
import com.hive.hiveaiagent.util.PromptLoader;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.client.advisor.api.Advisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.tool.ToolCallback;
//import org.springframework.ai.tool.ToolCallbackProvider;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;

import java.io.IOException;
import java.io.Serializable;
import java.util.List;

/**
 * 旅游规划app
 */
@Slf4j
@Component
public class StudyApp {

    private ChatClient chatClient;

    private final String SYSTEM_PROMPT;
    private final String RESPONSE_STYLE;

    /**
     * 初始化
     *
     * @param dashscopeChatModel
     */
    public StudyApp(ChatModel dashscopeChatModel) throws IOException {
        this.SYSTEM_PROMPT = PromptLoader.load("prompt/SystemPrompt.md");
        this.RESPONSE_STYLE = PromptLoader.load("prompt/StudyResponseStyle.md");
        // 初始化基于文件的对话记忆
        String fileDir = System.getProperty("user.dir") + "/tmp/chat-memory";
        FileBasedChatMemory chatMemory = new FileBasedChatMemory(fileDir);

        /*// 初始化基于内存的对话记忆
        MessageWindowChatMemory chatMemory = MessageWindowChatMemory.builder()
                .chatMemoryRepository(new InMemoryChatMemoryRepository())
                .maxMessages(20)
                .build();*/
        chatClient = ChatClient.builder(dashscopeChatModel)
                .defaultSystem(SYSTEM_PROMPT + "\n\n" + RESPONSE_STYLE)
                .defaultAdvisors(
                        MessageChatMemoryAdvisor.builder(chatMemory).build(),
                        new MyLoggerAdvisor()
                        //new ReReadingAdvisor()
                ).build();
    }

    /**
     * AI 基础对话 (支持多轮对话记忆 基于内存)
     *
     * @param message
     * @param chatId
     * @return
     */
    public String doChat(String message, String chatId) {
        ChatResponse chatResponse = chatClient.prompt()
                .user(message)
                .advisors(spec -> spec.param(ChatMemory.CONVERSATION_ID, chatId))
                .call()
                .chatResponse();
        String content = chatResponse.getResult().getOutput().getText();
        log.info("content: {}", content);
        return content;
    }

    /**
     * AI 基础对话（支持多轮对话记忆，SSE 流式传输）
     *
     * @param message
     * @param chatId
     * @return
     */
    public Flux<String> doChatByStream(String message, String chatId) {
        return chatClient
                .prompt()
                .user(message)
                .advisors(spec -> spec.param(ChatMemory.CONVERSATION_ID, chatId))
                .stream()
                .content();
    }

    // 结构化输出
    record StudyReport(String title, List<String> suggestions) implements Serializable {

    }


    /**
     * AI 旅游计划报告 (结构化输出)
     *
     * @param message
     * @param chatId
     * @return
     */
    public StudyReport doChatWithReport(String message, String chatId) {
        StudyReport studyReport = chatClient.prompt()
                .system(SYSTEM_PROMPT + "每次对话都要输出计划报告, 标题为{用户名}的学习计划报告, 内容建议为列表")
                .user(message)
                .advisors(spec -> spec.param(ChatMemory.CONVERSATION_ID, chatId))
                .call()
                .entity(StudyReport.class);
        log.info("StudyReport: {}", studyReport);
        return studyReport;
    }

    // 问答功能

    @Autowired
    @Qualifier("StudyAppVectorStore")
    private VectorStore studyAppVectorStore;

    @Resource
    private Advisor studyAppRagCloudAdvisor;

/*
    @Autowired
    @Qualifier("pgVectorVectorStore")
    private VectorStore pgVectorVectorStore;
*/

    /**
     * 和 RAG 知识库进行对话
     *
     * @param message
     * @param chatId
     * @return
     */
    public String doChatWithRag(String message, String chatId) {
        ChatResponse chatResponse = chatClient
                .prompt()
                .user(message)
                .advisors(spec -> spec.param(ChatMemory.CONVERSATION_ID, chatId))
                // 开启日志，便于观察效果
                .advisors(new MyLoggerAdvisor())
                // 应用 RAG 知识库问答
                //.advisors(new QuestionAnswerAdvisor(studyAppVectorStore))
                //应用 RAG 检索增强服务 (基于云知识库服务)
                .advisors(studyAppRagCloudAdvisor)
                // 应用 RAG 检索增强服务 (基于 PgVector 向量存储)
                //.advisors(new QuestionAnswerAdvisor(pgVectorVectorStore))
                .call()
                .chatResponse();

        String content = chatResponse.getResult().getOutput().getText();
        log.info("content: {}", content);
        return content;
    }

    // AI 调用工具能力
    @Resource
    private ToolCallback[] allTools;

    /**
     * AI 报告功能（支持调用工具）
     *
     * @param message
     * @param chatId
     * @return
     */
    public String doChatWithTools(String message, String chatId) {
        ChatResponse chatResponse = chatClient
                .prompt()
                .user(message)
                .advisors(spec -> spec.param(ChatMemory.CONVERSATION_ID, chatId))
                // 开启日志，便于观察效果
                .advisors(new MyLoggerAdvisor())
                .toolCallbacks(allTools)
                .call()
                .chatResponse();
        String content = chatResponse.getResult().getOutput().getText();
        log.info("content: {}", content);
        return content;
    }

    // AI 调用 MCP 服务
//    @Resource
//    private ToolCallbackProvider toolCallbackProvider;
//
//    /**
//     * AI 报告功能（调用 MCP 服务）
//     *
//     * @param message
//     * @param chatId
//     * @return
//     */
//    public String doChatWithMcp(String message, String chatId) {
//        ChatResponse chatResponse = chatClient
//                .prompt()
//                .user(message)
//                .advisors(spec -> spec.param(ChatMemory.CONVERSATION_ID, chatId))
//                // 开启日志，便于观察效果
//                .advisors(new MyLoggerAdvisor())
//                .toolCallbacks(toolCallbackProvider)
//                .call()
//                .chatResponse();
//
//        String content = chatResponse.getResult().getOutput().getText();
//        log.info("content: {}", content);
//        return content;
//    }

}
