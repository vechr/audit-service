#!/bin/bash

# Build Image
docker build -f ./docker/Dockerfile.prod -t zulfikar4568/audit-service .

# Push Image
docker push zulfikar4568/audit-service:latest