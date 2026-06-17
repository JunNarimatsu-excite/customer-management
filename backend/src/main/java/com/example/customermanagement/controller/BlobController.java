package com.example.customermanagement.controller;

import com.azure.storage.blob.BlobClient;
import com.example.customermanagement.service.BlobStorageService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

@RestController
@RequestMapping("/api/blob")
public class BlobController {

    private final BlobStorageService blobStorageService;

    public BlobController(BlobStorageService blobStorageService) {
        this.blobStorageService = blobStorageService;
    }


    @GetMapping("/view")
    public ResponseEntity<byte[]> view(@RequestParam("url") String url) throws Exception {
        String decodedUrl = URLDecoder.decode(url, StandardCharsets.UTF_8);

        String fileName = decodedUrl.substring(decodedUrl.lastIndexOf("/") + 1);

        BlobClient blobClient =
                blobStorageService
                        .getContainerClient()
                        .getBlobClient(fileName);

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        blobClient.downloadStream(outputStream);

        String contentType = blobClient.getProperties().getContentType();
        if (contentType == null || contentType.isBlank()) {
            contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .body(outputStream.toByteArray());
    }

    @PostMapping("/upload")
    public ResponseEntity<String> upload(
            @RequestParam("file") MultipartFile file) throws Exception {

        String fileName =
                UUID.randomUUID() + "-" + file.getOriginalFilename();

        BlobClient blobClient =
                blobStorageService
                        .getContainerClient()
                        .getBlobClient(fileName);

        blobClient.upload(file.getInputStream(), file.getSize(), true);

        return ResponseEntity.ok(blobClient.getBlobUrl());
    }
}