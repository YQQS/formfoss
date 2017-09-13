#!/usr/bin/env bash

MYSQL_DUMP=$(command -v mysqldump)
MYSQL_USER=book
MYSQL_PASSWD=lalaland
MYSQL_BACK_PATH=$HOME/backup/mysql/
MYSQL_DATABASE=FORMFOSS

MONGO_DUMP=$(command -v mongodump)
MONGO_RESTORE=$(command -v mongorestore)
MONGODB_BACK_PATH=$HOME/backup/mongodb/
MONGO_DATABASE=Form

CURRENT_DATE=$(date +"%y-%m-%d-%T")
SCRIPT_NAME=$(basename "$0")


function backup_mysql {
    if [ ! -r "$MYSQL_DUMP" ] ; then
        echo -e "backup util mysqldump not found\n"
        exit 1
    fi

    if [ ! -d "$MYSQL_BACK_PATH" ] ; then
        mkdir -p "$MYSQL_BACK_PATH"
    fi

    echo -e "backup mysql into $MYSQL_BACK_PATH ......"
    mysqldump -u "$MYSQL_USER" -p"$MYSQL_PASSWD" "$MYSQL_DATABASE" > \
        "${MYSQL_BACK_PATH}/formfoss-mysql-backup-${CURRENT_DATE}.sql"
    echo -e "backup mysql done, file stored in $MYSQL_BACK_PATH/formfoss-mysql-backup-${CURRENT_DATE}.sql"
    echo ""
}

function restore_mysql {
    if [ $# -ne 1 ]; then
        echo -e "sql file required\n"
        exit 1
    fi
    if [ -r "$1" ]; then
        echo -e "can not read restore file $1\n"
        exit 1
    fi

    echo -e "restoring mysql from $1 ......"
    mysql -u "$MYSQL_USER" -p "$MYSQL_PASSWD" < "$1"
    echo -e "restore mysql done"
    echo ""
}

function backup_mongodb {
    if [ ! -r "$MONGO_DUMP" ] ; then
        echo "mongodb backup util mongodump not found"
        exit 1
    fi

    if [ ! -d "$MONGODB_BACK_PATH" ] ; then
        mkdir -p "$MONGODB_BACK_PATH"
    fi

    echo -e "backup mongodb into $MONGODB_BACK_PATH ......"
    mongodump --db "$MONGO_DATABASE" --out \
        "${MONGODB_BACK_PATH}/formfoss-mongo-backup-${CURRENT_DATE}"
    echo -e "backup mongodb done, file stored in $MONGODB_BACK_PATH/formfoss-mongo-backup-${CURRENT_DATE}"
    echo ""
}

function restore_mongodb {
    if [ -r "$MONGO_RESTORE" ] ; then
        echo "can not find mongorestore"
        exit 1
    fi

    if [ $# -ne 1 ]; then
        echo -e "resotre directory required\n"
        exit 1
    fi

    if [ -d "$1" ] ; then
        echo -e "can't read resotre directory $1"
        exit 1
    fi

    echo -e "restoring mongodb from $1 ......"
    $MONGO_RESTORE --db "$MONGO_DATABASE" "$1"
    echo "restore mongodb done"
    echo ""
}


function backup {
    OPT="-a"
    if [ $# -eq 1 ] ; then
        OPT=$1
    elif [ $# -gt 1 ] ; then
        echo "invalid usage"
        help
        exit 1
    fi

    echo "start backup ......."
    case "$OPT" in
        -a | --all )
            backup_mysql && backup_mongodb
            ;;
        -y | --mysql )
            backup_mysql
            ;;
        -o | --mongo )
            backup_mongodb
            ;;
        * )
            echo "unknow agrument of $OPT"
            help
            exit 1
    esac
}

function restore {
    if [ $# -ne 2 ] ; then
        echo "invalid usage"
        help
        exit 1
    fi

    OPT=$1
    RESTORE_FILE=$2

    echo "start restore ......"
    case "$OPT" in
        -y | --mysql )
            restore_mysql "$RESTORE_FILE"
            ;;
        -o | --mongo )
            restore_mongodb "$RESTORE_FILE"
            ;;
        * )
            echo "invalid usage"
            help
            exit 1
        esac
}

function help {
    echo -e "Usage: $SCRIPT_NAME [COMMAND...] [OPTION...] [FILENAME]"
    echo -e "\texample: "
    echo -e "\t\t$SCRIPT_NAME backup -a"
    echo -e "\t\t$SCRIPT_NAME restore --mysql backup.sql"
    echo ""
    echo -e "Commands: "
    echo -e "\tbackup:\t backup database"
    echo -e "\trestore:\t restore database"
    echo -e "\thelp:\tshow this help message"
    echo ""
    echo "Options for backup:"
    echo -e "\t-a, --all\tboth mysql and mongodb"
    echo -e "\t-y, --mysql\tonly mysql"
    echo -e "\t-o, --mongo\tonly mongodb"
    echo ""
    echo "Options for restore:"
    echo -e "\t-y, --mysql\trestore mysql"
    echo -e "\t-o, --mongo\trestore mongodb"
    echo ""
}


COMMAND=$1
ARG=$2
RESTORE_FILE=$3

case "$COMMAND" in
    backup )
        backup "$2"
        ;;
    restore )
        restore "$ARG" "$RESTORE_FILE"
        ;;
    help )
        help
        ;;
    * )
        echo "Unknow command"
        help
        ;;
esac
