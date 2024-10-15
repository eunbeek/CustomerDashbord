# CustomerDashboard

This project is a **Customer Dashboard** application designed to fetch and display customer information from an external source like Shopify, enabling periodic synchronization between Shopify and the local database. It includes functionality for CRUD operations (Create, Read, Update, Delete) on customer data and real-time updates via WebSocket and REST API.

## Project Overview

CustomerDashboard provides a seamless interface for managing customer data. This application uses **React** on the client side and **Node.js** with **Express** and **PostgreSQL** on the server side. It integrates with the **Shopify API** to fetch customer data and manage synchronization with a local database. Additionally, it supports WebSocket for real-time updates and REST API for CRUD operations.

### **YouTube Demo**

Watch a demo of the CustomerDashboard on YouTube:

[![CustomerDashboard Demo](https://img.youtube.com/vi/jAUz44ib2Uo/0.jpg)](https://youtu.be/jAUz44ib2Uo)

### **Main Features**

1. **Customer Data Fetching**: Fetch customer data from Shopify API and display it on the dashboard.
2. **CRUD Operations**: Manage customer records using Create, Read, Update, and Delete functions.
3. **Database Sync**: Periodically sync customer data between Shopify and the local PostgreSQL database.
4. **Company Information Management**: Extract company information from customer data and store it separately in the local database.

### **Tech Stack**

- **Frontend**: React, Material-UI
- **Backend**: Node.js, Express.js with REST API for customer data management
- **Database**: PostgreSQL
- **External APIs**: Shopify API (for customer data) with GraphQL for syncing customer/company data

## **Installation**

To run the project locally, follow these steps:

1. **Clone the repository:**

```bash
git clone https://github.com/yourusername/CustomerDashboard.git
