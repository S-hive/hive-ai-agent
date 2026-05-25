package com.hive.hiveaiagent.attachment;

import com.hive.hiveaiagent.constant.FileConstant;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.time.Instant;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AttachmentService {

    private final Map<String, ChatAttachment> attachments = new ConcurrentHashMap<>();

    public ChatAttachment register(File file, String fileName, AttachmentCategory category) {
        if (file == null || !file.exists() || !file.isFile()) {
            throw new IllegalArgumentException("Attachment file does not exist: " + file);
        }
        validateStoragePath(file.toPath());

        String safeName = sanitizeFileName(fileName != null ? fileName : file.getName());
        String mimeType = MimeTypeUtils.resolve(safeName, file.toPath());
        ChatAttachment attachment = ChatAttachment.builder()
                .id(UUID.randomUUID().toString())
                .fileName(safeName)
                .mimeType(mimeType)
                .size(file.length())
                .category(category)
                .storagePath(file.getAbsolutePath())
                .createdAt(Instant.now())
                .build();

        attachments.put(attachment.getId(), attachment);
        AttachmentRegistry.add(attachment);
        return attachment;
    }

    public Optional<ChatAttachment> findById(String attachmentId) {
        if (attachmentId == null || attachmentId.isBlank()) {
            return Optional.empty();
        }
        return Optional.ofNullable(attachments.get(attachmentId));
    }

    public Path resolveDownloadPath(String attachmentId) {
        ChatAttachment attachment = findById(attachmentId)
                .orElseThrow(() -> new IllegalArgumentException("Attachment not found"));
        Path path = Path.of(attachment.getStoragePath()).normalize();
        validateStoragePath(path);
        if (!path.toFile().exists()) {
            throw new IllegalArgumentException("Attachment file missing on disk");
        }
        return path;
    }

    public AttachmentDto toDto(ChatAttachment attachment) {
        return AttachmentDto.builder()
                .id(attachment.getId())
                .fileName(attachment.getFileName())
                .mimeType(attachment.getMimeType())
                .size(attachment.getSize())
                .url("/attachments/" + attachment.getId())
                .build();
    }

    private void validateStoragePath(Path path) {
        Path baseDir = Path.of(FileConstant.FILE_SAVE_DIR).toAbsolutePath().normalize();
        Path normalized = path.toAbsolutePath().normalize();
        if (!normalized.startsWith(baseDir)) {
            throw new SecurityException("Attachment path is outside allowed directory");
        }
    }

    private String sanitizeFileName(String fileName) {
        return fileName.replace("\\", "/").replaceAll(".*/", "");
    }
}
