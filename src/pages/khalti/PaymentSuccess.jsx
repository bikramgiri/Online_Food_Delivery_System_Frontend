import React, { useEffect, useState } from 'react'
import { APIAuthenticated } from '../../http';
import Loader from '../../components/loader/Loader';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { emptyCart } from '../../store/cartSlice';

const PaymentSuccess = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const queryParams = new URLSearchParams(location.search);
  const pidx = queryParams.get("pidx");
  const [loading, setLoading] = useState(true);

  const verifyPidx = async () => {
    try {
      const response = await APIAuthenticated.post("/users/verifypidx", {pidx});
      console.log("Payment Verification Response:", response.data);
      if (response.status === 200) {
        setLoading(false);
        alert(response.data.message)
        // **Remove cart items after payment successful
        dispatch(emptyCart());

        setTimeout(() => {
          navigate('/')
        }, 3000);
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      alert("Payment verification failed. Please try again.");
    }
  };

  useEffect(() => {
    verifyPidx();
  }, []);

  if (loading) {
    return(
      <Loader status="Verifying payment..." />
    )
  }else{
    return(
      <Loader status="Payment successful!" />
    )
  }
}

export default PaymentSuccess
