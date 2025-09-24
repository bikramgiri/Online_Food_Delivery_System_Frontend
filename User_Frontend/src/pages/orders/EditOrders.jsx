import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { editOrders, fetchOrder } from "../../store/CheckOutSlice";
import { fetchProducts } from "../../store/productSlice";

const EditOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [message, setMessage] = useState("");
  const {data: products} = useSelector((state)=>state.product)
  const { orders } = useSelector((state) => state.checkout);

  const [formData, setFormData] = useState({
    items: [],
    totalAmount: 0,
    shippingAddress: "",
    paymentDetails: { method: "Cash on Delivery" },
    phoneNumber: "",
  });

  useEffect(() => {
    dispatch(fetchOrder());
  }, [dispatch]);

      useEffect(() => {
      dispatch(fetchProducts());
    }, [dispatch])

  const filteredOrder = orders.find((order) => order._id === id);

  useEffect(() => {
    if (filteredOrder) {
      setFormData({
        items: filteredOrder.items.map((item) => ({
          product: item.product._id,
          productImage: item.product?.productImage,
          productName: item.product?.productName,
          productPrice: item.product?.productPrice,
          quantity: item.quantity,
        })),
        totalAmount: filteredOrder.totalAmount,
        shippingAddress: filteredOrder.shippingAddress,
        paymentDetails: filteredOrder.paymentDetails,
        phoneNumber: filteredOrder.phoneNumber,
      });
    }
  }, [filteredOrder]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "paymentMethod") {
      setFormData((prev) => ({
        ...prev,
        paymentDetails: { ...prev.paymentDetails, method: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...formData.items];
    updatedItems[index][name] = value;
    updateTotalAmount(updatedItems);
    setFormData((prev) => ({ ...prev, items: updatedItems }));
  };

  const updateTotalAmount = (items) => {
    const total = items.reduce((acc, item) => acc + (item.productPrice * item.quantity), 0) + 200; // Adding shipping cost
    setFormData((prev) => ({ ...prev, totalAmount: total }));
  };

  // const handleQuantityChange = (index, delta) => {
  //   const updatedItems = [...formData.items];
  //   const item = { ...updatedItems[index] };
  //   item.quantity = Math.max(1, item.quantity + delta);
  //   updatedItems[index] = item;
  //   updateTotalAmount(updatedItems);
  //   setFormData((prev) => ({ ...prev, items: updatedItems }));
  // };

  const handleQuantityChange = (index, delta) => {
    const updatedItems = [...formData.items];
    const item = { ...updatedItems[index] };
    const productStockQty = products.find(p => p._id === item.product)?.productStockQty || Infinity;
    item.quantity = Math.max(1, Math.min(productStockQty, item.quantity + delta));
    updatedItems[index] = item;
    updateTotalAmount(updatedItems);
    setFormData((prev) => ({ ...prev, items: updatedItems }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await dispatch(editOrders(id, formData));
      if (response.status === 200) {
        setMessage("Order updated successfully");
        setTimeout(() => {
          setMessage("");
          navigate("/myorders/orderdetails/" + id);
        }, 2000); // Delay navigation to show success message
      }
    } catch (error) {
      console.error("Failed to update order:", error);
      const errorMsg = error.response?.data?.message || "Failed to update product. Please try again.";
      setMessage(errorMsg);
      setTimeout(() => setMessage(""), 2000);
    }
  };

  if (!filteredOrder) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <button
        onClick={() => navigate(`/myorders/orderdetails/${id}`)}
        className="cursor-pointer mt-35 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Back to My Orders
      </button>
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="bg-blue-600 text-white p-6">
          <h1 className="text-2xl font-bold">Edit Order ID: {id}</h1>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Products</h2>
            <div className="space-y-4">
              {formData.items.map((item, index) => {
              const productStockQty = products.find(p => p._id === item.product)?.productStockQty || Infinity;
              return(
                <div key={index} className="rounded-lg mb-2 border border-gray-200 bg-white p-2 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-4">
                  <div className="space-y-2 md:flex md:items-center md:justify-between md:gap-4 md:space-y-0">
                    <img className="h-25 w-35 dark:block" src={item.productImage} alt={item.productName || "Product image"} />
                    <div className="flex mt-10 items-center justify-between md:order-3 md:justify-end">
                      <div className="flex items-center">
                        <p className="font-medium dark:text-white mr-4">Quantity:</p>
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(index, -1)}
                          disabled={item.quantity === 1}
                          className="disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200 cursor-pointer inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                        >
                          <svg className="h-2.5 w-2.5 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16" />
                          </svg>
                        </button>
                        <input
                          type="text"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, { target: { name: 'quantity', value: e.target.value } })}
                          className="w-10 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none focus:ring-0 dark:text-white"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(index, 1)}
                          disabled={item.quantity >= productStockQty}
                          className="isabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                        >
                          <svg className="h-2.5 w-2.5 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
                          </svg>
                        </button>
                      </div>
                      <div className="text-end md:order-4 md:w-32">
                        <p className="text-base font-bold text-gray-900 dark:text-white">NPR {(item.productPrice * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="min-w-0 ml-4 flex-1 space-y-4 md:order-2 md:max-w-md">
                      <p className="text-2xl font-medium text-gray-900 dark:text-white">{item.productName}</p>
                    </div>
                  </div>
                </div>
              )
})}
              <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
                <p className="text-xl font-semibold text-gray-900 dark:text-white">Order Summary</p>
                <div className="space-y-4">
                  <dl className="flex items-center justify-between gap-4">
                    <dt className="font-medium dark:text-white">Total Products</dt>
                    <dd className="font-medium text-green-600">{filteredOrder?.items?.length}</dd>
                  </dl>
                  <dl className="flex items-center justify-between gap-4">
                    <dt className="font-medium dark:text-white">Shipping Price</dt>
                    <dd className="font-medium text-green-600">NPR 200</dd>
                  </dl>
                  <dl className="flex items-center justify-between gap-4">
                    <dt className="font-medium dark:text-white">Total Products Price</dt>
                    <dd className="font-medium text-green-600">NPR {formData.items.reduce((acc, item) => acc + (item.productPrice * item.quantity), 0).toFixed(2)}</dd>
                  </dl>
                  <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                    <dt className="text-xl font-bold text-gray-900 dark:text-white">Total Amount</dt>
                    <dd className="text-xl font-bold text-gray-900 dark:text-white">NPR {formData.totalAmount.toFixed(2)}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="space-x-40 flex">
            <div>
              <label className="block text-sm font-medium text-white dark:text-white">Payment Method</label>
              <select
                name="paymentMethod"
                value={formData.paymentDetails.method}
                onChange={handleChange}
                className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
                required
              >
                <option value="Cash on Delivery">Cash on Delivery</option>
                <option value="Khalti">Khalti</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white dark:text-white">Shipping Address</label>
              <input
                type="text"
                name="shippingAddress"
                value={formData.shippingAddress}
                onChange={handleChange}
                className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white dark:text-white">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="cursor-pointer w-full inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            Update Order
          </button>
        </form>
        {message && <p className={`text-center mb-4 ${message.includes("Failed") ? "text-red-500" : "text-green-500"}`}>{message}</p>}
      </div>
    </div>
  );
};

export default EditOrder;