# 📝 Next.js Full-Stack Todo App

This is a full-stack Todo application built with **Next.js**, **React**, **TypeScript**, **MongoDB**, **Tailwind CSS**, and **JWT Authentication**. Users can add, edit, delete, and filter tasks with functionality to mark tasks as completed or incomplete. It also features secure JWT-based authentication for user management.

##  Features

- ✅ **Add a new todo**  
- ✅ **Mark todo as completed/incomplete**  
- ✅ **Delete a todo**  
- ✅ **Filter todos** (All / Completed / Incomplete)  
- ✅ **Secure JWT Authentication** (Login/Signup)  
- ✅ **Responsive design** with Tailwind CSS  
- ✅ **TypeScript support**  
- ✅ **User-specific todos** (Only the logged-in user can access and modify their own todos)

##  Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (using JWT Authentication)
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens) for secure login/signup 

---

##  Installation & Setup Instructions

1. **Clone the Repository**

```bash
git clone https://github.com/your-username/nextjs-todo-app.git
```

2. **Install Dependencies**

```bash
npm install
```
3. **Set up Environment Variables**

Create a .env.local file in the root of your project and add the following environment variables:
```bash
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

3. **Run the Development Server**
```bash
npm run dev
```

## 🌍 Live Demo
https://todo-app-three-eta-19.vercel.app/


##  How To Use
1- Sign Up: Create a new account by providing a username and password.

2- Login: Log in to access your todo list.

3- Add Todos: Add tasks to your list and mark them as completed/incomplete.

4- Filter Todos: Filter tasks by their status (All, Completed, Incomplete).

5- Edit/Delete Todos: Modify or remove tasks as needed.