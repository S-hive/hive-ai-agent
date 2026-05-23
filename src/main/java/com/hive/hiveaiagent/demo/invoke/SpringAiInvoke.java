package com.hive.hiveaiagent.demo.invoke;

import com.alibaba.cloud.ai.dashscope.api.DashScopeApi;
import com.alibaba.cloud.ai.dashscope.chat.DashScopeChatModel;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;

//@Component
public class SpringAiInvoke implements CommandLineRunner {

    @Value("${spring.ai.dashscope.api-key}")
    private String apiKey;


    @Override
    public void run(String... args) {
        // 创建 DashScope API 实例
        DashScopeApi dashScopeApi = DashScopeApi.builder()
                .apiKey(apiKey)
                .build();

        // 创建 ChatModel
        ChatModel chatModel = DashScopeChatModel.builder()
                .dashScopeApi(dashScopeApi)
                .build();
        AssistantMessage output = chatModel.call(new Prompt("今天好热"))
                .getResult()
                .getOutput();
        System.out.println("等待输出...");
        System.out.println("output = " + output);
    }

}
