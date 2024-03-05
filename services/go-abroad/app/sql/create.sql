-- 创建用户表
CREATE TABLE users (
  user_id INT AUTO_INCREMENT,
  gpa DECIMAL(4, 2) CHECK (gpa >= 0 AND gpa <= 100.00), 
  school_name VARCHAR(100),
  school_type INT,
  degree INT,
  major VARCHAR(100),
  language_achi JSON DEFAULT NULL,
  academic_experience JSON,
  intent_region VARCHAR(100),
  intent_major VARCHAR(100),
  other_details TEXT,
  account_name VARCHAR(100) NOT NULL,
  account VARCHAR(100) NOT NULL,
  password VARCHAR(100) NOT NULL,
  user_name VARCHAR(100),
  avatar_url VARCHAR(200),
  gender VARCHAR(10),
  location VARCHAR(100),
  phone_number VARCHAR(20),
  wechat_id VARCHAR(50),
  email VARCHAR(100),
  personal_introduction TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME,
  role_id INT NOT NULL,

  PRIMARY KEY(user_id)
);


-- 创建角色表
CREATE TABLE roles (
  role_id INT AUTO_INCREMENT,
  role_name VARCHAR(50) NOT NULL,
  role_description VARCHAR(200),

  PRIMARY KEY(role_id)
);

-- 创建权限表
CREATE TABLE permissions (
  permission_id INT AUTO_INCREMENT,
  permission_name VARCHAR(100) NOT NULL,
  path VARCHAR(200) NOT NULL,
  method VARCHAR(200) NOT NULL,
  permission_description VARCHAR(200),

  PRIMARY KEY(permission_id)
);

-- 创建角色-权限映射表
CREATE TABLE role_permissions (
  role_id INT NOT NULL,
  permission_id INT NOT NULL,
  
  PRIMARY KEY (role_id, permission_id)
  -- FOREIGN KEY (role_id) REFERENCES role (role_id) ON DELETE CASCADE,
  -- FOREIGN KEY (permission_id) REFERENCES permission (permission_id) ON DELETE CASCADE
);

CREATE TABLE applications (
  application_id INT(11) AUTO_INCREMENT ,
  user_id INT(11) NOT NULL,
  school VARCHAR(255) NOT NULL,
  major VARCHAR(255) NOT NULL,
  ddl TIMESTAMP NOT NULL,
  status INT(11) NOT NULL,
  type VARCHAR(255) NOT NULL,

  PRIMARY KEY(application_id)
);

CREATE TABLE files (
  file_id INT NOT NULL AUTO_INCREMENT,
  file_name VARCHAR(255) NOT NULL,
  file_url VARCHAR(255) NOT NULL,
  user_id INT NOT NULL,
  application_id INT,

  PRIMARY KEY (file_id)
);

CREATE TABLE articles (
  article_id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(255),
  article_url VARCHAR(255),
  content TEXT,
  author VARCHAR(255),
  PRIMARY KEY (article_id)
);