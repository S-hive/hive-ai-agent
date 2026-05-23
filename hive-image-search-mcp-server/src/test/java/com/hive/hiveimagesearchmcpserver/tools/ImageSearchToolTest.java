package com.hive.hiveimagesearchmcpserver.tools;

import jakarta.annotation.Resource;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ImageSearchToolTest {

    @Resource
    private ImageSearchTool imageSearchTool;

    @Test
    void searchImage() {
        String result = imageSearchTool.searchImage("猫");
        //https://images.pexels.com/photos/18924992/pexels-photo-18924992.jpeg?auto=compress&cs=tinysrgb&h=350,https://images.pexels
        Assertions.assertNotNull(result);

    }

    @Test
    void searchMediumImages() {
    }
}