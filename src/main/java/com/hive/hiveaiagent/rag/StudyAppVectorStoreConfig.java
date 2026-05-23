package com.hive.hiveaiagent.rag;

import jakarta.annotation.Resource;
import org.springframework.ai.document.Document;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.ai.vectorstore.SimpleVectorStore;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * 向量数据库配置 (基于内存的向量数据库 Bean)
 */
@Configuration
public class StudyAppVectorStoreConfig {

    @Resource
    private StudyAppDocumentLoader studyAppDocumentLoader;



    @Bean
    VectorStore StudyAppVectorStore(EmbeddingModel dashscopeEmbeddingModel) {
        // 创建一个基于内存的轻量向量库
        SimpleVectorStore simpleVectorStore = SimpleVectorStore.builder(dashscopeEmbeddingModel).build();
        // 加载之前解析好的 Markdown 文档
        List<Document> documentList = studyAppDocumentLoader.loadMarkdowns();
        // 调用 Embedding 模型把文档转成向量并存入向量库
        simpleVectorStore.add(documentList);
        return simpleVectorStore;
    }
}
