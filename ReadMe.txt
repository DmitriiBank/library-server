

CREATED TABLES 

CREATE TABLE IF NOT EXISTS books (
  id VARCHAR(36) NOT NULL,
  title VARCHAR(30) NOT NULL DEFAULT '',
  author VARCHAR(20) NOT NULL DEFAULT '',
  genre VARCHAR(15) NOT NULL DEFAULT '',
  status VARCHAR(10) NOT NULL DEFAULT 'on_stock',
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS readers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reader VARCHAR(100) NOT NULL UNIQUE,
  roles VARCHAR(100)  DEFAULT 'user' NULL
) ENGINE=InnoDB;

CREATE TABLE books_readers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  book_id CHAR(36) NOT NULL,
  reader_id INT NOT NULL,
  pick_date DATE NOT NULL,
  return_date DATE DEFAULT NULL,
  FOREIGN KEY (book_id) REFERENCES books(id),
  FOREIGN KEY (reader_id) REFERENCES readers(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS route_permissions (
  id      INT AUTO_INCREMENT PRIMARY KEY,
  route    VARCHAR(255)  NOT NULL,
  role    VARCHAR(50)   NOT NULL,
  UNIQUE KEY uniq_perm (route, role)
);

INSERT INTO route_permissions (route, role) VALUES
('PATCH/accounts/password', 'user'),
('GET/accounts/reader',   'user'),
('GET/accounts/reader',   'admin'),
('DELETE/accounts',          'user'),
('DELETE/accounts',          'admin'),
('PATCH/accounts/changes',  'user'),
('PATCH/accounts/role',     'admin');