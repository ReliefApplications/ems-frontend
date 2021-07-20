#!/bin/bash

# Remove files
REMOTE_PATH=/var/www/html/safe-app
OUT=dist/ra-front-office
CONNECTION=bob@92.243.24.59

set -e

echo -e "Creating destination ..."
CMD="'""echo '$SSH_PASS' | sudo -S mkdir -p $REMOTE_PATH""'"
ssh -oStrictHostKeyChecking=no -o PubkeyAuthentication=yes $CONNECTION "'"$CMD"'"

echo -e "Cleaning destination ..."
CMD="'""cd $REMOTE_PATH && echo '$SSH_PASS' | sudo -S rm -rf *""'"
ssh -oStrictHostKeyChecking=no -o PubkeyAuthentication=yes $CONNECTION "'"$CMD"'"

echo -e "Synchronizing files ..."
rsync -e "ssh -o StrictHostKeyChecking=no -o PubkeyAuthentication=yes" -avzr --delete $OUT/* $CONNECTION:$REMOTE_PATH

echo -e "Deployed !!"
