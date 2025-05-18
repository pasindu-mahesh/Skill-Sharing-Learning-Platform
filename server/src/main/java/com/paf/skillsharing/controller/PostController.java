package com.paf.skillsharing.controller;

import com.paf.skillsharing.model.Post;
import com.paf.skillsharing.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*")
public class PostController {

    private final PostService postService;

    @Autowired
    public PostController(PostService postService) {
        this.postService = postService;
    }

    // ✅ CREATE Post
    @PostMapping
    public ResponseEntity<String> createPost(@RequestBody Post post) {
        try {
            post.setId(null); // Ensure ID is null for new posts
            String result = postService.savePost(post);
            return ResponseEntity.ok(result);
        } catch (ExecutionException | InterruptedException e) {
            Thread.currentThread().interrupt();
            return ResponseEntity.internalServerError().body("Error creating post: " + e.getMessage());
        }
    }

    // ✅ UPDATE Post
    @PutMapping("/{id}")
    public ResponseEntity<String> updatePost(@PathVariable String id, @RequestBody Post post) {
        try {
            post.setId(id);
            String result = postService.savePost(post);
            return ResponseEntity.ok(result);
        } catch (ExecutionException | InterruptedException e) {
            Thread.currentThread().interrupt();
            return ResponseEntity.internalServerError().body("Error updating post: " + e.getMessage());
        }
    }

    // 📥 Get all Posts
    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        try {
            List<Post> posts = postService.getAllPosts();
            return ResponseEntity.ok(posts);
        } catch (ExecutionException | InterruptedException e) {
            Thread.currentThread().interrupt();
            return ResponseEntity.internalServerError().body(List.of());
        }
    }

    // 🔍 Get a single Post by ID
    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable String id) {
        try {
            Post post = postService.getPostById(id);
            if (post != null) {
                return ResponseEntity.ok(post);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (ExecutionException | InterruptedException e) {
            Thread.currentThread().interrupt();
            return ResponseEntity.internalServerError().build();
        }
    }

    // ❌ DELETE a Post
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePost(@PathVariable String id) {
        try {
            String result = postService.deletePost(id);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error deleting post: " + e.getMessage());
        }
    }
}
