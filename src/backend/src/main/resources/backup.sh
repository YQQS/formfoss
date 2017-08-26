#!/usr/bin/env bash


MYSQL_BACK_PATH=/var/backup/mysql/
MONGODB_BACK_PATH=/var/backup/mongodb/
MYSQL_DATABASE=FORMFOSS
MONGO_DATABASE=Form

if [ ! -d "$MYSQL_BACK_PATH" ] ; then
    mkdir -p "$MYSQL_BACK_PATH"
fi

if [ ! -d "$MONGODB_BACK_PATH" ] ; then
    mkdir -p "$MONGODB_BACK_PATH"
fi

mysqldump -u book -plalaland FORMFOSS > "${MYSQL_BACK_PATH}"/formfoss-backup.sql
mongodump --db "$FORMFOSS" --out "${MONGODB_BACK_PATH}"/`date +"%m-%d-%y"`
