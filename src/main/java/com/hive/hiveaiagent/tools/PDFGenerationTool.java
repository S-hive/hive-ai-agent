package com.hive.hiveaiagent.tools;

import cn.hutool.core.io.FileUtil;
import com.hive.hiveaiagent.attachment.AttachmentCategory;
import com.hive.hiveaiagent.attachment.AttachmentService;
import com.hive.hiveaiagent.attachment.ChatAttachment;
import com.hive.hiveaiagent.constant.FileConstant;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;

import java.io.File;
import java.io.IOException;

/**
 * PDF 生成工具
 */
public class PDFGenerationTool {

    private final AttachmentService attachmentService;

    public PDFGenerationTool(AttachmentService attachmentService) {
        this.attachmentService = attachmentService;
    }

    @Tool(description = "Generate a PDF file with given content. Content must be plain text without emoji or decorative icon symbols.", returnDirect = false)
    public String generatePDF(
            @ToolParam(description = "Name of the file to save the generated PDF") String fileName,
            @ToolParam(description = "Content to be included in the PDF") String content) {
        String fileDir = FileConstant.FILE_SAVE_DIR + "/pdf";
        String filePath = fileDir + "/" + fileName;
        try {
            FileUtil.mkdir(fileDir);
            try (PdfWriter writer = new PdfWriter(filePath);
                 PdfDocument pdf = new PdfDocument(writer);
                 Document document = new Document(pdf)) {
                PdfFont font = PdfFontFactory.createFont("STSongStd-Light", "UniGB-UCS2-H");
                document.setFont(font);
                Paragraph paragraph = new Paragraph(content);
                document.add(paragraph);
            }
            ChatAttachment attachment = attachmentService.register(new File(filePath), fileName, AttachmentCategory.PDF);
            return "PDF generated successfully. attachmentId=" + attachment.getId();
        } catch (IOException e) {
            return "Error generating PDF: " + e.getMessage();
        }
    }
}
