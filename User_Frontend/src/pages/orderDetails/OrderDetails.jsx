import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchOrder } from "../../store/CheckOutSlice";
import { APIAuthenticated } from "../../http";
import QRCode from "react-qr-code";

const OrderDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { orders } = useSelector((state) => state.checkout);

  useEffect(() => {
    dispatch(fetchOrder()); // Ensure orders are fetched if not already in store
  }, [dispatch]);

  // Filter orders to find the one with matching ID
  const filteredOrder = orders.find((order) => order._id === id);

    const totalProductAmount = Array.isArray(filteredOrder?.items)
    ? filteredOrder.items.reduce(
        (price, item) =>
          price + (item.product?.productPrice || 0) * item.quantity,
        0
      )
    : 0;

    const handleCancelOrder = async()=>{
      try {
        const response = await APIAuthenticated.patch(`/users/orders/cancel/${id}`);
        console.log("Cancel Response:", response)
        if(response.status === 200) {
        navigate("/myorders")
        }
      } catch (error) {
        console.error("Error cancelling order:", error);
      }
    }

        const handleDeleteOrder = async()=>{
      try {
        const response = await APIAuthenticated.delete(`/users/orders/${id}`);
        console.log("Delete Response:", response)
        if(response.status === 200) {
        navigate("/myorders")
        }
      } catch (error) {
        console.error("Error deleting order:", error);
      }
    }

    const adminOrderPageUrl = `http://localhost:5174/admin/orders/${id}`;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
              <button
          onClick={() => navigate("/myorders")}
          className="cursor-pointer mt-22 items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Back to My Orders
        </button>
      <div className="mt-30 max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {/* Order ID Header */}
        <div className="bg-blue-600 text-white p-6 text-center">
          <h1 className="text-2xl font-bold">Order ID: {id}</h1>
        </div>

        {/* Products Details */}
        <div className="p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Products
          </h2>
          <div className="space-y-4">
            {filteredOrder &&
              filteredOrder.items.length > 0 &&
              filteredOrder.items.map((item) => {
                return (
                  <div
                    key={item.product._id}
                    className="rounded-lg mb-2 border border-gray-200 bg-white p-2 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-4"
                  >
                    <div className="space-y-2 md:flex md:items-center md:justify-between md:gap-4 md:space-y-0">
                      <img
                        className="h-25 w-35 dark:block"
                        src={item.product.productImage}
                        alt={item.product.productName || "Product image"}
                      />
                      <div className="flex mt-10 items-center justify-between md:order-3 md:justify-end">
                        <div className="flex items-center">
                          <p className="font-medium dark:text-white">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className="text-end md:order-4 md:w-32">
                          <p className="text-base font-bold text-gray-900 dark:text-white">
                            NPR {item.product.productPrice}
                          </p>
                        </div>
                      </div>

                      <div className="min-w-0 ml-4 flex-1 space-y-4 md:order-2 md:max-w-md">
                        <p className="text-2xl font-medium text-gray-900 dark:text-white">
                          {item.product.productName}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
          <p className="text-xl font-semibold text-gray-900 dark:text-white">
            Order summary
          </p>

          <div className="space-y-4">
            <div className="space-y-2">
              <dl className="flex items-center justify-between gap-4">
                <dt className="font-medium dark:text-white">Order Status</dt>
                <dd className="font-medium dark:text-white">
                  {filteredOrder?.orderStatus}
                </dd>
              </dl>

              <dl className="flex items-center justify-between gap-4">
                <dt className="text-base font-normal text-gray-500 dark:text-white">
                  Payment Method
                </dt>
                <dd className="text-base font-medium text-gray-900 dark:text-white">
                  {filteredOrder?.paymentDetails?.method}
                </dd>
              </dl>

              <dl className="flex items-center justify-between gap-4">
                <dt className="font-medium dark:text-white">Payment Status</dt>
                <dd className="font-medium text-green-600">
                  {filteredOrder?.paymentDetails?.status}
                </dd>
              </dl>

              <dl className="flex items-center justify-between gap-4">
                <dt className="font-medium dark:text-white"> Total Products</dt>
                <dd className="font-medium text-green-600">
                  {filteredOrder?.items?.length}
                </dd>
              </dl>

              <dl className="flex items-center justify-between gap-4">
                <dt className="font-medium dark:text-white"> Shipping Price</dt>
                <dd className="font-medium text-green-600">
                  NPR 200
                </dd>
              </dl>

                <dl className="flex items-center justify-between gap-4">
                <dt className="font-medium dark:text-white"> Total Products Price</dt>
                <dd className="font-medium text-green-600">
                  NPR {totalProductAmount.toFixed(2)}
                </dd>
              </dl>

              <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                <dt className="text-xl font-bold text-gray-900 dark:text-white">
                  Total Amount
                </dt>
                <dd className="text-xl font-bold text-gray-900 dark:text-white">
                  NPR {filteredOrder?.totalAmount.toFixed(2)}
                </dd>
              </dl>
            </div>
          </div>
          </div>

          {/* Shipping Address */}
          <div className="mt-8 space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
          <div>
              <dl className="flex items-center justify-between gap-4">
                <dt className="text-base font-normal text-gray-500 dark:text-white">
                  Shipping Address
                </dt>
                <dd className="text-base font-medium text-gray-900 dark:text-white">
                  {filteredOrder?.shippingAddress}
                </dd>
              </dl>
          </div>

            <div>
              <dl className="flex items-center justify-between gap-4">
                <dt className="text-base font-normal text-gray-500 dark:text-white">
                  Phone Number
                </dt>
                <dd className="text-base font-medium text-gray-900 dark:text-white">
                  {filteredOrder?.phoneNumber}
                </dd>
              </dl>
          </div>

          {/* Delivery Note */}
          {/* <div>
              <dl className="flex items-center justify-between gap-4">
                <dt className="text-base font-normal text-gray-500 dark:text-white">
                  Delivery Note
                </dt>
                <dd className="text-base font-medium text-gray-900 dark:text-white">
                  Delivery within 24 hours
                </dd>
              </dl>
          </div> */}
          </div>


                  <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
          <p className="text-xl font-semibold text-gray-900 dark:text-white">
            QR Code
          </p>
              <QRCode className="mx-auto" value={adminOrderPageUrl} />
          </div>

          {/* Actions */}
          <div className="mt-8 space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
          <div className="p-6 flex space-x-4 justify-center bg-gray-50 dark:bg-gray-700">
            {
              filteredOrder?.orderStatus !== "cancelled" && (
                <>
            <button onClick={handleCancelOrder} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 transition duration-200">
              Cancel Order
            </button>
                        <button className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 transition duration-200">
              Edit Order
            </button>
                </>
              )
            }
            <button onClick={handleDeleteOrder} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 transition duration-200">
              Delete Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
