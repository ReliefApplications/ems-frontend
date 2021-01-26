#!/bin/bash

# Remove files
REMOTE_PATH=/var/www/html/ems-back-office
OUT=dist/back-office
CONNECTION=reliefapps@92.243.25.191

echo -e "Cleaning destination ..."
CMD="mkdir -p ${REMOTE_PATH} && cd ${REMOTE_PATH} && rm -rf *"
ssh -o strictHostKeyChecking=no -o PubkeyAuthentication=yes $CONNECTION "$CMD"

echo -e "Synchronizing files ..."
scp -o stricthostkeychecking=no -o PubkeyAuthentication=yes -r $OUT/* $CONNECTION:$REMOTE_PATH

echo -e "Deployed !!"
