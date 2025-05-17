package com.server.server.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "user_follows")
public class UserFollow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // Use IDENTITY to avoid sequence errors
    private Long id;

    @Column(name = "follower_id", nullable = false)
    private UUID followerId;

    @Column(name = "following_id", nullable = false)
    private UUID followingId;

    public UserFollow() {}

    public UserFollow(UUID followerId, UUID followingId) {
        this.followerId = followerId;
        this.followingId = followingId;
    }

    public Long getId() {
        return id;
    }

    public UUID getFollowerId() {
        return followerId;
    }

    public void setFollowerId(UUID followerId) {
        this.followerId = followerId;
    }

    public UUID getFollowingId() {
        return followingId;
    }

    public void setFollowingId(UUID followingId) {
        this.followingId = followingId;
    }
}
