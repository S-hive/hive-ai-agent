package com.hive.hiveaiagent.util;

import org.springframework.core.io.ClassPathResource;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;

public class PromptLoader {

    // 从 resources 下读取提示词文件
    public static String load(String fileName) throws IOException {
        ClassPathResource resource = new ClassPathResource(fileName);
        return Files.readString(resource.getFile().toPath(), StandardCharsets.UTF_8);
    }
}