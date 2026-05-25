package com.hive.hiveaiagent.tools;

import cn.hutool.core.io.FileUtil;
import com.hive.hiveaiagent.attachment.AttachmentCategory;
import com.hive.hiveaiagent.attachment.AttachmentService;
import com.hive.hiveaiagent.attachment.ChatAttachment;
import com.hive.hiveaiagent.constant.FileConstant;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;

import java.io.File;

/**
 * 文件操作工具类（提供文件读写功能）
 */
public class FileOperationTool {

    private final AttachmentService attachmentService;
    private final String FILE_DIR = FileConstant.FILE_SAVE_DIR + "/file";

    public FileOperationTool(AttachmentService attachmentService) {
        this.attachmentService = attachmentService;
    }

    @Tool(description = "Read content from a file")
    public String readFile(@ToolParam(description = "Name of a file to read") String fileName) {
        String filePath = FILE_DIR + "/" + fileName;
        try {
            return FileUtil.readUtf8String(filePath);
        } catch (Exception e) {
            return "Error reading file: " + e.getMessage();
        }
    }

    @Tool(description = "Write content to a file")
    public String writeFile(@ToolParam(description = "Name of the file to write") String fileName,
                            @ToolParam(description = "Content to write to the file") String content
    ) {
        String filePath = FILE_DIR + "/" + fileName;

        try {
            FileUtil.mkdir(FILE_DIR);
            FileUtil.writeUtf8String(content, filePath);
            ChatAttachment attachment = attachmentService.register(new File(filePath), fileName, AttachmentCategory.FILE);
            return "File written successfully. attachmentId=" + attachment.getId();
        } catch (Exception e) {
            return "Error writing to file: " + e.getMessage();
        }
    }
}
