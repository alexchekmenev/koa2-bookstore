const commands = [
    'CREATE DATABASE bookstore;',
    'ALTER DATABASE bookstore CHARACTER SET utf8 COLLATE utf8_unicode_ci;',
    `
CREATE TABLE image
(
    image_id int PRIMARY KEY AUTO_INCREMENT,
    name varchar(255) NOT NULL
);
    `,
    `
CREATE TABLE book
(
    book_id int PRIMARY KEY AUTO_INCREMENT,
    title varchar(255) NOT NULL,
    title_lowercased varchar(255) NOT NULL,
    description varchar(255) NOT NULL,
    description_lowercased varchar(255) NOT NULL,
    image_id int NOT NULL,
    date DATETIME NOT NULL
);
    `,
    `
CREATE TABLE author
(
    author_id int PRIMARY KEY AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    name_lowercased varchar(255) NOT NULL
);
    `,
    `
CREATE TABLE book_author
(
    id int PRIMARY KEY AUTO_INCREMENT,
    book_id int NOT NULL,
    author_id int NOT NULL
);
    `
];