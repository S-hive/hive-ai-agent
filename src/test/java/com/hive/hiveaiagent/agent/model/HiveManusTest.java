package com.hive.hiveaiagent.agent.model;

import jakarta.annotation.Resource;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class HiveManusTest {

    @Resource
    private HiveManus hiveManus;

    @Test
    public void run(){
        String userPrompt = """
                我现在只有Java基础, 想成为后端开发, 专业是云计算技术应用, 离毕业有一年时间, 请帮我规划学习路径和时长
                目前在深圳南山区, 帮我找找附近有没有自习室, 或者适合学习的地方
                """;
        String result = hiveManus.run(userPrompt);
        Assertions.assertNotNull(result);
    }
}