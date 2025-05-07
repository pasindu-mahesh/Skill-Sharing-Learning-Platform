package com.paf.skillsharing.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import com.paf.skillsharing.model.Post;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ExecutionException;

@Service
public class PostService {

    private static final String COLLECTION_NAME = "posts";

    // 🔵 CREATE Post
    public String savePost(Post post) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();

        if (post.getId() == null || post.getId().isEmpty()) {
            post.setId(UUID.randomUUID().toString());
        }
        post.setTimestamp(System.currentTimeMillis());

        ApiFuture<WriteResult> future = db.collection(COLLECTION_NAME)
                                          .document(post.getId())
                                          .set(post);

        return "Post created at: " + future.get().getUpdateTime();
    }

    // 🟡 UPDATE Post
    public String updatePost(String id, Post updatedPost) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();

        DocumentReference docRef = db.collection(COLLECTION_NAME).document(id);

        // Make sure ID remains same
        updatedPost.setId(id);
        updatedPost.setTimestamp(System.currentTimeMillis());

        ApiFuture<WriteResult> future = docRef.set(updatedPost);

        return "Post updated at: " + future.get().getUpdateTime();
    }

    // 📥 READ ALL Posts
    public List<Post> getAllPosts() throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        ApiFuture<QuerySnapshot> future = db.collection(COLLECTION_NAME).get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();

        List<Post> posts = new ArrayList<>();
        for (QueryDocumentSnapshot doc : documents) {
            posts.add(doc.toObject(Post.class));
        }
        return posts;
    }

    // 🔍 READ ONE Post by ID
    public Post getPostById(String id) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        DocumentSnapshot document = db.collection(COLLECTION_NAME).document(id).get().get();

        if (document.exists()) {
            return document.toObject(Post.class);
        }
        return null;
    }

    // ❌ DELETE Post by ID
    public String deletePost(String id) {
        Firestore db = FirestoreClient.getFirestore();
        db.collection(COLLECTION_NAME).document(id).delete();
        return "Post deleted with ID: " + id;
    }
}
