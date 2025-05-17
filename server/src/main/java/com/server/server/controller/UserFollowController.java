package com.server.server.controller;

import com.server.server.entity.UserFollow;
import com.server.server.service.UserFollowService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/follows")
public class UserFollowController {

    private final UserFollowService followService;

    public UserFollowController(UserFollowService followService) {
        this.followService = followService;
    }

    @PostMapping("/{followerId}/follow/{followingId}")
    public ResponseEntity<String> followUser(@PathVariable UUID followerId, @PathVariable UUID followingId) {
        boolean success = followService.followUser(followerId, followingId);
        if (success) {
            return ResponseEntity.ok("User followed successfully");
        } else {
            return ResponseEntity.badRequest().body("Failed to follow user (maybe already following or same user)");
        }
    }

    @DeleteMapping("/{followerId}/unfollow/{followingId}")
    public ResponseEntity<String> unfollowUser(@PathVariable UUID followerId, @PathVariable UUID followingId) {
        boolean success = followService.unfollowUser(followerId, followingId);
        if (success) {
            return ResponseEntity.ok("User unfollowed successfully");
        } else {
            return ResponseEntity.badRequest().body("Failed to unfollow user (maybe not following)");
        }
    }

    @GetMapping("/{userId}/followers")
    public ResponseEntity<List<UUID>> getFollowers(@PathVariable UUID userId) {
        List<UserFollow> followers = followService.getFollowers(userId);
        List<UUID> followerIds = followers.stream()
                .map(UserFollow::getFollowerId)
                .collect(Collectors.toList());
        return ResponseEntity.ok(followerIds);
    }

    @GetMapping("/{userId}/following")
    public ResponseEntity<List<UUID>> getFollowing(@PathVariable UUID userId) {
        List<UserFollow> following = followService.getFollowing(userId);
        List<UUID> followingIds = following.stream()
                .map(UserFollow::getFollowingId)
                .collect(Collectors.toList());
        return ResponseEntity.ok(followingIds);
    }
}
