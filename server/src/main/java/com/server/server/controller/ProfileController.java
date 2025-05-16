package com.server.server.controller;

import com.server.server.entity.Profile;
import com.server.server.service.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/profiles")
public class ProfileController {

    private final ProfileService service;

    public ProfileController(ProfileService service) {
        this.service = service;
    }

    // Get all profiles - requires authentication
    @GetMapping
    public List<Profile> getAllProfiles(@AuthenticationPrincipal String userId) {
        System.out.println("Authenticated user ID: " + userId);
        return service.getAllProfiles();
    }

    // Get profile by ID - requires authentication
    @GetMapping("/{id}")
    public ResponseEntity<Profile> getProfile(@PathVariable UUID id, @AuthenticationPrincipal String userId) {
        System.out.println("Authenticated user ID: " + userId);
        return service.getProfileById(id.toString())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create profile - requires authentication
    @PostMapping
    public Profile createProfile(@RequestBody Profile profile, @AuthenticationPrincipal String userId) {
        System.out.println("Authenticated user ID: " + userId);
        profile.setUserId(UUID.fromString(userId));  // Convert String to UUID here
        return service.createOrUpdateProfile(profile);
    }

    // Update profile - requires authentication
    @PutMapping("/{id}")
    public ResponseEntity<Profile> updateProfile(@PathVariable UUID id,
                                                 @RequestBody Profile profile,
                                                 @AuthenticationPrincipal String userId) {
        System.out.println("Authenticated user ID: " + userId);
        return service.getProfileById(id.toString()).map(existing -> {
            // Only update fields explicitly from the request
            existing.setEmail(profile.getEmail());
            existing.setUsername(profile.getUsername());
            existing.setFirstName(profile.getFirstName());
            existing.setLastName(profile.getLastName());

            // New fields
            existing.setPhone(profile.getPhone());
            existing.setBio(profile.getBio());
            existing.setWebsite(profile.getWebsite());
            existing.setFollowers(profile.getFollowers());
            existing.setFollowing(profile.getFollowing());

            existing.setUserId(UUID.fromString(userId)); // keep the authenticated user ID consistent

            Profile updatedProfile = service.createOrUpdateProfile(existing);
            return ResponseEntity.ok(updatedProfile);
        }).orElse(ResponseEntity.notFound().build());
    }


    // Delete profile - requires authentication
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProfile(@PathVariable UUID id, @AuthenticationPrincipal String userId) {
        System.out.println("Authenticated user ID: " + userId);
        service.deleteProfile(id.toString());
        return ResponseEntity.noContent().build();
    }
}
