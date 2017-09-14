#!/usr/bin/env bash

set -ev

cd "$(dirname "$0")"
BACKEND=$(pwd)/src/backend
FRONTEND=$(pwd)/src/frontend/src/main/frontend

cd "$BACKEND" && \
    mvn clean package
cd "$FRONTEND"
    yarn && yarn build
