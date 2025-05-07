package com.paf.skillsharing.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // ❌ CSRF disabled
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()  // ✅ PERMIT ALL endpoints
            )
            .formLogin(form -> form.disable()) // ❌ No form login
            .httpBasic(basic -> basic.disable()); // ❌ No HTTP Basic Auth

        return http.build();
    }
}
