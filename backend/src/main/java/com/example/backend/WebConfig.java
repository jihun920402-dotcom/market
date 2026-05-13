package com.example.backend;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    // WebConfig.java

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
    // 이동한 경로: C:/Users/Administrator/Desktop/정지훈/리엑트/market/backend/uploads/
        String absolutePath = "file:///C:/Users/Administrator/Desktop/정지훈/리엑트/market/backend/uploads/";

        registry.addResourceHandler("/images/**")
                .addResourceLocations(absolutePath);
        }


}