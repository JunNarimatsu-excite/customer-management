package com.example.customermanagement.controller;

import com.azure.storage.blob.BlobClient;
import com.example.customermanagement.service.BlobStorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/api/blob")
public class BlobController {

    private final BlobStorageService blobStorageService;

    public BlobController(BlobStorageService blobStorageService) {
        this.blobStorageService = blobStorageService;
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