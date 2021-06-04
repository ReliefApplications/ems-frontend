#!/bin/bash

# Remove files
REMOTE_PATH=/var/www/html/ems-front-office
OUT=dist/front-office
REMOTE_PATH_RA=/var/www/html/ra-safe-fo
OUT_RA=dist/ra-front-office
CONNECTION=reliefapps@92.243.25.191

set -e
# TEST ENV
echo -e "Creating destination ..."
CMD="'""echo '$SSH_PASS' | sudo -S mkdir -p $REMOTE_PATH""'"
ssh -oStrictHostKeyChecking=no -o PubkeyAuthentication=yes $CONNECTION "'"$CMD"'"

echo -e "Cleaning destination ..."
CMD="'""cd $REMOTE_PATH && echo '$SSH_PASS' | sudo -S rm -rf *""'"
ssh -oStrictHostKeyChecking=no -o PubkeyAuthentication=yes $CONNECTION "'"$CMD"'"

echo -e "Synchronizing files ..."
rsync -e "ssh -o StrictHostKeyChecking=no -o PubkeyAuthentication=yes" -avzr --delete $OUT/* $CONNECTION:$REMOTE_PATH

# RA ENV
echo -e "Creating destination ..."
CMD="'""echo '$SSH_PASS' | sudo -S mkdir -p $REMOTE_PATH_RA""'"
ssh -oStrictHostKeyChecking=no -o PubkeyAuthentication=yes $CONNECTION "'"$CMD"'"

echo -e "Cleaning destination ..."
CMD="'""cd $REMOTE_PATH_RA && echo '$SSH_PASS' | sudo -S rm -rf *""'"
ssh -oStrictHostKeyChecking=no -o PubkeyAuthentication=yes $CONNECTION "'"$CMD"'"

echo -e "Synchronizing files ..."
rsync -e "ssh -o StrictHostKeyChecking=no -o PubkeyAuthentication=yes" -avzr --delete $OUT_RA/* $CONNECTION:$REMOTE_PATH

echo -e "Deployed !!"
