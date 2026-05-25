package com.hive.hiveaiagent.attachment;

import java.nio.file.Files;
import java.nio.file.Path;

public final class MimeTypeUtils {

    private MimeTypeUtils() {
    }

    public static String resolve(String fileName, Path filePath) {
        try {
            String probed = Files.probeContentType(filePath);
            if (probed != null && !probed.isBlank()) {
                return probed;
            }
        } catch (Exception ignored) {
        }
        String lower = fileName == null ? "" : fileName.toLowerCase();
        if (lower.endsWith(".pdf")) {
            return "application/pdf";
        }
        if (lower.endsWith(".png")) {
            return "image/png";
        }
        if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) {
            return "image/jpeg";
        }
        if (lower.endsWith(".gif")) {
            return "image/gif";
        }
        if (lower.endsWith(".webp")) {
            return "image/webp";
        }
        if (lower.endsWith(".svg")) {
            return "image/svg+xml";
        }
        if (lower.endsWith(".txt")) {
            return "text/plain";
        }
        if (lower.endsWith(".md")) {
            return "text/markdown";
        }
        if (lower.endsWith(".json")) {
            return "application/json";
        }
        return "application/octet-stream";
    }
}
