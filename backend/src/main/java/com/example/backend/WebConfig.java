package com.example.backend;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 경로의 'uploasds'를 'uploads'로 수정했습니다.
        String absolutePath = "file:///C:/Users/Administrator/Desktop/정지훈/Microsoft VS Code/market/backend/uploads/";

        registry.addResourceHandler("/images/**")
                .addResourceLocations(absolutePath);
    }
}