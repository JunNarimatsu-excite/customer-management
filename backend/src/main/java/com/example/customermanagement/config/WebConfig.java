package com.example.customermanagement.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {

    private final LoginCheckInterceptor loginCheckInterceptor;
    private final AdminCheckInterceptor adminCheckInterceptor;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://20.196.152.70:30080")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin")
                .exposedHeaders("Set-Cookie")
                .allowCredentials(true);
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {

        registry.addInterceptor(loginCheckInterceptor)
                .addPathPatterns(
                        "/api/customers/**",
                        "/api/dashboard"
                );

        registry.addInterceptor(adminCheckInterceptor)
                .addPathPatterns(
                        "/api/users/**",
                        "/api/statuses/**",
                        "/api/audit-logs/**"
                );
    }
}