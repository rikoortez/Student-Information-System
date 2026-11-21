create database student_management;
use student_management;

create table students(
    ID int auto_increment primary key,
    studentNumber varchar(20) unique not null, 
    firstName varchar(50) not null,
    lastName varchar(50) not null,
    birthDate date not null,
    course varchar(50) not null,
    yearLevel int not null,
    status enum('active', 'inactive') not null default 'active',
    createdAt timestamp default current_timestamp
);