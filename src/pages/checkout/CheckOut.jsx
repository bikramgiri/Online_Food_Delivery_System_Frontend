import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem } from "../../store/cartSlice";
import { useForm } from "react-hook-form";
import { STATUSES } from "../../global/statuses";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../../store/CheckOutSlice";

const CheckOut = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: products } = useSelector((state) => state.cart);
  const { status, data } = useSelector((state) => state.checkout);

  const handleDeleteItem = (productId) => {
    dispatch(deleteCartItem(productId));
  };

  const [billing, setBilling] = useState({
    // firstName: "",
    // lastName: "",
    // email: "",
    phone: "",
    address: "",
    state: "",
    postalCode: "",
    country: "",
    city: "",
    saveData: false,
  });

  const handleBillingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBilling((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const totalItemsInCart = products?.reduce((total, item) => total + item.quantity, 0);
  const totalPriceOfCart = products?.reduce((price, item) => price + item.product.productPrice * item.quantity, 0);

  const [selectedMethod] = useState(null); // setSelectedMethod

  const paymentMethods = [
    // {
    //   id: "credit-card",
    //   name: "Credit Card",
    //   icon: (
    //     <svg
    //       className="w-6 h-6 text-gray-600"
    //       fill="none"
    //       stroke="currentColor"
    //       viewBox="0 0 24 24"
    //       xmlns="http://www.w3.org/2000/svg"
    //     >
    //       <path
    //         strokeLinecap="round"
    //         strokeLinejoin="round"
    //         strokeWidth="2"
    //         d="M3 10h18M7 15h1m-1 0h6m-6 0v-2m6 2v-2M7 7h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v2a2 2 0 002 2z"
    //       ></path>
    //     </svg>
    //   ),
    // },
    // {
    //   id: "debit-card",
    //   name: "Debit Card",
    //   icon: (
    //     <svg
    //       className="w-6 h-6 text-gray-600"
    //       fill="none"
    //       stroke="currentColor"
    //       viewBox="0 0 24 24"
    //       xmlns="http://www.w3.org/2000/svg"
    //     >
    //       <path
    //         strokeLinecap="round"
    //         strokeLinejoin="round"
    //         strokeWidth="2"
    //         d="M3 10h18M7 15h1m-1 0h6m-6 0v-2m6 2v-2M7 7h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v2a2 2 0 002 2z"
    //       ></path>
    //     </svg>
    //   ),
    // },
    // {
    //   id: "paypal",
    //   name: "PayPal",
    //   icon: (
    //     <svg
    //       className="w-6 h-6 text-blue-600"
    //       fill="currentColor"
    //       viewBox="0 0 24 24"
    //       xmlns="http://www.w3.org/2000/svg"
    //     >
    //       <path d="M7.8 21.6c-1.2 0-2.3-.4-3.2-1.1-1.6-1.2-2.6-3-2.6-5 0-2.1 1-3.8 2.8-4.6.6-.3 1.3-.5 2-.6.2-.5.5-1 .8-1.5-1-.3-1.9-.9-2.5-1.7-1-1.3-1.5-2.9-1.5-4.6 0-3.6 2.9-6.5 6.5-6.5 2.2 0 4.1 1.1 5.2 2.8.2.3.4.6.6 1 .4-.1.8-.2 1.2-.2 2.8 0 5 2.2 5 5 0 1.7-.8 3.2-2.1 4.2-1.3 1-3 1.6-4.9 1.6-.6 0-1.2-.1-1.7-.2.1.5.2 1 .2 1.5 0 2.8-1.7 5.2-4.2 6.2-1.2.5-2.6.8-4.1.8zm2.8-15.1c-.6 0-1.1.1-1.6.3-.9.4-1.6 1.1-1.9 2-.3.9-.2 1.9.2 2.7.5.9 1.3 1.5 2.3 1.8.2 0 .4.1.6.1 1.8 0 3.3-1.5 3.3-3.3 0-1.5-1-2.6-2.9-2.6zm4.9 8.9c1.5 0 2.7-.7 3.4-1.8.6-1 .9-2.2.9-3.5 0-2.2-1.6-4-3.8-4-.9 0-1.7.3-2.3.8-.6.5-1 1.2-1.2 2-.1.2-.2.4-.3.6.5.2 1 .3 1.5.3 1.8 0 3.3 1.5 3.3 3.3 0 1.2-.6 2.2-1.5 2.8-.4.3-.9.5-1.4.5-.3 0-.6-.1-.9-.2-.1-.3-.2-.6-.2-1 0-.2 0-.4.1-.6.2-.1.4-.2.6-.2.7 0 1.3.6 1.3 1.3 0 .2-.1.4-.2.5-.2.2-.5.3-.8.3z" />
    //     </svg>
    //   ),
    // },
    {
      id: "cash-on-delivery",
      name: "Cash on Delivery",
      icon: (
        <svg
          className="w-6 h-6 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
          ></path>
        </svg>
      ),
    },
    {
      id: "khalti",
      name: "Khalti",
      icon: (
        <svg
          className="w-6 h-6 text-yellow-600"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          {/* Placeholder Khalti icon - replace with official logo SVG if available */}
        </svg>
      ),
    },
    {
      id: "esewa",
      name: "eSewa",
      icon: (
        <svg
          className="w-6 h-6 text-green-600"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          {/* Placeholder eSewa icon - replace with official logo SVG if available */}
        </svg>
      ),
    },
  ];

  const { register, handleSubmit, formState } = useForm();

  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

  const itemsAmount = totalPriceOfCart;
  const shippingCost = 200;
  const totalAmount = itemsAmount + shippingCost;

  const handleOrder = (data) => {
    const orderDetails = {
      shippingAddress: data.shippingAddress,
      totalAmount: totalAmount,
      // items: products,
      items: products.map((item) => ({
        product: item.product._id, // Send only the product ID
        quantity: item.quantity,
      })),
      paymentDetails: {
        method: paymentMethod,
        // status: "Pending"
      },
      phoneNumber: data.phoneNumber,
    };
    dispatch(createOrder(orderDetails))
  };

const proceedForKhaltiPayment = () => {
    if (data && data.length > 0) {
      const latestOrder = data[data.length - 1];
      if (latestOrder && typeof latestOrder === "object") {
        const { totalAmount, _id } = latestOrder;
        if (paymentMethod === "Cash on Delivery") {
          alert("Order placed successfully!");
        } else if (paymentMethod === "Khalti") {
          navigate(`/khalti?totalAmount=${totalAmount}&orderId=${_id}`);
        }
      }
    } else if (status === STATUSES.ERROR) {
      alert("Payment failed. Please try again.");
    }
  };

  useEffect(() => {
    proceedForKhaltiPayment();
  },[status, data]); 

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  return (
    <>
      <div className="bg-gray-600 text-white min-h-screen p-8">
        <div className="mt-12 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>
          <form
            onSubmit={handleSubmit((data) => {
              handleOrder(data);
            })}
            noValidate
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                {/* Billing Details */}
                <div className="bg-gray-800 rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Billing address
                  </h2>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <label className="dark:text-white" htmlFor="firstName">
                      First Name
                    </label>
                    <label className="dark:text-white" htmlFor="lastName">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      placeholder="Enter your first name"
                      // value={billing.firstName}
                      className="bg-gray-700 rounded-md p-3 border border-dark-input focus:outline-none focus:ring-2 focus:ring-primary-blue"
                      // onChange={handleBillingChange}
                      {...register("firstName", {
                        required: "First name is required",
                      })}
                    />
                    {/* <p className="text-red-500">{formState.errors.firstName?.message}</p> */}
                    <input
                      type="text"
                      name="lastName"
                      required
                      placeholder="Enter your last name"
                      // value={billing.lastName}
                      className="bg-gray-700 rounded-md p-3 border border-dark-input focus:outline-none focus:ring-2 focus:ring-primary-blue"
                      // onChange={handleBillingChange}
                      {...register("lastName", {
                        required: "Last name is required",
                      })}
                    />
                    <p className="text-red-500">
                      {formState.errors.firstName?.message}
                    </p>
                    <p className="text-red-500">
                      {formState.errors.lastName?.message}
                    </p>
                  </div>
                  <div className="mb-1">
                    <label className="dark:text-white" htmlFor="email">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="Enter your email"
                      // value={billing.email}
                      className="w-full bg-gray-700 rounded-md p-3 mb-4 border border-dark-input focus:outline-none focus:ring-2 focus:ring-primary-blue"
                      // onChange={handleBillingChange}
                      {...register("email", { required: "Email is required" })}
                    />
                    <p className="text-red-500">
                      {formState.errors.email?.message}
                    </p>
                  </div>
                  <div className="mb-1">
                    <label className="dark:text-white" htmlFor="phoneNumber">
                      Phone Number
                    </label>
                    <input
                      type="number"
                      name="phoneNumber"
                      required
                      placeholder="Enter your phone number"
                      value={billing.phoneNumber}
                      className="w-full bg-gray-700 rounded-md p-3 mb-4 border border-dark-input focus:outline-none focus:ring-2 focus:ring-primary-blue"
                      onChange={handleBillingChange}
                      {...register("phoneNumber", {
                        required: "Phone number is required",
                      })}
                    />
                    <p className="text-red-500">
                      {formState.errors.phoneNumber?.message}
                    </p>
                  </div>
                  <div className="mb-1">
                    <label className="dark:text-white" htmlFor="address">
                      Shipping Address
                    </label>
                    <input
                      type="text"
                      name="shippingAddress"
                      required
                      placeholder="Enter your shipping address"
                      value={billing.shippingAddress}
                      className="w-full bg-gray-700 rounded-md p-3 mb-4 border border-dark-input focus:outline-none focus:ring-2 focus:ring-primary-blue"
                      rows="2"
                      onChange={handleBillingChange}
                      {...register("shippingAddress", {
                        required: "Shipping address is required",
                      })}
                    />
                    <p className="text-red-500">
                      {formState.errors.shippingAddress?.message}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <label className="dark:text-white" htmlFor="state">
                      State/Province
                    </label>
                    <label className="dark:text-white" htmlFor="postalCode">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="state"
                      placeholder="Enter your state/province"
                      value={billing.state}
                      className="bg-gray-700 rounded-md p-3 border border-dark-input focus:outline-none focus:ring-2 focus:ring-primary-blue"
                      onChange={handleBillingChange}
                    />
                    <input
                      type="text"
                      name="postalCode"
                      placeholder="Enter your postal code"
                      value={billing.postalCode}
                      className="bg-gray-700 rounded-md p-3 border border-dark-input focus:outline-none focus:ring-2 focus:ring-primary-blue"
                      onChange={handleBillingChange}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <label className="dark:text-white" htmlFor="country">
                      Country
                    </label>
                    <label className="dark:text-white" htmlFor="city">
                      City
                    </label>
                    <select
                      name="country"
                      value={billing.country}
                      className="bg-gray-700 rounded-md p-3 border border-dark-input focus:outline-none focus:ring-2 focus:ring-primary-blue"
                      onChange={handleBillingChange}
                    >
                      <option value="">Select your country</option>
                      <option value="Nepal">Nepal</option>
                      <option value="India">India</option>
                      <option value="United States">United States</option>
                      <option value="Australia">Australia</option>
                      <option value="Canada">Canada</option>
                    </select>
                    <input
                      type="text"
                      name="city"
                      placeholder="Enter your city"
                      value={billing.city}
                      className="bg-gray-700 rounded-md p-3 border border-dark-input focus:outline-none focus:ring-2 focus:ring-primary-blue"
                      onChange={handleBillingChange}
                    />
                  </div>
                  {/* <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="saveData"
                    checked={billing.saveData}
                    className="form-checkbox text-primary-blue"
                    onChange={handleBillingChange}
                  />
                  <span>Save data in the address list</span>
                </label> */}
                </div>
                {/* </form> */}
                {/* <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-white">
                  Delivery address
                </h2>
                <div className="space-y-2 mb-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="delivery-type"
                      className="form-radio text-primary-blue"
                    />
                    <span>Delivery to the same address</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="delivery-type"
                      className="form-radio text-primary-blue"
                    />
                    <span>Deliver to another address</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="delivery-type"
                      className="form-radio text-primary-blue"
                    />
                    <span>Store pickup</span>
                  </label>
                  <p className="text-sm text-gray-500">
                    (Choose the store from which you want to pick up the
                    products)
                  </p>
                </div>
              </div> */}
                {/* Payment Details */}
                <div className="bg-gray-800 max-w-2xl mx-auto p-6 rounded-lg shadow-md">
                  <h2 className="text-2xl font-bold mb-6 dark:text-white">
                    Select Payment Method
                  </h2>
                  <div className="space-y-4">
                    {paymentMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                          selectedMethod === method.id
                            ? "border-indigo-500 bg-gray-500"
                            : "border-gray-200"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === method.name}
                          onChange={handlePaymentMethodChange}
                          value={method.name}
                          // onChange={() => setSelectedMethod(method.id)}
                          className="w-5 h-5 text-indigo-600 focus:ring-indigo-500"
                        />
                        <div className="ml-4 flex items-center justify-between w-full">
                          <div className="flex items-center">
                            {method.icon}
                            <span className="ml-3 dark:text-white font-medium">
                              {method.name}
                            </span>
                          </div>
                          {selectedMethod === method.id && (
                            <span className="text-indigo-600 font-semibold">
                              Selected
                            </span>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                  {/* <button
                  className="mt-6 w-full dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white border py-2 px-4 rounded-md font-medium"
                  onClick={() =>
                    alert(
                      `Proceeding with ${selectedMethod || "no"} payment method`
                    )
                  }
                >
                  Proceed to Pay
                </button> */}
                </div>
              </div>

              {/* Right Column: Cart Items and Order Summary */}
              <div className="space-y-6">
                {/* Cart Items */}
                <div className="space-y-6">
                  {status === "loading" ? (
                    <p>Loading...</p>
                  ) : !Array.isArray(products) || products.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400">
                      Your cart is empty.
                    </p>
                  ) : (
                    products.length > 0 &&
                    products.map((product) => (
                      <div
                        key={product._id}
                        className="rounded-lg border border-gray-200 bg-white p-2 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-4"
                      >
                        <div className="space-y-2 md:flex md:items-center md:justify-between md:gap-4 md:space-y-0">
                          <a href="#" className="shrink-0 md:order-1">
                            <img
                              className="h-25 w-35 dark:block"
                              src={product.product.productImage}
                              alt={
                                product.product.productName || "Product image"
                              }
                            />
                          </a>

                          <div className="flex mt-10 items-center justify-between md:order-3 md:justify-end">
                            <div className="flex items-center">
                              <p className="font-medium dark:text-white">
                                Quantity:
                              </p>
                              <input
                                type="text"
                                id="counter-input"
                                data-input-counter
                                className="w-10 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none focus:ring-0 dark:text-white"
                                placeholder=""
                                value={product.quantity}
                                required
                              />
                            </div>
                            <div className="text-end md:order-4 md:w-32">
                              <p className="text-base font-bold text-gray-900 dark:text-white">
                                NPR {product.product.productPrice}
                              </p>
                            </div>
                          </div>

                          <div className="min-w-0 ml-4 flex-1 space-y-4 md:order-2 md:max-w-md">
                            <p className="text-2xl font-medium text-gray-900 dark:text-white">
                              {product.product.productName}
                            </p>

                            <div className="items-center mb-4">
                              <button
                                onClick={() =>
                                  handleDeleteItem(product.product._id)
                                }
                                type="button"
                                className="flex items-center py-2.5 px-5 text-sm font-medium mt-7 rounded-lg border dark:text-red-600 dark:bg-yellow-600 dark:hover:bg-yellow-700"
                              >
                                <svg
                                  className="me-1.5 h-5 w-5"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18 17.94 6M18 18 6.06 6"
                                  />
                                </svg>
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Order Summary */}
                <div className="bg-gray-800 rounded-lg p-6 space-y-2">
                  <h2 className="text-xl text-white font-semibold">
                    Order Summary
                  </h2>
                  <div className="flex justify-between">
                    <p className="text-white">Total Items</p>
                    <p className="text-white">{totalItemsInCart}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-white">Shipping Cost</p>
                    <p className="text-green-600">NPR {shippingCost}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-white">Items Price</p>
                    <p className="text-white">NPR {totalPriceOfCart}</p>
                  </div>
                  <div className="flex justify-between font-bold border-t pt-2">
                    <p className="text-2xl text-white">Total Amount</p>
                    <p className="text-2xl text-white">
                      NPR {totalAmount.toFixed(2)}
                    </p>
                  </div>
                  <button className="flex ml-50 items-center py-2.5 px-5 text-sm font-medium mt-7 rounded-lg border dark:text-white dark:bg-yellow-600 dark:hover:bg-yellow-700">
                    Continue to payment
                  </button>
                  <a
                    href="#"
                    className="text-sm mt-4 text-gray-400 hover:underline flex justify-center"
                  >
                    or Return to Shopping →
                  </a>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CheckOut;
