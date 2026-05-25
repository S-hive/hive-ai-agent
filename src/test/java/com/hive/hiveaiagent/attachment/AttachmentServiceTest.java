package com.hive.hiveaiagent.attachment;

import com.hive.hiveaiagent.constant.FileConstant;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.io.File;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

class AttachmentServiceTest {

    @Test
    void registerAndResolveAttachment() throws Exception {
        AttachmentService attachmentService = new AttachmentService();
        Path dir = Path.of(FileConstant.FILE_SAVE_DIR, "file");
        Files.createDirectories(dir);
        Path filePath = dir.resolve("attachment-test.txt");
        Files.writeString(filePath, "hello attachment", StandardCharsets.UTF_8);

        ChatAttachment attachment = attachmentService.register(
                filePath.toFile(),
                "attachment-test.txt",
                AttachmentCategory.FILE
        );

        Assertions.assertNotNull(attachment.getId());
        Assertions.assertEquals("text/plain", attachment.getMimeType());
        Assertions.assertTrue(attachmentService.findById(attachment.getId()).isPresent());
        Assertions.assertEquals(filePath, attachmentService.resolveDownloadPath(attachment.getId()));

        AttachmentDto dto = attachmentService.toDto(attachment);
        Assertions.assertEquals("/attachments/" + attachment.getId(), dto.getUrl());
    }

    @Test
    void rejectPathOutsideTmpDirectory() throws Exception {
        AttachmentService attachmentService = new AttachmentService();
        Path outside = Path.of(System.getProperty("java.io.tmpdir"), "outside-attachment-test.txt");
        Files.writeString(outside, "outside", StandardCharsets.UTF_8);
        Assertions.assertThrows(SecurityException.class, () ->
                attachmentService.register(outside.toFile(), "outside.txt", AttachmentCategory.FILE));
    }
}
