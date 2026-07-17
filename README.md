# Luxury Gift Hampers

A modern full-stack e-commerce application for discovering and purchasing premium luxury gift hampers. The project is built using **React**, **Spring Boot**, **MySQL**, and **JWT Authentication**, following a clean and scalable architecture.

---

# Features

## Authentication

* User Registration
* User Login
* JWT-based Authentication
* BCrypt Password Encryption
* Protected Routes
* Logout

## User

* Secure Authentication
* Responsive Dashboard
* User Profile (Planned)

## Future E-Commerce Features

* Product Catalog
* Categories
* Search & Filters
* Wishlist
* Shopping Cart
* Checkout
* Online Payment
* Order Tracking
* User Addresses
* Reviews & Ratings
* Admin Dashboard

---

# Tech Stack

## Frontend

* React (Latest)
* React Router
* Axios
* Bootstrap 5
* Vite

## Backend

* Java 25
* Spring Boot 3
* Spring Security 6
* Spring Data JPA (Hibernate)
* Maven
* JWT
* BCrypt
* Bean Validation
* Lombok

## Database

* MySQL 8

---

# Project Structure

```text
Luxury_Gift_Hampers/
│
├── frontend/                 # React Application
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/                  # Spring Boot Application
│   ├── src/
│   ├── pom.xml
│   └── ...
│
├── .gitignore
├── .gitattributes
└── README.md
```

---

# Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/saikumarlp/Success_Squads-Hamperly.git
cd Luxury_Gift_Hampers
```

## 2. Create the MySQL Database

Create a database manually in MySQL.

```sql
CREATE DATABASE your_database_name;
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    full_name VARCHAR(100) NOT NULL,

    email VARCHAR(255) NOT NULL UNIQUE,

    mobile_number VARCHAR(10) NOT NULL UNIQUE,

    password VARCHAR(255) NOT NULL,

    role VARCHAR(50) DEFAULT 'user',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);
```


> **Note:** The project does not automatically create the database.

## 3. Configure the Backend

Open:

```text
backend/src/main/resources/application.properties
```

Update:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/your_database_name
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password

spring.jpa.hibernate.ddl-auto=update
```

## 4. Run the Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend runs on:

```text
http://localhost:8080
```

## 5. Install Frontend Dependencies

```bash
cd frontend
npm install
```

## 6. Run the Frontend

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# Authentication

Passwords are securely stored using BCrypt hashing.

After a successful login:

* A JWT token is generated.
* The frontend stores the token.
* Protected APIs require the token in the `Authorization` header.

Example:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

# Current Modules

* User Registration
* User Login
* JWT Authentication
* Dashboard
* Logout

---

# Planned Roadmap

* Product Management
* Categories
* Wishlist
* Shopping Cart
* Checkout
* Payment Gateway Integration
* Order Management
* User Profile
* Admin Panel
* Email Verification
* Forgot Password
* OTP Authentication
* Google Login
* GitHub Login

---

# Contributing

1. Fork the repository.
2. Create a new branch.

```bash
git checkout -b feature/feature-name
```

3. Commit your changes.

```bash
git commit -m "Add feature"
```

4. Push the branch.

```bash
git push origin feature/feature-name
```

5. Open a Pull Request.

---

# Author

**SaiKumar Laxman Pujari**

