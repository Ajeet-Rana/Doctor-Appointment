# Doctor Appointment System

This project is a web application that allows users to view and book appointments with doctors. The system differentiates between regular doctors and those with whom the user has appointments, ensuring a personalized experience.

## Features

- User authentication (login/logout).
- Display a list of doctors, categorized as regular and appointment doctors.
- Filter doctors by specialization.
- Book appointments with doctors.


## Technologies Used

- Frontend: React, Redux, Axios
- Backend: Node.js, Express
- Database: MongoDB
- Authentication: JWT
- Styling: CSS

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- npm or yarn
- MongoDB


### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Ajeet-Rana/doctor-appointment-system.git
   cd doctor-appointment-system

2. Install dependencies for the backend:
   ```bash
   cd backend
   npm install

3. Install dependencies for the frontend:
   ```bash
   cd amrutum
   npm install

4. Set up environment variables:
    ```bash
   MONGO_URI=mongodb://localhost:27017/doctor-appointment-system
   JWT_SECRET=your_jwt

5. Start the backend server:
    ```bash
   cd backend
   npm run dev

6. Start the frontend server:
    ```bash
   cd amrutm
   npm start

The application should now be running on http://localhost:3000.


API Endpoints
Authentication

    POST /api/auth/login: Login a user.
    POST /api/auth/register: Register a new user.

Doctors

    GET /api/doctors: Get a list of all doctors.
    GET /api/doctors?specialty=specialtyName: Get doctors filtered by specialty.

Appointments

    POST /api/appointments: Create a new appointment.
    GET /api/appointments: Get a list of user's appointments.


Usage

    Register a new user or login with existing credentials.
    Browse the list of doctors.
    Filter doctors by specialization.
    Book an appointment with a doctor.
    View your appointments in the user dashboard.



Thank You

Thank you for visiting and using our Doctor Appointment System! We hope you find it helpful and easy to use. If you have any questions or feedback, please feel free to reach out.
