package com.hive.hiveaiagent.attachment;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AttachmentDto {

    private String id;
    private String fileName;
    private String mimeType;
    private long size;
    private String url;
}
