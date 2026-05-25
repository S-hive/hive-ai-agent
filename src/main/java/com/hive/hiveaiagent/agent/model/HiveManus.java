package com.hive.hiveaiagent.agent.model;

import com.hive.hiveaiagent.adviso.MyLoggerAdvisor;
import com.hive.hiveaiagent.attachment.AttachmentService;
import com.hive.hiveaiagent.util.PromptLoader;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.tool.ToolCallback;
import org.springframework.stereotype.Component;

@Component
public class HiveManus extends ToolCallAgent {
    public HiveManus(ToolCallback[] allTools, ChatModel dashscopeChatModel, AttachmentService attachmentService) {
        super(allTools);
        this.setAttachmentService(attachmentService);
        this.setName("hiveManus");
        try {
            this.setSystemPrompt(PromptLoader.load("prompt/SystemPrompt.md"));
            this.setNextStepPrompt(PromptLoader.load("prompt/ManusNextStepPrompt.md"));
            this.setSummaryUserPrompt(PromptLoader.load("prompt/ManusSummaryPrompt.md"));
        } catch (Exception e) {
            throw new IllegalStateException("Failed to load Manus prompts", e);
        }

        this.setMaxSteps(20);
        // 初始化 AI 对话客户端
        ChatClient chatClient = ChatClient.builder(dashscopeChatModel)
                .defaultAdvisors(new MyLoggerAdvisor())
                .build();
        this.setChatClient(chatClient);

    }
}
