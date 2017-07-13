# fromfoss
Simple online form survey from SJTU SE2017

### Build status
[![Build Status](https://travis-ci.org/YQQS/formfoss.svg?branch=master)](https://travis-ci.org/YQQS/formfoss)

**To start this project, you need**
+ maven3
+ java

**installed correctly**

**some extra configuration is needed**
+ update application.properties in /src/backend/src/main/resources/
+ create the corresponding database and table in your mariadb/mysql, it should like 

```sql
create table FORMFOSS.role
(
	`role_id` int auto_increment
		primary key,
	`role_desc` varchar(512) null,
	`role_name` varchar(32) not null
)
;

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
)
;

CREATE TABLE `user_role` (
  `user_id` int(11) DEFAULT NULL,
  `role_id` int(11) DEFAULT NULL,
  KEY `fk_user_id` (`user_id`),
  KEY `fk_role_id` (`role_id`),
  CONSTRAINT `fk_role_id` FOREIGN KEY (`role_id`) REFERENCES `role` (`role_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) 
;

   ```


**then**

    mvn clean package
    java -jar backend/target/backend-0.0.1-SNAPSHOT.jar

**open your browser at localhost:8080/**
