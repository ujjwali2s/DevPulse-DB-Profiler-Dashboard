CREATE TABLE Address (
  Address_id SERIAL PRIMARY KEY,
  Street VARCHAR(100),
  Postal_code INT NOT NULL,
  City VARCHAR(50) NOT NULL,
  Division VARCHAR(50) NOT NULL,
  Country VARCHAR(50) NOT NULL
);


CREATE TABLE Person_Info (
  Person_id SERIAL PRIMARY KEY,
  First_Name VARCHAR(100) NOT NULL,
  Last_Name VARCHAR(100) NOT NULL,
  Email VARCHAR(100) UNIQUE,
  Phone VARCHAR(20) NOT NULL,
  Address_id INT,
  FOREIGN KEY (Address_id) REFERENCES Address(Address_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);


CREATE TABLE Account (
  Account_id SERIAL PRIMARY KEY,
  Username VARCHAR(100) NOT NULL UNIQUE,
  Password VARCHAR(100) NOT NULL,
  User_type VARCHAR(10) NOT NULL,
  CONSTRAINT check_user_type CHECK (User_type IN ('Staff', 'Member'))
);


CREATE TABLE Branch (
  Branch_id SERIAL PRIMARY KEY,
  Branch_name VARCHAR(100),
  Address_id INT,
  Phone VARCHAR(20) NOT NULL,
  FOREIGN KEY (Address_id) REFERENCES Address(Address_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);


CREATE TABLE Staff (
  Staff_id SERIAL PRIMARY KEY,
  Person_id INT,
  Designation VARCHAR(50) NOT NULL,
  Join_date DATE NOT NULL,
  Account_id INT,
  Branch_id INT,
  FOREIGN KEY (Person_id) REFERENCES Person_Info(Person_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
  FOREIGN KEY (Account_id) REFERENCES Account(Account_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
  FOREIGN KEY (Branch_id) REFERENCES Branch(Branch_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);


CREATE TABLE Membership_Status (
  Status_id SERIAL PRIMARY KEY,
  Status_name VARCHAR(20),
  Monthly_fee DECIMAL(10,2),
  Price_limit DECIMAL(10,2),
  CONSTRAINT check_status_name CHECK (Status_name IN ('standard', 'premium'))
);


CREATE TABLE Member (
  Member_id SERIAL PRIMARY KEY,
  Person_id INT,
  Join_date DATE NOT NULL,
  Status_id INT,
  Account_id INT,
  FOREIGN KEY (Person_id) REFERENCES Person_Info(Person_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
  FOREIGN KEY (Status_id) REFERENCES Membership_Status(Status_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
  FOREIGN KEY (Account_id) REFERENCES Account(Account_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);


CREATE TABLE Schedule (
  Schedule_id SERIAL PRIMARY KEY,
  Staff_id INT,
  Work_date DATE NOT NULL,
  Start_time TIME NOT NULL,
  End_time TIME NOT NULL,
  FOREIGN KEY (Staff_id) REFERENCES Staff(Staff_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);


CREATE TABLE Notification (
  Noti_id SERIAL PRIMARY KEY,
  Member_id INT,
  Message VARCHAR(100) NOT NULL,
  Sent_date DATE NOT NULL,
  Read_status BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (Member_id) REFERENCES Member(Member_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);


CREATE TABLE Publisher (
  Publisher_id SERIAL PRIMARY KEY,
  publisher_name VARCHAR(50),
  Website VARCHAR(100) NOT NULL,
  Country VARCHAR(50),
  Establish_year INT
);


CREATE TABLE Book (
  Book_id SERIAL PRIMARY KEY,
  Title VARCHAR(200) NOT NULL,
  ISBN VARCHAR(20) UNIQUE NOT NULL,
  Publisher_id INT,
  Publish_year INT,
  Language VARCHAR(50) NOT NULL,
  Edition INT NOT NULL,
  Price DECIMAL(10,2) NOT NULL,
  cover_filename TEXT,
  FOREIGN KEY (Publisher_id) REFERENCES Publisher(Publisher_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);


CREATE TABLE Review (
  Review_id SERIAL PRIMARY KEY,
  Member_id INT,
  Book_id INT,
  Rating INT CHECK (Rating BETWEEN 1 AND 5),
  Review_date DATE NOT NULL,
  Description VARCHAR(4000),
  FOREIGN KEY (Member_id) REFERENCES Member(Member_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
  FOREIGN KEY (Book_id) REFERENCES Book(Book_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);


CREATE TABLE Book_request (
  Req_id SERIAL PRIMARY KEY,
  Member_id INT,
  Book_id INT,
  Request_date DATE NOT NULL,
  Request_status VARCHAR(20) NOT NULL,
  FOREIGN KEY (Member_id) REFERENCES Member(Member_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
  FOREIGN KEY (Book_id) REFERENCES Book(Book_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
  CONSTRAINT check_request_status CHECK (Request_status IN ('pending', 'approved', 'rejected'))
);


CREATE TABLE Book_Copy (
  Copy_id SERIAL PRIMARY KEY,
  Book_id INT,
  Branch_id INT,
  Availability_status VARCHAR(5) NOT NULL,
  Condition VARCHAR(30),
  FOREIGN KEY (Book_id) REFERENCES Book(Book_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
  FOREIGN KEY (Branch_id) REFERENCES Branch(Branch_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
  CONSTRAINT check_availability_status CHECK (Availability_status IN ('yes', 'no')),
  CONSTRAINT check_condition CHECK (Condition IN ('pages missing', 'fair', 'worn', 'lost'))
);


CREATE TABLE Borrow_record (
  Borrow_id SERIAL PRIMARY KEY,
  Member_id INT,
  Staff_id INT,
  Copy_id INT,
  Borrow_date DATE NOT NULL,
  Due_return_date DATE NOT NULL,
  Return_date DATE,
  Return_condition VARCHAR(20),
  FOREIGN KEY (Member_id) REFERENCES Member(Member_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
  FOREIGN KEY (Staff_id) REFERENCES Staff(Staff_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
  FOREIGN KEY (Copy_id) REFERENCES Book_Copy(Copy_id) 
        ON DELETE SET NULL 
        ON UPDATE NO ACTION,
  CONSTRAINT check_return_condition CHECK (Return_condition IN ('okay', 'late', 'damaged'))
);


CREATE TABLE Fine (
  Fine_id SERIAL PRIMARY KEY,
  Fine_type VARCHAR(20) NOT NULL,
  Daily_rate DECIMAL(10,2) NOT NULL,
  CONSTRAINT check_fine_type CHECK (Fine_type IN ('Book_lost', 'Return_delay', 'Damaged'))
);


CREATE TABLE Fine_calculated (
  Fine_id INT,
  Borrow_id INT,
  Total_amount NUMERIC(10,2),
  Pay_status VARCHAR(10) NOT NULL DEFAULT 'unpaid',
  PRIMARY KEY (Fine_id, Borrow_id),
  FOREIGN KEY (Fine_id) REFERENCES Fine(Fine_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
  FOREIGN KEY (Borrow_id) REFERENCES Borrow_record(Borrow_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);


CREATE TABLE Author (
  Author_id SERIAL PRIMARY KEY,
  Person_id INT,
  Pen_name VARCHAR(100),
  Nationality VARCHAR(50) NOT NULL,
  Biography VARCHAR(500),
  FOREIGN KEY (Person_id) REFERENCES Person_Info(Person_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);


CREATE TABLE Book_Author (
  Book_id INT,
  Author_id INT,
  PRIMARY KEY (Book_id, Author_id),
  FOREIGN KEY (Book_id) REFERENCES Book(Book_id),
  FOREIGN KEY (Author_id) REFERENCES Author(Author_id)
);


CREATE TABLE Genre (
  Genre_id SERIAL PRIMARY KEY,
  Name VARCHAR(50) NOT NULL,
  Description VARCHAR(200)
);


CREATE TABLE Book_Genre (
  Book_id INT,
  Genre_id INT,
  PRIMARY KEY (Book_id, Genre_id),
  FOREIGN KEY (Book_id) REFERENCES Book(Book_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
  FOREIGN KEY (Genre_id) REFERENCES Genre(Genre_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);


CREATE TABLE Award (
  Award_id SERIAL PRIMARY KEY,
  Award_name VARCHAR(100) NOT NULL,
  Interval INT NOT NULL,
  Recipients_each_time INT,
  Establishing_year INT,
  Established_by VARCHAR(100) NOT NULL
);


CREATE TABLE Author_award (
  Award_id INT,
  Author_id INT,
  Book_id INT,
  Receiving_date DATE NOT NULL,
  PRIMARY KEY (Award_id, Author_id, Book_id),
  FOREIGN KEY (Award_id) REFERENCES Award(Award_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
  FOREIGN KEY (Author_id) REFERENCES Author(Author_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
  FOREIGN KEY (Book_id) REFERENCES Book(Book_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);


CREATE TABLE Return_lost_requests (
  Request_id INT PRIMARY KEY,
  Borrow_id INT,
  Request_type VARCHAR(10) NOT NULL,
  Status VARCHAR(10) NOT NULL DEFAULT 'pending',
  Request_date DATE NOT NULL DEFAULT CURRENT_DATE,
  Staff_id INT,
  Processed_date DATE,
  FOREIGN KEY (Borrow_id) REFERENCES Borrow_record(Borrow_id) 
        ON DELETE SET NULL 
        ON UPDATE NO ACTION,
  CHECK (Request_type IN ('return', 'lost', 'damaged'))
);


CREATE TABLE Member_signup_log (
  Log_id INT PRIMARY KEY,
  Member_id INT,
  Signup_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  Full_name TEXT,
  Email TEXT,
  Phone TEXT,
  Username TEXT,
  FOREIGN KEY (Member_id) REFERENCES Member(Member_id) 
        ON DELETE CASCADE 
        ON UPDATE NO ACTION
);


CREATE TABLE Deactivated_members (
  Deactivation_id INT PRIMARY KEY,
  Member_id INT NOT NULL,
  Username VARCHAR(100) NOT NULL,
  Deactivation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);





