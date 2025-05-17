package com.paf.skillsharing.controller;

import com.paf.skillsharing.model.Post;
import com.paf.skillsharing.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*") // Allow cross-origin requests (for frontend React app)
public class PostController {

    private final PostService postService;

    @Autowired
    public PostController(PostService postService) {
        this.postService = postService;
    }

    // ✅ CREATE Post
    @PostMapping
    public String createPost(@RequestBody Post post) {
        try {
            post.setId(null); // Ensure ID is null for new posts
            return postService.savePost(post);
        } catch (ExecutionException | InterruptedException e) {
            Thread.currentThread().interrupt(); // Restore interrupt status
            e.printStackTrace();
            return "Error creating post: " + e.getMessage();
        }
    }

    // ✅ UPDATE Post
    @PutMapping("/{id}")
    public String updatePost(@PathVariable String id, @RequestBody Post post) {
        try {
            post.setId(id); // Set the ID from URL to update the right doc
            return postService.savePost(post);
        } catch (ExecutionException | InterruptedException e) {
            Thread.currentThread().interrupt();
            e.printStackTrace();
            return "Error updating post: " + e.getMessage();
        }
    }

    // 📥 Get all Posts
    @GetMapping
    public List<Post> getAllPosts() {
        try {
            return postService.getAllPosts();
        } catch (ExecutionException | InterruptedException e) {
            Thread.currentThread().interrupt();
            e.printStackTrace();
            return List.of(); // return empty list on error
        }
    }

    // 🔍 Get a single Post by ID
    @GetMapping("/{id}")
    public Post getPostById(@PathVariable String id) {
        try {
            return postService.getPostById(id);
        } catch (ExecutionException | InterruptedException e) {
            Thread.currentThread().interrupt();
            e.printStackTrace();
            return null;
        }
    }

    // ❌ Delete a Post
    @DeleteMapping("/{id}")
    public String deletePost(@PathVariable String id) {
        try {
            return postService.deletePost(id);
        } catch (Exception e) {
            e.printStackTrace();
            return "Error deleting post: " + e.getMessage();
        }
    }
}
