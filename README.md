# fromfoss
Simple online form survey from SJTU SE2017

### Build status
[![Build Status](https://travis-ci.org/YQQS/formfoss.svg?branch=master)](https://travis-ci.org/YQQS/formfoss)

**To start this project, you need**
+ [maven3](https://maven.apache.org)
+ [java8](https://www.java.com)
+ [nodejs](https://nodejs.org)
+ [yarn](https://yarnpkg.com) or [npm](https://www.npmjs.com)

**installed**

**some extra configuration is needed**
+ update application.properties in /src/backend/src/main/resources/
+ create the corresponding database and table in your mariadb/mysql, it should like 

```sql

create table FORMFOSS.user
(
	`user_id` int auto_increment
		primary key,
	`user_name` varchar(32) not null,
	`email` varchar(128) not null,
	`create_time` timestamp default CURRENT_TIMESTAMP not null,
	`password` varchar(64) not null,
	`phone` varchar(16) null,
	constraint user_user_name_uindex
		unique (`user_name`),
	constraint user_email_uindex
		unique (`email`)
);
   ```


**then**
build backend project:

    cd src/backend && mvn clean package

run backend program:

    java -jar src/backend/target/backend-0.0.1-SNAPSHOT.jar

run frontend program: 

    cd src/frontend/src/main/frontend/ && yarn run start 

**open your browser at localhost:4200/**
