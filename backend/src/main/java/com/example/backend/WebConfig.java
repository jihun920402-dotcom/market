package com.example.backend;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 실행 위치 기준 상대경로 → 어느 PC에서도 자동으로 잡힘
        Path uploadPath = Paths.get("uploads").toAbsolutePath();
        String absolutePath = "file:///" + uploadPath.toString().replace("\\", "/") + "/";

        registry.addResourceHandler("/images/**")
                .addResourceLocations(absolutePath);
    }
}