package com.hive.hiveaiagent.attachment;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class ChatAttachment {

    private String id;
    private String fileName;
    private String mimeType;
    private long size;
    private AttachmentCategory category;
    private String storagePath;
    private Instant createdAt;
}
