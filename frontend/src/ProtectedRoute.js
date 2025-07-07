// ProtectedRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useStateValue } from './StateProvider'; // Adjust the path as needed

export const ProtectedRoute = () => {
  const [{ user }] = useStateValue();
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

