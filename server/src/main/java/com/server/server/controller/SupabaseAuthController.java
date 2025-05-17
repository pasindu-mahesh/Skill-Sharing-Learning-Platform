package com.server.server.controller;

import com.server.server.service.SupabaseAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClientResponseException;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class SupabaseAuthController {

    private final SupabaseAuthService supabaseAuthService;

    @Autowired
    public SupabaseAuthController(SupabaseAuthService supabaseAuthService) {
        this.supabaseAuthService = supabaseAuthService;
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<?> deleteAuthUser(@PathVariable String userId) {
        try {
            boolean success = supabaseAuthService.deleteUser(userId);
            if (!success) {
                return ResponseEntity.internalServerError()
                        .body(Map.of("error", "Deletion failed silently"));
            }
            return ResponseEntity.noContent().build();
        } catch (RestClientResponseException e) {
            return ResponseEntity.status(e.getRawStatusCode())
                    .header("X-Error-Detail", e.getResponseBodyAsString())
                    .body(Map.of(
                            "error", "Supabase API Error",
                            "code", e.getRawStatusCode()
                    ));
        }
    }


}
