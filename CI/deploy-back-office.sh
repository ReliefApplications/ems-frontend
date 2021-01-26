#!/bin/bash

REMOTE_PATH=/var/www/html/ems-back-office
OUT=dist/back-office
CONNECTION=reliefapps@92.243.25.191

set -e

echo -e "Cleaning destination ..."
CMD="'""echo '$SSH_PASS' | sudo mkdir -p $REMOTE_PATH && cd $REMOTE_PATH && echo '$SSH_PASS' | sudo rm -rf *""'"
ssh -oStrictHostKeyChecking=no -o PubkeyAuthentication=yes $CONNECTION "'"$CMD"'"

echo -e "Synchronizing files ..."
rsync -e "ssh -o StrictHostKeyChecking=no -o PubkeyAuthentication=yes" -avzr --delete $OUT/* $CONNECTION:$REMOTE_PATH

echo -e "Deployed !!"
