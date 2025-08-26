import React, { useEffect } from 'react'

const Khalti = () => {
      const queryParams = new URLSearchParams(location.search);
      const totalAmount = queryParams.get("totalAmount");
      const orderId = queryParams.get("orderId");
      console.log("Khalti Page - Total Amount:", totalAmount, "Order ID:", orderId);

      useEffect(() => {
        // You can add any side effects or API calls here
      }, []);

  return (
    <div className='mt-80 mb-40 text-center'>
      <h1>Khalti Payment</h1>
      <p>Total Amount: {totalAmount}</p>
      <p>Order ID: {orderId}</p>
    </div>
  )
}

export default Khalti
