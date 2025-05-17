package com.server.server.controller;

import com.server.server.service.SupabaseAuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final SupabaseAuthService supabaseAuthService;

    public UserController(SupabaseAuthService supabaseAuthService) {
        this.supabaseAuthService = supabaseAuthService;
    }

    /**
     * Change user password via Supabase Auth API
     * @param id - User ID (UUID string)
     * @param payload - JSON body containing "newPassword"
     * @param accessToken - Authenticated user's Supabase access token (injected by Spring Security)
     * @return 200 OK if success, 400 or 401 if failure
     */
    @PutMapping("/{id}/password")
    public ResponseEntity<String> changePassword(@PathVariable String id,
                                                 @RequestBody Map<String, String> payload,
                                                 @AuthenticationPrincipal String accessToken) {
        String newPassword = payload.get("newPassword");
        if (newPassword == null || newPassword.isEmpty()) {
            return ResponseEntity.badRequest().body("Missing 'newPassword' in request body");
        }

        boolean updated = supabaseAuthService.updatePassword(accessToken, newPassword);

        if (updated) {
            return ResponseEntity.ok("Password updated successfully");
        } else {
            return ResponseEntity.status(401).body("Failed to update password");
        }
    }
}
