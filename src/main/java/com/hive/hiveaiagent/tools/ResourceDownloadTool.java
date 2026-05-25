package com.hive.hiveaiagent.tools;

import cn.hutool.core.io.FileUtil;
import cn.hutool.http.HttpUtil;
import com.hive.hiveaiagent.attachment.AttachmentCategory;
import com.hive.hiveaiagent.attachment.AttachmentService;
import com.hive.hiveaiagent.attachment.ChatAttachment;
import com.hive.hiveaiagent.constant.FileConstant;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;

import java.io.File;

/**
 * 资源下载工具
 */
public class ResourceDownloadTool {

    private final AttachmentService attachmentService;

    public ResourceDownloadTool(AttachmentService attachmentService) {
        this.attachmentService = attachmentService;
    }

    @Tool(description = "Download a resource from a given URL")
    public String downloadResource(@ToolParam(description = "URL of the resource to download") String url, @ToolParam(description = "Name of the file to save the downloaded resource") String fileName) {
        String fileDir = FileConstant.FILE_SAVE_DIR + "/download";
        String filePath = fileDir + "/" + fileName;
        try {
            FileUtil.mkdir(fileDir);
            HttpUtil.downloadFile(url, new File(filePath));
            ChatAttachment attachment = attachmentService.register(new File(filePath), fileName, AttachmentCategory.DOWNLOAD);
            return "Resource downloaded successfully. attachmentId=" + attachment.getId();
        } catch (Exception e) {
            return "Error downloading resource: " + e.getMessage();
        }
    }
}
