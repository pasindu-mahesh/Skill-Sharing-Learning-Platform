package com.server.server.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class SupabaseAuthService {
    @Value("${supabase.service.key}")
    private String serviceRoleKey;

    @Value("${supabase.service.url}")
    private String supabaseUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    // Your Supabase Auth URL here (replace with your actual Supabase URL)

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

    /**
     * Delete a user from Supabase Auth
     * @param userId - the user's ID to delete
     * @return true if successful, false otherwise
     */
    public boolean deleteUser(String userId) {
        String deleteUrl = "https://ysamcituxmazujhnmuhd.supabase.co/auth/v1/admin/users/" + userId;

        HttpHeaders headers = new HttpHeaders();
        headers.set("apikey", serviceRoleKey); // Use service key for both
        headers.set("Authorization", "Bearer " + serviceRoleKey); // Proper Bearer format

        HttpEntity<String> request = new HttpEntity<>(headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    deleteUrl,
                    HttpMethod.DELETE,
                    request,
                    String.class
            );
            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }


}
