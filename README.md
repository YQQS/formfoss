# fromfoss
Simple online form survey from SJTU SE2017

**To start this project, you need**
+ maven3
+ java
**installed correctly**

**some extra configuration is needed**
+ update application.properties in /src/backend/src/main/resources/
+ create the corresponding database and table in your mariadb/mysql, it should like 

    ```sql
    create table FORMFOSS.Role
    (
    role_id int auto_increment
    primary key,
    role_name varchar(32) not null,
    role_desc varchar(512) null
    )
    ;

    create table FORMFOSS.User
    (
    user_id int auto_increment
    primary key,
    user_name varchar(32) not null,
    password varchar(64) not null,
    email varchar(128) not null,
    phone varchar(16) null,
    create_time timestamp default CURRENT_TIMESTAMP not null
    )
    ;

    create table FORMFOSS.user_role
    (
    user_id int null,
    role_id int null,
    constraint user_role_User_user_id_fk
    foreign key (user_id) references FORMFOSS.User (user_id)
    on update cascade on delete cascade,
    constraint user_role_Role_role_id_fk
    foreign key (role_id) references FORMFOSS.Role (role_id)
    on update cascade on delete cascade
    )
    ;

    create index user_role_Role_role_id_fk
    on user_role (role_id)
    ;

    create index user_role_User_user_id_fk
    on user_role (user_id)
    ;

    ```


    **then**

    mvn clean package
    java -jar backend/target/backend-0.0.1-SNAPSHOT.jar

    **open your browser at localhost:8080/**
