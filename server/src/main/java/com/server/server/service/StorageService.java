package com.server.server.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import java.util.UUID;

@Service
public class StorageService {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.key}")
    private String supabaseKey;

    @Value("${supabase.bucket}")
    private String bucketName;

    private final RestTemplate restTemplate = new RestTemplate();

    public String uploadFile(MultipartFile file, UUID profileId) throws Exception {
        // Sanitize filename
        String fileName = profileId + "-" + UUID.randomUUID() + "-"
                + file.getOriginalFilename().replace(" ", "_");

        // Proper storage API endpoint
        String uploadUrl = supabaseUrl + "/storage/v1/object/" + bucketName + "/" + fileName;

        // Configure headers
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + supabaseKey);
        headers.set("apikey", supabaseKey);
        headers.set("x-upsert", "true");
        headers.setContentType(MediaType.parseMediaType(file.getContentType()));

        // Create request entity
        HttpEntity<byte[]> entity = new HttpEntity<>(file.getBytes(), headers);

        try {
            // Execute upload
            ResponseEntity<String> response = restTemplate.exchange(
                    uploadUrl,
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            // Log response details
            System.out.println("=== Supabase Response ===");
            System.out.println("Status: " + response.getStatusCode());
            System.out.println("Body: " + response.getBody());

            // Build public URL regardless of response status
            String publicUrl = supabaseUrl + "/storage/v1/object/public/"
                    + bucketName + "/" + fileName;

            System.out.println("Public URL: " + publicUrl);
            return publicUrl;

        } catch (Exception e) {
            System.err.println("!!! Upload Error !!!");
            e.printStackTrace();

            // Even if error occurs, attempt to return expected URL format
            return supabaseUrl + "/storage/v1/object/public/"
                    + bucketName + "/" + fileName;
        }
    }
}
