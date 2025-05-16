package com.server.server.controller;

import com.server.server.entity.Profile;
import com.server.server.service.ProfileService;
import com.server.server.service.StorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/profiles")
public class ProfileController {

    private final ProfileService service;
    private final StorageService storageService;

    public ProfileController(ProfileService service, StorageService storageService) {
        this.service = service;
        this.storageService = storageService;
    }

    @GetMapping
    public List<Profile> getAllProfiles(@AuthenticationPrincipal String userId) {
        System.out.println("Authenticated user ID: " + userId);
        return service.getAllProfiles();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Profile> getProfile(@PathVariable UUID id, @AuthenticationPrincipal String userId) {
        System.out.println("Authenticated user ID: " + userId);
        return service.getProfileById(id.toString())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Profile createProfile(@RequestBody Profile profile, @AuthenticationPrincipal String userId) {
        System.out.println("Authenticated user ID: " + userId);
        profile.setUserId(UUID.fromString(userId));
        return service.createOrUpdateProfile(profile);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Profile> updateProfile(@PathVariable UUID id,
                                                 @RequestBody Profile profile,
                                                 @AuthenticationPrincipal String userId) {
        return service.getProfileById(id.toString()).map(existing -> {
            existing.setEmail(profile.getEmail());
            existing.setUsername(profile.getUsername());
            existing.setFirstName(profile.getFirstName());
            existing.setLastName(profile.getLastName());
            existing.setPhone(profile.getPhone());
            existing.setBio(profile.getBio());
            existing.setWebsite(profile.getWebsite());
            existing.setFollowers(profile.getFollowers());
            existing.setFollowing(profile.getFollowing());
            existing.setUserId(UUID.fromString(userId));
            Profile updated = service.createOrUpdateProfile(existing);
            return ResponseEntity.ok(updated);
        }).orElse(ResponseEntity.notFound().build());
    }

    // New: Upload profile picture to Supabase Storage
    @PutMapping("/{id}/picture")
    public ResponseEntity<?> updateProfilePicture(@PathVariable UUID id,
                                                  @RequestParam("file") MultipartFile file) {
        System.out.println("=== Starting Profile Picture Update ===");
        System.out.println("Profile ID: " + id);
        System.out.println("File Info: " + file.getOriginalFilename()
                + " (" + file.getSize() + " bytes)");

        try {
            String imageUrl = storageService.uploadFile(file, id);
            System.out.println("Image URL from Storage: " + imageUrl);

            Profile updatedProfile = service.updateProfilePictureUrl(id, imageUrl);
            System.out.println("=== Update Successful ===");
            return ResponseEntity.ok(updatedProfile);

        } catch (Exception e) {
            System.err.println("!!! Update Failed !!!");
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(Map.of(
                            "error", "Failed to update profile picture",
                            "details", e.getMessage()
                    ));
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProfile(@PathVariable UUID id, @AuthenticationPrincipal String userId) {
        System.out.println("Authenticated user ID: " + userId);
        service.deleteProfile(id.toString());
        return ResponseEntity.noContent().build();
    }
}
