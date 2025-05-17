package com.paf.skillsharing.model;

public class Post {

    private String id;          // Firebase document ID
    private String title;       // Post title or short heading
    private String description; // Main content of the post
    private String category;    // Coding, Cooking, etc.
    private String mediaUrl;    // Image/video Cloud Storage URL
    private String userId;      // Who posted it
    private long timestamp;     // UNIX timestamp

    // 🔁 Constructors
    public Post() {}

    public Post(String id, String title, String description, String category, String mediaUrl, String userId, long timestamp) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.category = category;
        this.mediaUrl = mediaUrl;
        this.userId = userId;
        this.timestamp = timestamp;
    }

    // 🔧 Getters & Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getMediaUrl() { return mediaUrl; }
    public void setMediaUrl(String mediaUrl) { this.mediaUrl = mediaUrl; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }
}
