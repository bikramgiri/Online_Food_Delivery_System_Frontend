import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile } from '../store/authSlice';

const ProtectedRouteForAdmin = ({ children }) => {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.auth);

   useEffect(()=>{
    dispatch(fetchUserProfile())
  }, [dispatch])

  // if (!data || !data.role) {
  //   return <h1 className="mt-92 text-center">Please log in to access this page</h1>;
  // }

  if (data.role === 'admin') {
    return (
      <>
        {children}
      </>
    )
  }else{
    return <h1 className="mt-92 text-center">You do not have permission to access this page</h1>;
  }
};

const ProtectedRouteForCustomer = ({ children }) => {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.auth);
  console.log("ProtectedRouteForAdmin - Auth Data:", data); // Debug line

   useEffect(()=>{
    dispatch(fetchUserProfile())
  }, [dispatch])

  // if (!data || !data.role) {
  //   return <h1 className="mt-92 text-center">Please log in to access this page</h1>;
  // }

  if (data.role === 'customer') {
    return (
      <>
        {children}
      </>
    )
  }else{
    return <h1 className="mt-92 text-center">You do not have permission to access this page</h1>;
  }
};

export { 
      ProtectedRouteForAdmin,
      ProtectedRouteForCustomer 
}
