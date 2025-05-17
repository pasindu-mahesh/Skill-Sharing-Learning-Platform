package com.server.server.service;

import com.server.server.entity.UserFollow;
import com.server.server.repository.UserFollowRepository;
import com.server.server.repository.ProfileRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;  // Add this import
import java.util.UUID;

@Service
public class UserFollowService {

    private final UserFollowRepository followRepo;
    private final ProfileRepository profileRepo;

    public UserFollowService(UserFollowRepository followRepo,
                             ProfileRepository profileRepo) {
        this.followRepo = followRepo;
        this.profileRepo = profileRepo;
    }

    @Transactional
    public boolean followUser(UUID followerId, UUID followingId) {
        // Prevent self-follow
        if (followerId.equals(followingId)) {
            return false;
        }

        // Check existing relationship first
        if (followRepo.existsByFollowerIdAndFollowingId(followerId, followingId)) {
            return false;
        }

        try {
            // Create and save new relationship
            UserFollow userFollow = new UserFollow(followerId, followingId);
            followRepo.save(userFollow);

            // Update counts only after successful save
//            profileRepo.incrementFollowing(followerId);
//            profileRepo.incrementFollowers(followingId);

            return true;
        } catch (DataIntegrityViolationException e) {
            // Handle concurrent requests that might pass the initial exists check
            return false;
        }
    }

    @Transactional
    public boolean unfollowUser(UUID followerId, UUID followingId) {
        if (!followRepo.existsByFollowerIdAndFollowingId(followerId, followingId)) {
            return false; // Not following
        }

        // Remove follow relationship
        followRepo.deleteByFollowerIdAndFollowingId(followerId, followingId);

        // Use wrong method names here
//        profileRepo.decrementFollowing(followerId);
//        profileRepo.decrementFollowers(followingId);

        return true;
    }

    // Add appropriate return types with imports
    public List<UserFollow> getFollowing(UUID followerId) {
        return followRepo.findByFollowerId(followerId);
    }

    public List<UserFollow> getFollowers(UUID followingId) {
        return followRepo.findByFollowingId(followingId);
    }
}
