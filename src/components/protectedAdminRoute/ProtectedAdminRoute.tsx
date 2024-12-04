import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedAdminRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const role = localStorage.getItem('role');

  let isAdmin = false;
  if (role === "ADMIN") {
    isAdmin = true;
  }
  if (!isAdmin) {
    return (
        <h1>Nie masz wystraczających uprawnień</h1>
    )
  }

  return children;
};

export default ProtectedAdminRoute;
