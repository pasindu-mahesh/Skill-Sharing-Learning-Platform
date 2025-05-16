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
}
