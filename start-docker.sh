#!/bin/bash
cd /Users/sepg/Desktop/painttest2
docker-compose down
docker-compose up -d
echo "Docker containers starting..."
docker-compose ps