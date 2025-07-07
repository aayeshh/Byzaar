# Byzaar
Byzaar is a full-featured e-commerce web application that replicates key functionalities of platforms like Amazon. Built with a **React.js frontend** and a **Node.js backend** connected to **MS SQL Server**, Byzaar supports both **buyers and sellers**, allowing users to register, browse products, add to cart, leave reviews, and more.

## 📌 Features

### 🔐 Authentication & Authorization
- User registration & login
- Separate flows for **buyers** and **sellers**

### 🛒 Buyer Functionality
- Browse products on Home page
- Add/remove items from cart
- Real-time **cart total price** calculation
- Save & update **shipping/home address**
- Checkout system
- Leave reviews on purchased items

### 🛍️ Seller Functionality
- Product listing management (add, edit, delete products)
- View buyer reviews

### 💬 Reviews
- Buyers can leave feedback after purchase
- Star ratings and comments

---

## ⚙️ Tech Stack

| Frontend        | Backend           | Database      |
|----------------|-------------------|---------------|
| React.js        | Node.js + Express | MS SQL Server |

Other tools & libraries:
- Axios (for API calls)
- React Router (for navigation)
- bcrypt & JWT (for authentication)
- Sequelize or `mssql` (for DB interaction, depending on your choice)

## 🚀 Getting Started

### Prerequisites
- Node.js & npm
- MS SQL Server running locally or remotely
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/aayeshh/byzaar.git
cd byzaar

cd backend
npm install
# Configure DB credentials in a `.env` file
node server.js

cd ../frontend
npm install
npm start
