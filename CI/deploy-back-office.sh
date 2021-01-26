#!/bin/bash

REMOTE_PATH=/var/www/html/ems-back-office
OUT=dist/back-office
CONNECTION=reliefapps@92.243.25.191

set -e

echo -e "Cleaning destination ..."
# echo '$SSH_PASS' | mkdir -p ${REMOTE_PATH} && 
CMD="'""cd ${REMOTE_PATH} && echo '$SSH_PASS' | rm -rf *""'"
ssh -oStrictHostKeyChecking=no -o PubkeyAuthentication=yes $CONNECTION "'"$CMD"'"

echo -e "Synchronizing files ..."
rsync -e "ssh -o StrictHostKeyChecking=no -o PubkeyAuthentication=yes" -avzr --delete $OUT/* $CONNECTION:$REMOTE_PATH

echo -e "Deployed !!"
