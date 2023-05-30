
# **Popono : Employee Attendance Tracking App**

The Employee Attendance Tracking App is a web application designed to track and manage employee attendance. It provides an efficient and convenient way for employers to monitor employee attendance records and generate reports. This README file provides an overview of the app's features and the technologies used in its development.  

This app will be hosted locally on a linux server
Employees will use some version of the following attendance rules:  
    8h00m : Arrival to the company (punchIn)
    13h00 : Leave to have lunch (punchOutLunch)  
    14h00 : Arrive from lunch (punchInLunch)
    17h00 : Leave to go home for the day (punchOut)
  
The 'punchOut' type action needs to be overwritable, because an employee can be out the door to leave, remember something he forgot (some task), come back to finish it and punchOut again.  

The database model should include (at least) for the employee: firstName, lastName, email, password, department, isAdmin. 
There needs to be concepts of Department Heads to determine who has access to extract attendance reports for which employees. 

  
# Tech Stack
  
The Employee Attendance Tracking App is built using the following technologies:  
  
JavaScript: The primary programming language used for developing the backend and frontend of the application.  
HTML: Used for creating the structure and content of the web pages.  
CSS: Used for styling the web pages and enhancing the user interface.  
Express.js: A fast and minimalist web application framework for building the server-side of the application. It enables handling HTTP requests, routing, and middleware management.  
JWT (JSON Web Tokens): Used for authentication and authorization purposes. JWT provides a secure way to transmit information between parties as a JSON object.  
Prisma ORM: An Object-Relational Mapping (ORM) library that simplifies database operations and provides a type-safe API for working with databases. Prisma supports multiple databases, and in this app, it is used with SQLite3.  
SQLite3: A lightweight, serverless database engine used for storing and managing the attendance data. SQLite3 is chosen for its simplicity and portability.  
XLSX: A library for reading and writing Excel files. It allows exporting attendance data to Excel format for further analysis or reporting.  
Node.js: A JavaScript runtime environment that allows executing JavaScript code outside a web browser. It provides a platform for building scalable and performant web applications.  
FileSaver: A library for saving files on the client-side. FileSaver is used to enable users to download the attendance data in Excel format.  
Bcrypt: .  
  
---  
  
# Usage 
  
Once the Employee Attendance Tracking App is up and running, you can perform the following actions:  
  
Administrators:  
Register: Administrators can can create an account by providing employee's details and creating a username and password.  
Modify: Administrators can can modify an account. They can also set an account to be active or inactive.  
Delete: Administrators can delete accounts.

Users:
Login: Registered employees can log in to their accounts using their credentials.
Record Attendance: Employees can record their attendance by clocking in and clocking out. There are 4 punch types: punchIn, punchOutLunch, punchInLunch and punchOut. There is only 1 action permitted by punch type per day, with the exception of the "punchOut" action, which can be overwrited by the user.
View Attendance History: Employees can view their attendance history, including dates, clock-in, and clock-out times.
Export Attendance: Employees can export their attendance data in Excel format. For this they will choose an startDate and endDate for a report to be generated and exported.
Create exception: Employees can punch after the fact by using an exception form (for example if they missed work or forgot), fill out the punch timestamps manually (or not) and write a note, which can be accessed later by admins and Department Heads.

Department Heads:
Generate Reports: Employers can generate reports based on employee attendance data to analyze trends and make informed decisions.
Generate Reports: Department Heads can generate reports based on employee attendance data for employees of the departments they manage. For this they will select which employees are they generating the report to, and choose an startDate and endDate.

Automated tasks:
Punches: The app will automatically create empty records for a said date for an employee that didn't punch during that day. This task will be executed at 1 am of the following day.

---


# Database model:

Note: Since sqlite3 doesn't allow for enums, we can handle the enum in the application logic instead. We can replace the PunchType enum with a String type in the AttendanceRecord model and validate the data in the application layer to make sure it conforms to the required values: "punchIn", "punchOutLunch", "punchInLunch", "punchOut".

https://dbdiagram.io/d/6475c3f57764f72fcf168a3a


datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

generator client {
  provider = "prisma-client-js"
}

model Employee {
  id                Int                 @id @default(autoincrement())
  firstName         String
  lastName          String
  email             String              @unique
  password          String
  isAdmin           Boolean
  departments       Department[]        @relation("EmployeeToDepartment")
  departmentHeads   DepartmentHead[]    // this field represents departments the employee is heading
  attendanceRecords AttendanceRecord[]
  exceptions        Exception[]
}

model Department {
  id                Int                  @id @default(autoincrement())
  name              String               @unique
  employees         Employee[]           @relation("EmployeeToDepartment")
  departmentHeads   DepartmentHead[]     // this field represents the head(s) of the department
}

model DepartmentHead {
  id               Int                  @id @default(autoincrement())
  employee         Employee             @relation(fields: [employeeId], references: [id])
  employeeId       Int
  department       Department           @relation(fields: [departmentId], references: [id])
  departmentId     Int
}

model AttendanceRecord {
  id              Int                   @id @default(autoincrement())
  date            DateTime
  punchType       String
  timestamp       DateTime
  employee        Employee              @relation(fields: [employeeId], references: [id])
  employeeId      Int
}

model Exception {
  id              Int                  @id @default(autoincrement())
  date            DateTime
  note            String
  employee        Employee             @relation(fields: [employeeId], references: [id])
  employeeId      Int
}



# Utils

https://dbdiagram.io/d

https://notiz.dev/blog/prisma-dbml-generator


