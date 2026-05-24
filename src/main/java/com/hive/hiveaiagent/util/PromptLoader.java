package com.hive.hiveaiagent.util;

import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.time.Instant;

public class PromptLoader {

    private static final String LOG_FILE = "debug-a7ed84.log";

    // #region agent log
    private static void debugLog(String hypothesisId, String location, String message, String dataJson) {
        try {
            String line = String.format(
                    "{\"sessionId\":\"a7ed84\",\"runId\":\"post-fix\",\"hypothesisId\":\"%s\",\"location\":\"%s\",\"message\":\"%s\",\"data\":%s,\"timestamp\":%d}%n",
                    hypothesisId, location, message, dataJson, Instant.now().toEpochMilli());
            Path logPath = Path.of(System.getProperty("user.dir"), LOG_FILE);
            Files.writeString(logPath, line, StandardOpenOption.CREATE, StandardOpenOption.APPEND);
        } catch (Exception ignored) {
        }
    }
    // #endregion

    // 从 resources 下读取提示词文件（兼容 IDE 与 fat jar 部署）
    public static String load(String fileName) throws IOException {
        ClassPathResource resource = new ClassPathResource(fileName);
        // #region agent log
        debugLog("H1", "PromptLoader:load", "resource metadata before read",
                "{\"fileName\":\"" + fileName
                        + "\",\"exists\":" + resource.exists()
                        + ",\"isFileSystemResource\":" + resource.isFile()
                        + ",\"description\":\"" + escape(resource.getDescription()) + "\"}");
        // #endregion

        try (InputStream inputStream = resource.getInputStream()) {
            String content = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
            // #region agent log
            debugLog("H2", "PromptLoader:load", "prompt loaded via InputStream",
                    "{\"fileName\":\"" + fileName + "\",\"contentLength\":" + content.length() + "}");
            // #endregion
            return content;
        }
    }

    private static String escape(String value) {
        if (value == null) {
            return "";
        }
        return value.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", " ");
    }
}
