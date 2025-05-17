package com.server.server.service;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class SupabaseAuthService {

    private final RestTemplate restTemplate = new RestTemplate();

    // Your Supabase Auth URL here (replace with your actual Supabase URL)
    private final String supabaseUrl = "https://ysamcituxmazujhnmuhd.supabase.co/auth/v1/user";

    /**
     * Update the password for a user in Supabase Auth
     * @param accessToken - user's valid Supabase JWT access token
     * @param newPassword - new password to set
     * @return true if successful, false otherwise
     */
    public boolean updatePassword(String accessToken, String newPassword) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, String> body = new HashMap<>();
        body.put("password", newPassword);

        HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(supabaseUrl, request, String.class);
            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
