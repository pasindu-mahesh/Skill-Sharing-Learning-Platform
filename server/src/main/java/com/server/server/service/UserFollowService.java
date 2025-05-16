package com.server.server.service;

import com.server.server.entity.UserFollow;
import com.server.server.repository.UserFollowRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class UserFollowService {

    private final UserFollowRepository followRepo;

    public UserFollowService(UserFollowRepository followRepo) {
        this.followRepo = followRepo;
    }

    public boolean followUser(UUID followerId, UUID followingId) {
        if (followerId.equals(followingId)) {
            return false; // cannot follow yourself
        }
        if (followRepo.existsByFollowerIdAndFollowingId(followerId, followingId)) {
            return false; // already following
        }
        UserFollow userFollow = new UserFollow(followerId, followingId);
        followRepo.save(userFollow);
        return true;
    }

    @Transactional
    public boolean unfollowUser(UUID followerId, UUID followingId) {
        if (!followRepo.existsByFollowerIdAndFollowingId(followerId, followingId)) {
            return false; // not following
        }
        followRepo.deleteByFollowerIdAndFollowingId(followerId, followingId);
        return true;
    }

    public List<UserFollow> getFollowing(UUID followerId) {
        return followRepo.findByFollowerId(followerId);
    }

    public List<UserFollow> getFollowers(UUID followingId) {
        return followRepo.findByFollowingId(followingId);
    }
}
