package com.hive.hiveaiagent.controller;

import com.hive.hiveaiagent.attachment.AttachmentService;
import jakarta.annotation.Resource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;

@RestController
@RequestMapping("/attachments")
public class AttachmentController {

    @Resource
    private AttachmentService attachmentService;

    @GetMapping("/{attachmentId}")
    public ResponseEntity<FileSystemResource> download(
            @PathVariable String attachmentId,
            @RequestParam(defaultValue = "false") boolean inline) {
        try {
            Path path = attachmentService.resolveDownloadPath(attachmentId);
            var attachment = attachmentService.findById(attachmentId).orElseThrow();
            FileSystemResource resource = new FileSystemResource(path);

            String encodedName = URLEncoder.encode(attachment.getFileName(), StandardCharsets.UTF_8)
                    .replace("+", "%20");
            String dispositionType = inline && attachment.getMimeType().startsWith("image/")
                    ? "inline"
                    : "attachment";

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            dispositionType + "; filename*=UTF-8''" + encodedName)
                    .contentType(MediaType.parseMediaType(attachment.getMimeType()))
                    .contentLength(attachment.getSize())
                    .body(resource);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.notFound().build();
        } catch (SecurityException ex) {
            return ResponseEntity.badRequest().build();
        }
    }
}
