import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToFavorites,
  deleteCartItem,
  updateCartItem,
} from "../../store/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";

const Cart = () => {
  const navigate = useNavigate();
  const { items: products, status } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const handleDeleteItem = (productId) => {
    dispatch(deleteCartItem(productId));
  };

  const handleFavoriteItem = (productId) => {
    dispatch(addToFavorites(productId));
  };

  const handleQuantityChange = (productId, newQuantity) => {
    const quantity = Math.max(1, Number(newQuantity) || 1);
    const product = products.find((item) => item.product._id === productId);
    if (product && quantity > product.product.productStockQty) {
      return;
    }
    dispatch(updateCartItem({ productId, quantity }));
  };

  const totalItemsInCart = Array.isArray(products)
    ? products.reduce((total, item) => total + item.quantity, 0)
    : 0;
  const totalPriceOfCart = Array.isArray(products)
    ? products.reduce(
        (price, item) =>
          price + (item.product?.productPrice || 0) * item.quantity,
        0
      )
    : 0;

  const itemsAmount = totalPriceOfCart;
  const shippingCost = 200;
  const totalAmount = itemsAmount + shippingCost;

  return (
    <>
      <section className="py-12 antialiased bg-gray-600">
        <div className="mx-auto mt-20 max-w-screen-xl px-4 2xl:px-0">
          <h1 className="dark:text-white mb-0 font-bold text-3xl md:text-3xl">
            Cart Items
          </h1>
          <div className="sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
            <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
              <div className="space-y-6">
                {status === "loading" ? (
                  <Loader className="dark:text-white" status="Loading..." />
                ) : !Array.isArray(products) || products.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400">
                    Your cart is empty.
                  </p>
                ) : (
                  products.map((product) => (
                    <div
                      key={product._id}
                      className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6 mb-2"
                    >
                      <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                        <Link
                          to={`/productdetails/${product.product._id}`}
                          className="shrink-0 md:order-1"
                        >
                          <img
                            className="h-30 w-40 dark:block"
                            src={product.product.productImage}
                            alt={product.product.productName || "Product image"}
                          />
                        </Link>
                        <label htmlFor="counter-input" className="sr-only">
                          Choose quantity:
                        </label>
                        <div className="flex items-center justify-between md:order-3 md:justify-end">
                          <div className="flex items-center">
                            <p className="font-medium dark:text-white mr-4">
                              Quantity:
                            </p>
                            <button
                              type="button"
                              onClick={() =>
                                handleQuantityChange(
                                  product.product._id,
                                  product.quantity - 1
                                )
                              }
                              id="decrement-button"
                              disabled={product.quantity === 1}
                              data-input-counter-decrement="counter-input"
                              className="disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200 cursor-pointer inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                            >
                              <svg
                                className="h-2.5 w-2.5 text-gray-900 dark:text-white"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 18 2"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M1 1h16"
                                />
                              </svg>
                            </button>
                            <input
                              type="text"
                              id="counter-input"
                              data-input-counter
                              className="w-10 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none focus:ring-0 dark:text-white"
                              placeholder=""
                              value={product.quantity}
                              onChange={(e) =>
                                handleQuantityChange(
                                  product.product._id,
                                  e.target.value
                                )
                              }
                              required
                            />
                            <button
                              type="button"
                              onClick={() =>
                                handleQuantityChange(
                                  product.product._id,
                                  product.quantity + 1
                                )
                              }
                              id="increment-button"
                              disabled={product.quantity === product.product.productStockQty}
                              data-input-counter-increment="counter-input"
                              className="disabled:cursor-not-allowed cursor-pointer inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                            >
                              <svg
                                className="h-2.5 w-2.5 text-gray-900 dark:text-white"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 18 18"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M9 1v16M1 9h16"
                                />
                              </svg>
                            </button>
                          </div>
                          <div className="text-end md:order-4 md:w-32">
                            <p className="text-base font-bold text-gray-900 dark:text-white">
                              NPR {product.product.productPrice}
                            </p>
                          </div>
                        </div>

                        <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
                          <p className="text-2xl font-medium text-gray-900 dark:text-white">
                            {product.product.productName}
                          </p>

                          <div className="flex items-center gap-4">
                            <button
                              onClick={() =>
                                handleFavoriteItem(product.product._id)
                              }
                              type="button"
                              className="cursor-pointer flex items-center py-2.5 px-5 text-sm mt-7 font-medium dark:text-white rounded-lg border dark:bg-yellow-600 dark:hover:bg-yellow-700"
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
                                  d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z"
                                />
                              </svg>
                              Add to Favorites
                            </button>

                            <button
                              onClick={() =>
                                handleDeleteItem(product.product._id)
                              }
                              type="button"
                              className="cursor-pointer flex items-center py-2.5 px-5 text-sm font-medium mt-7 rounded-lg border dark:text-red-600 dark:bg-yellow-600 dark:hover:bg-yellow-700"
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
            </div>

            <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
              <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  Order summary
                </p>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <dl className="flex items-center justify-between gap-4">
                      <dt className="font-medium dark:text-white">
                        Total Items
                      </dt>
                      <dd className="font-medium dark:text-white">
                        {totalItemsInCart}
                      </dd>
                    </dl>

                    <dl className="flex items-center justify-between gap-4">
                      <dt className="font-medium dark:text-white">
                        Shipping Amount
                      </dt>
                      <dd className="font-medium text-green-600">
                        NPR {shippingCost}
                      </dd>
                    </dl>

                    <dl className="flex items-center justify-between gap-4">
                      <dt className="font-medium dark:text-white">
                        Items Amount
                      </dt>
                      <dd className="font-medium dark:text-white">
                        NPR {totalPriceOfCart}
                      </dd>
                    </dl>
                  </div>

                  <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                    <dt className="text-xl font-bold text-gray-900 dark:text-white">
                      Total Amount
                    </dt>
                    <dd className="text-xl font-bold text-gray-900 dark:text-white">
                      NPR {totalAmount.toFixed(2)}
                    </dd>
                  </dl>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  type="button"
                  className="flex items-center justify-center w-50 rounded-lg px-5 py-2.5 text-sm ml-10 mt-8 font-medium dark:text-white border dark:bg-yellow-600 dark:hover:bg-yellow-700"
                >
                  Check Out
                </button>
              </div>

              <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
                <form className="space-y-4">
                  <div>
                    <label
                      htmlFor="voucher"
                      className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Do you have a voucher or gift card?
                    </label>
                    <input
                      type="text"
                      id="voucher"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                      placeholder=""
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="flex items-center justify-center rounded-lg px-5 py-2.5 text-sm w-50 ml-10 font-medium dark:text-white border dark:bg-yellow-600 dark:hover:bg-yellow-700"
                  >
                    Apply Code
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Cart;