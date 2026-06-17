package com.example.customermanagement.service;

import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.BlobServiceClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class BlobStorageService {

    private final BlobContainerClient containerClient;

    public BlobStorageService(
            @Value("${AZURE_STORAGE_CONNECTION_STRING}") String connectionString,
            @Value("${azure.storage.container-name}") String containerName) {

        BlobServiceClient serviceClient = new BlobServiceClientBuilder()
                .connectionString(connectionString)
                .buildClient();

        this.containerClient = serviceClient.getBlobContainerClient(containerName);
    }

    public BlobContainerClient getContainerClient() {
        return containerClient;
    }
}
