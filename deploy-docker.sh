#!/usr/bin/env sh

#SET AND REMOVE CONTAINER
echo [+] Getting Docker Container
docker ps -a

echo
read -p '[-] Input Container ID : ' containerID
echo [+] Set Container to $containerID

echo [+] Stopping Container
docker stop $containerID

echo [+] Removing Container
docker rm -f $containerID

#REMOVE DOCKER IMAGES
echo
echo [*] Getting Docker Images
docker images

echo
read -p '[-] Input Image ID : ' imageID
echo [+] Set Image to $imageID

echo [+] Removing Image
docker rmi $imageID

#BUILD PROJECT
echo
echo [+] Building Project
docker build -t sajiin-v1/sajiin-fe-v1:latest .

#RUN PROJECT
echo
echo [+] Running Project
docker run -d --restart always --name sajiin-fe-v1 -p 8081:80 sajiin-v1/sajiin-fe-v1:latest

echo
echo [+] App Deploye