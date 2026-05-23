package com.hive.hiveaiagent.app;

import jakarta.annotation.Resource;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.UUID;

@SpringBootTest
class StudyAppTest {

    @Resource
    private StudyApp studyApp;

    // 多轮对话
    @Test
    void doChat() {
        String name = UUID.randomUUID().toString();
        studyApp.doChat("我在深圳(回答60字内)", name);
        studyApp.doChat("今天天气好好(回答20字内)", name);
        studyApp.doChat("我在哪, 我刚刚和你说了的(回答20字内)", name);
    }

    @Test
    void doChatWithReport() {
        StudyApp.StudyReport studyReport = studyApp.doChatWithReport("我是hive, 我想在5.20在深圳南山区游玩", UUID.randomUUID().toString());
        System.out.println("studyReport = " + studyReport);
        Assertions.assertNotNull(studyReport);
    }

    @Test
    void doChatWithRag() {
        String studyReport = studyApp.doChatWithRag("A2A协议的设计原则是什么", UUID.randomUUID().toString());
        System.out.println("studyReport = " + studyReport);
        Assertions.assertNotNull(studyReport);
    }

    @Test
    void doChatWithTools() {

        // 测试联网搜索问题的答案
        testMessage("springBoot更新到哪个版本了?");

        // 测试网页抓取
        testMessage("看看面试鸭网站（https://www.mianshiya.com/）有哪些关于java的面试题");

        // 测试资源下载：图片下载
        testMessage("直接下载编程导航(https://www.codefather.cn/)的logo为文件");

        // 测试终端操作：执行代码
        testMessage("执行 Python3 脚本来生成数据分析报告");

        // 测试文件操作：保存用户档案
        testMessage("保存我上面的学习知识为文件");

        // 测试 PDF 生成
        testMessage("生成一份'学习计划'PDF，包含内容(java, springBoot),主要知识点");
    }

    private void testMessage(String message) {
        String chatId = UUID.randomUUID().toString();
        String answer = studyApp.doChatWithTools(message, chatId);
        Assertions.assertNotNull(answer);
    }

    @Test
    void doChatWithMcp() {
        String chatId = UUID.randomUUID().toString();
        String answer = studyApp.doChatWithMcp("请用MCP工具搜索一些小猫图片,链接给我", chatId);
        Assertions.assertNotNull(answer);

    }
}