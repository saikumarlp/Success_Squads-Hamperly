# Implementation Plan - Full Stack User Registration Module

This plan outlines the design and implementation of a production-ready, full-stack user registration module. It includes a Spring Boot 3 (Java) backend and a React (Vite) frontend.

## User Review Required

Please review the proposed backend architecture, database schema, and validation rules. 

> [!IMPORTANT]
> The application will run on your local machine. We need database credentials to configure connection pooling (HikariCP) and migration (Flyway). Please provide these in response to the Open Questions below.

## Open Questions

> [!IMPORTANT]
> To connect to your local MySQL database, please provide:
> 1. **MySQL Host and Port** (Default is usually `localhost:3306`)
> 2. **MySQL Database Name** (e.g. `ecommerce_db` - we will create it if it doesn't exist)
> 3. **MySQL Username** (e.g. `root`)
> 4. **MySQL Password**

## Proposed Changes

We will create two separate projects under the workspace root `d:\StringStack\Project\Group_Project`:
- `/backend` (Spring Boot project with Maven wrapper)
- `/frontend` (React + Vite + Bootstrap project)

---

### Backend (Spring Boot 3)

The backend will be structured according to Clean Architecture and SOLID principles. 

#### Folder Structure
```
backend/
├── pom.xml
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── ecommerce/
│   │   │           └── userreg/
│   │   │               ├── config/            # SecurityConfig, WebConfig, SwaggerConfig, PasswordEncoderConfig
│   │   │               ├── controller/        # AuthController
│   │   │               ├── dto/               # RegistrationRequest, RegistrationResponse, ApiResponse, ErrorResponse
│   │   │               ├── entity/            # User Entity
│   │   │               ├── exception/         # Custom Exceptions (DuplicateEmail, etc.) & GlobalExceptionHandler
│   │   │               ├── mapper/            # UserMapper (MapStruct)
│   │   │               ├── repository/        # UserRepository
│   │   │               ├── security/          # JwtService, JwtAuthenticationFilter, CustomUserDetailsService
│   │   │               └── service/           # AuthService, AuthServiceImpl
│   │   └── resources/
│   │       ├── application.yml                # Configuration (Datasource, JPA, JWT, Logging)
│   │       └── db/
│   │           └── migration/
│   │               └── V1__create_users_table.sql
```

#### Database Schema (`db/migration/V1__create_users_table.sql`)
```sql
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    mobile_number VARCHAR(10) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'ROLE_USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### DTOs and Validation Rules
1. **RegistrationRequest**:
   - `fullName`: `@NotBlank`, `@Size(min = 3, max = 100)`, `@Pattern(regexp = "^[a-zA-Z\\s]+$")` (Only alphabets and spaces)
   - `email`: `@NotBlank`, `@Email`, converted to lowercase in controller/service
   - `mobileNumber`: `@NotBlank`, `@Pattern(regexp = "^[0-9]{10}$")`
   - `password`: `@NotBlank`, `@Size(min = 8)`, must match complex patterns (at least one uppercase, lowercase, digit, and special character)
   - `confirmPassword`: `@NotBlank` (checked against `password` programmatically or using custom validator)
2. **RegistrationResponse**:
   - `id`, `fullName`, `email`, `mobileNumber`, `role`, `accessToken`, `refreshToken`, `createdAt`, `updatedAt`

#### Security & Authentication
- **Spring Security 6**: Stateless session, password encoding using `BCryptPasswordEncoder`.
- **JWT Tokens**:
  - Access Token: expires in 15 minutes. Claims: `userId`, `email`, `role`.
  - Refresh Token: expires in 7 days.
- **Exception Handling**: Standardized JSON responses for exceptions.

---

### Frontend (React 19 + Vite)

The frontend will consume the backend's REST API and validate forms using React Hook Form.

#### Folder Structure
```
frontend/
├── .env
├── package.json
├── vite.config.js
├── src/
│   ├── assets/        # Styles, images
│   ├── components/    # Reusable components (Input, Button, Spinner, ProtectedRoute)
│   ├── context/       # AuthContext
│   ├── hooks/         # Custom hooks (useAuth)
│   ├── pages/         # RegistrationPage, DashboardPage (Protected)
│   ├── services/      # api.js (Axios instance with Interceptors), authService.js
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
```

#### Core Components & Interceptors
- **Axios Instance & Interceptors**: Intercepts requests to inject JWT. Intercepts responses to handle `401 Unauthorized` by calling refresh token endpoint and retrying the request.
- **Client-side Validation**: Matches backend validation rules using regex and length checks.
- **Toast Notifications**: Interactive messages for registration success or failure via React Toastify.

---

## Verification Plan

### Backend Verification
1. Run Maven compile and test:
   ```bash
   mvn clean test
   ```
2. Build jar:
   ```bash
   mvn clean package
   ```
3. Run the Spring Boot application locally:
   ```bash
   mvn spring-boot:run
   ```
4. Perform API integration checks using Swagger UI (`http://localhost:8080/swagger-ui/index.html`) or curl requests.

### Frontend Verification
1. Run the dev server:
   ```bash
   npm run dev
   ```
2. Open the page in the browser and register a user. Verify:
   - Client-side validation errors are shown.
   - Successful registration displays a success toast and redirects to dashboard/login.
   - Duplicate email/mobile exceptions from backend are handled gracefully.
   - JWT tokens are saved in LocalStorage/SessionStorage and sent in requests.
