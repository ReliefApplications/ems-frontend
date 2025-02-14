#!/bin/bash

# Configure Git to set the path for hooks
git config --local core.hooksPath .github/.githooks

echo "Git hooks have been set up successfully!"
