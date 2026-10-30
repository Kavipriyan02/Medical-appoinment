# CareSync &mdash; Medical Appointment & Clinical Health System

CareSync is a full-stack, enterprise-grade **Healthcare Appointment Management & Medical Records System** built on the **MERN** stack (MongoDB, Express, React + Vite, Node.js). It streamlines patient-physician workflows, digital prescriptions, role-based dashboards, and administrator verification.

---

## 🌐 Live Production Links

- **Backend API (Render):** [https://medical-appoinment-p9qp.onrender.com](https://medical-appoinment-p9qp.onrender.com)
- **API Health Check:** [https://medical-appoinment-p9qp.onrender.com/api/health](https://medical-appoinment-p9qp.onrender.com/api/health)
- **GitHub Repository:** [https://github.com/Kavipriyan02/Medical-appoinment](https://github.com/Kavipriyan02/Medical-appoinment)

> **Vercel Frontend Setup:** When deploying the frontend on Vercel, set the environment variable:  
> `VITE_API_URL` = `https://medical-appoinment-p9qp.onrender.com`

---

## 🌟 Key Highlights & Features

### 🧑‍⚕️ For Patients
- **Specialist Search & Filtering:** Filter doctors by specialty (Cardiology, Dermatology, Pediatrics, Neurology, Orthopedics, etc.), rating, experience, or hospital.
- **Flexible Consultations:** Book both **in-person clinic visits** and **online video consultations** with time slot conflict prevention.
- **Digital Prescriptions (Rx):** View prescribed medications (dosage, frequency, duration, precautions) with one-click **print and PDF export**.
- **Personal Health Records (EMR):** Safely store and manage lab test reports, scans, vaccination records, and doctor summaries.
- **Physician Reviews:** Submit ratings (1–5 stars) and clinical reviews after completed appointments.

### 🩺 For Doctors
- **Doctor Portal & Appointment Schedule:** Real-time visibility into today's, upcoming, and past consultations.
- **Appointment Lifecycle:** One-click confirmation, cancellation, or completion.
- **Prescription Builder:** Prescribe medications with automated linkage to the patient's appointment and instant notifications.
- **Profile & Availability:** Set consultation fee, hospital affiliation, and weekly availability slots.

### 🛡️ For Administrators
- **Executive Metrics:** Real-time counts of total patients, approved doctors, pending verifications, and today's appointments.
- **Doctor Credentialing:** Review, approve, or reject new doctor applications before they appear in public search.
- **User Management:** Search and activate/deactivate patient or physician accounts.
- **Audit Logs:** Master chronological log of all hospital appointments.

---

## 🗂️ Project Architecture

```
Medical appointment system/
├── client/                     # Frontend Application (React 18 + Vite)
│   ├── public/
│   ├── src/
│   │   ├── api/                # Axios instance with JWT interceptors
│   │   ├── components/         # Navbar, Footer, Modals (Appointment, Prescription, Review)
│   │   ├── context/            # AuthContext (Role-based state, login, register, logout)
│   │   ├── pages/
│   │   │   ├── admin/          # Admin Dashboard & Approvals
│   │   │   ├── doctor/         # Doctor Portal & Prescription Builder
│   │   │   ├── patient/        # Patient Dashboard & Medical Records
│   │   │   ├── Doctors.jsx     # Doctor Directory & Filtering
│   │   │   ├── DoctorDetails.jsx # Doctor Profile & Schedule
│   │   │   ├── Home.jsx        # Landing page with hero & specialties
│   │   │   ├── Login.jsx       # Auth login with demo quick-fills
│   │   │   ├── Register.jsx    # Patient registration
│   │   │   ├── RegisterDoctor.jsx # Doctor onboarding application
│   │   │   └── Profile.jsx     # Profile & password management
│   │   ├── App.jsx             # React Router v6 setup with route guards
│   │   ├── index.css           # Modern medical design system stylesheet
│   │   └── main.jsx            # Application entrypoint
│   ├── index.html
│   ├── package.json
│   └── vite.config.js          # Vite config with API proxy to port 5000
│
├── server/                     # Backend API (Node.js, Express, MongoDB)
│   ├── controllers/            # Route business logic
│   │   ├── adminController.js
│   │   ├── appointmentController.js
│   │   ├── authController.js
│   │   ├── doctorController.js
│   │   ├── medicalRecordController.js
│   │   ├── notificationController.js
│   │   └── prescriptionController.js
│   ├── middleware/
│   │   └── auth.js             # JWT protect and authorize('patient','doctor','admin')
│   ├── models/                 # Mongoose Data Schemas
│   │   ├── Appointment.js
│   │   ├── Doctor.js
│   │   ├── MedicalRecord.js
│   │   ├── Notification.js
│   │   ├── Prescription.js
│   │   └── User.js
│   ├── routes/                 # Express API routes
│   ├── tests/
│   │   └── api-tests.http      # Complete REST client test suite
│   ├── .env                    # Environment credentials
│   ├── package.json
│   ├── seed.js                 # Database seeder with realistic test data
│   └── server.js               # Express server entry point
└── README.md
```

---

## ⚡ Quick Start Guide

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **MongoDB Atlas** connection string (pre-configured in `server/.env`)

---

### Step 1: Start the Backend Server

```bash
cd server
npm install
npm run seed       # (Optional) Seeds demo accounts, doctors, and appointments
npm run dev        # Starts server on http://localhost:5000 with nodemon
```

> **Note:** The server includes a health check endpoint at `http://localhost:5000/api/health`.

---

### Step 2: Start the Frontend Client

In a separate terminal:

```bash
cd client
npm install
npm run dev        # Starts Vite dev server on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔑 Demo Login Accounts

For testing all roles, the database seeder (`npm run seed`) configures the following demo credentials:

| Role | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `admin123` | System metrics, doctor verification approvals, account status controls |
| **Doctor** (Cardiology) | `doctor@example.com` | `password123` | Dr. Rajesh Sharma (Apollo Hospitals, Fee: ₹1,200) |
| **Doctor** (Dermatology) | `ananya@example.com` | `password123` | Dr. Ananya Iyer (Manipal Hospital, Fee: ₹800) |
| **Doctor** (Pediatrics) | `priya@example.com` | `password123` | Dr. Priya Nair (Cloudnine Hospital, Fee: ₹700) |
| **Doctor** (Neurology) | `arvind@example.com` | `password123` | Dr. Arvind Swaminathan (Fortis Malar, Fee: ₹1,500) |
| **Patient** | `patient@example.com` | `password123` | Kavipriyan Murugan &mdash; Book visits, digital Rx, medical records |

> **Pro-Tip:** The login page includes one-click **"⚡ Demo Quick Fill"** buttons to log in instantly without typing.

---

## 📡 REST API Reference

All API routes are prefixed with `/api`. Protected routes require an `Authorization: Bearer <TOKEN>` header.

### 1. Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new patient account |
| `POST` | `/api/auth/login` | Public | Login with email & password, returns JWT |
| `POST` | `/api/auth/register-doctor` | Public | Register doctor (marks `isApproved: false`) |
| `GET` | `/api/auth/me` | Authenticated | Fetch authenticated user profile |
| `PUT` | `/api/auth/profile` | Authenticated | Update user profile, contact, and address |
| `PUT` | `/api/auth/change-password` | Authenticated | Change account password |

### 2. Doctors (`/api/doctors`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/doctors` | Public | List approved doctors with filters (`specialization`, `search`, `sort`) |
| `GET` | `/api/doctors/specializations`| Public | Get distinct list of doctor specializations |
| `GET` | `/api/doctors/:id` | Public | Get doctor public profile, ratings, reviews, and slots |
| `GET` | `/api/doctors/my-profile` | Doctor | Get doctor's own professional profile |
| `PUT` | `/api/doctors/profile` | Doctor | Update consultation fee, bio, availability slots |
| `POST`| `/api/doctors/:id/review` | Patient | Submit rating (1–5) and review for doctor |

### 3. Appointments (`/api/appointments`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/appointments` | Patient | Book appointment (checks for slot conflicts) |
| `GET` | `/api/appointments/my` | Patient | List patient's booked consultations |
| `GET` | `/api/appointments/doctor` | Doctor | List doctor's appointments by date/status |
| `GET` | `/api/appointments/:id` | Authenticated | Get appointment details |
| `PUT` | `/api/appointments/:id/status`| Doctor/Admin | Update status (`confirmed`, `completed`, `cancelled`) |
| `PUT` | `/api/appointments/:id/cancel`| Patient | Cancel appointment with cancellation reason |

### 4. Prescriptions (`/api/prescriptions`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/prescriptions` | Doctor | Issue digital Rx & mark appointment completed |
| `GET` | `/api/prescriptions/my` | Patient | Get patient's prescription history |
| `GET` | `/api/prescriptions/doctor`| Doctor | Get prescriptions issued by doctor |
| `GET` | `/api/prescriptions/:id` | Authenticated | Get detailed prescription by ID |

### 5. Medical Records (`/api/medical-records`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/medical-records` | Patient | Save medical report/test record |
| `GET` | `/api/medical-records/my` | Patient | List patient's health records |
| `DELETE`| `/api/medical-records/:id`| Patient | Remove a medical record |
| `GET` | `/api/medical-records/patient/:id`| Doctor/Admin| View patient records during consultation |

### 6. Notifications (`/api/notifications`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/notifications` | Authenticated | Fetch notifications & unread count |
| `PUT` | `/api/notifications/read-all`| Authenticated | Mark all notifications as read |
| `PUT` | `/api/notifications/:id/read`| Authenticated | Mark specific notification as read |

### 7. Administration (`/api/admin`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/stats` | Admin | Get system metrics & recent appointments |
| `GET` | `/api/admin/doctors/pending`| Admin | List doctor applications awaiting verification |
| `PUT` | `/api/admin/doctors/:id/approve`| Admin | Approve (`approved: true`) or reject doctor |
| `GET` | `/api/admin/users` | Admin | Search and list all registered users |
| `PUT` | `/api/admin/users/:id/toggle-status`| Admin | Enable or disable user account |
| `GET` | `/api/admin/appointments` | Admin | Master log of all appointments |

---

## 🧪 Testing with REST Client

A full API test collection is provided in [server/tests/api-tests.http](file:///e:/Medical%20appoinment%20system/server/tests/api-tests.http). You can execute requests directly inside VS Code using the **REST Client** extension or import them into Postman or Insomnia.

---

## 🔒 Security Best Practices Implemented
- **Password Hashing:** Passwords hashed with `bcryptjs` salt rounds (12) via Mongoose pre-save hooks.
- **JWT Protection:** Signed JSON Web Tokens with expiration and verification middleware.
- **Role Guards:** Strict multi-role middleware preventing unauthorized cross-role access.
- **Data Sanitization:** Passwords automatically stripped from JSON serialization outputs.
- **CORS Config:** Configured for Vite frontend origins (`http://localhost:5173`, `http://localhost:3000`).

