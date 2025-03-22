package com.lms.attendance.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // ✅ CORS 해결 핵심 Security 설정 추가
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors()   // ✅ CorsConfig와 연결해줌
            .and()
            .csrf().disable()  // ✅ POST/PUT 테스트용 CSRF 비활성화
            .authorizeHttpRequests()
            .anyRequest().permitAll();  // ✅ 모든 요청 허용 (로그인 필요 없게)

        return http.build();
    }
}
