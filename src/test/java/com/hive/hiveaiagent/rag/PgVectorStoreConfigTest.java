package com.hive.hiveaiagent.rag;

import jakarta.annotation.Resource;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.Map;

@SpringBootTest
class PgVectorStoreConfigTest {


    @Autowired
    @Qualifier("pgVectorVectorStore")
    private VectorStore pgVectorVectorStore;

    @Test
    void pgVectorVectorStore() {
        List<Document> documents = List.of(
                new Document("小狗汪汪叫"),
                new Document("猫粮好吃"),
                new Document("猫咖"));

        // 添加文档
        pgVectorVectorStore.add(documents);

        // 相似度查询
        List<Document> results = pgVectorVectorStore.similaritySearch(SearchRequest.builder().query("小猫").topK(2).build());
        System.out.println("results = " + results);
        Assertions.assertNotNull(results);
    }
}