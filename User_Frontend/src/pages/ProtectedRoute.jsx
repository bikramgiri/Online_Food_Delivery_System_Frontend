import React from 'react'
import { useSelector } from 'react-redux';

const ProtectedRouteForAdmin = ({ children }) => {
  const { data } = useSelector((state) => state.auth);
  console.log("ProtectedRouteForAdmin - Auth Data:", data); // Debug line

//   if (!data || !data.role) {
//     return <h1 className="mt-92 text-center">Please log in to access this page</h1>;
//   }

  if (data.role !== 'customer') {
    return <h1 className="mt-92 text-center">You do not have permission to access this page</h1>;
  }

  return <>{children}</>;
};

const ProtectedRouteForCustomer = ({ children }) => {
  const { data } = useSelector((state) => state.auth);
  console.log("ProtectedRouteForCustomer - Auth Data:", data); // Debug line

  if (!data || !data.role) {
    return <h1 className="mt-92 text-center">Please log in to access this page</h1>;
  }

  if (data.role !== 'customer') {
    return <h1 className="mt-92 text-center">You do not have permission to access this page</h1>;
  }

  return <>{children}</>;
};

export { 
      ProtectedRouteForAdmin,
      ProtectedRouteForCustomer 
}
