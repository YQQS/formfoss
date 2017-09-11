#!/usr/bin/env sh
set -ev

PWD=$(pwd)

cd "$PWD/src/backend" && \
    mvn clean package
cd "$PWD/src/frontend/src/main/frontend/" && \
    yarn build
