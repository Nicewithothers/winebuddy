package com.nicewithothers.winebuddy.service;

import com.nicewithothers.winebuddy.config.MinioConfig;
import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.InputStream;

@Service
@RequiredArgsConstructor
public class MinioService {
    private final MinioConfig minioConfig;
    private final MinioClient minioClient;

    public void uploadFile(String objectName, InputStream inputStream, String contentType) {
        try {
            String bucketName = minioConfig.getBucket();
            boolean found = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());

            if (!found) {
                minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
            }
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectName)
                            .stream(inputStream, Integer.toUnsignedLong(inputStream.available()), -1)
                            .contentType(contentType)
                            .build()
            );
        } catch (Exception e) {
            throw new RuntimeException("Error occoured: " + e.getMessage());
        }
    }

}
