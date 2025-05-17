package com.server.server.service;

import com.server.server.entity.Profile;
import com.server.server.repository.ProfileRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProfileService {

    private final ProfileRepository repo;

    public ProfileService(ProfileRepository repo) {
        this.repo = repo;
    }

    public List<Profile> getAllProfiles() {
        return repo.findAll();
    }

    public Optional<Profile> getProfileById(String id) {
        UUID uuid = UUID.fromString(id);
        return repo.findById(uuid);
    }

    public Profile createOrUpdateProfile(Profile profile) {
        return repo.save(profile);
    }

    public void deleteProfile(String id) {
        UUID uuid = UUID.fromString(id);
        repo.deleteById(uuid);
    }

    public Profile updateProfilePictureUrl(UUID profileId, String imageUrl) {
        return repo.findById(profileId)
                .map(profile -> {
                    System.out.println("Updating profile picture URL: " + imageUrl);
                    profile.setProfilePictureUrl(imageUrl);
                    Profile saved = repo.save(profile);
                    System.out.println("Profile updated successfully");
                    return saved;
                })
                .orElseThrow(() -> {
                    System.err.println("Profile not found: " + profileId);
                    return new RuntimeException("Profile not found");
                });
    }
}
