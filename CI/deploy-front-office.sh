#!/bin/bash

# Remove files
REMOTE_PATH=/var/www/html/ems-front-office
OUT=dist/back-office
CONNECTION=newton@92.243.16.149

echo -e "Cleaning destination ..."
CMD="mkdir -p ${REMOTE_PATH} && cd ${REMOTE_PATH} && rm -rf *"
ssh -oStrictHostKeyChecking=no -o PubkeyAuthentication=yes $CONNECTION "$CMD"

echo -e "Synchronizing files ..."
scp -o stricthostkeychecking=no -o PubkeyAuthentication=yes -r $OUT/* $CONNECTION:$REMOTE_PATH

echo -e "Deployed !!"
