# AI-Powered Wearable Health Monitoring Dashboard

A web-based dashboard developed as part of an AI-powered wearable health monitoring and predictive system. The application provides a visual interface for presenting physiological measurements and supporting health monitoring through a connected backend API.

## Overview

The dashboard is the frontend component of a smart health monitoring system designed to help users observe their health indicators and understand changes in their physiological data.

It communicates with a backend service responsible for processing health data, storing readings, and supporting health risk assessment.

The project demonstrates frontend development, API integration, data visualisation, and the integration of web technologies with an AI-assisted health monitoring application.

## Features

- **Health Data Visualisation:** Presents physiological measurements through a web interface.
- **API Integration:** Uses HTTP requests to communicate with backend services.
- **Data-Driven Interface:** Supports the presentation of health monitoring information returned by the backend.
- **Chart-Based Visualisation:** Uses Recharts for displaying supported data graphically.
- **Client-Side Navigation:** Uses React Router for application navigation.

*Note: The availability of individual features depends on the current implementation and the data returned by the backend.*

## Technology Stack

| Technology | Purpose |
|---|---|
| React | Building the user interface |
| JavaScript | Application logic |
| Axios | HTTP communication with backend services |
| React Router | Client-side navigation |
| Recharts | Data visualisation |
| CSS | Styling and layout |

## Project Architecture

The dashboard communicates with the backend API to retrieve or submit supported health monitoring data.

```text
User
  |
  v
React Dashboard
  |
  v
Axios HTTP Requests
  |
  v
FastAPI Backend
  |
  v
Database and Health Assessment Logic
```

The backend repository is available here:

[Health Backend](https://github.com/Ajayotb/health-backend)

## Live Demo

Explore the deployed dashboard:

[Open Health Monitoring Dashboard](https://health-dashboard-six-puce.vercel.app/)

## Getting Started

### Prerequisites

- Node.js
- npm
- Access to the backend API for features that require server communication

### Installation

Clone the repository:

```bash
git clone https://github.com/Ajayotb/health-dashboard.git
```

Navigate to the project directory:

```bash
cd health-dashboard
```

Install the dependencies:

```bash
npm install
```

### Running Locally

Start the development server:

```bash
npm start
```

The application should be available at:

```text
http://localhost:3000
```

### Production Build

Create an optimised production build:

```bash
npm run build
```

The generated build files can be deployed to a compatible static hosting platform.

## Related Repository

The backend API is maintained separately:

- [health-backend](https://github.com/Ajayotb/health-backend)

## Project Purpose

This project demonstrates the application of software engineering principles to the development of a health monitoring interface, including component-based UI development, API communication, and data visualisation.

## Disclaimer

This application is a software development project and is not intended to replace professional medical advice, diagnosis, or treatment.
