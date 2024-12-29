import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchLoggedInUserOrdersAsync,
  selectUserOrders,
  selectUserInfoStatus,
} from "../userSlice";
import { Grid } from "react-loader-spinner";
import { Link } from "react-router-dom";

export default function UserOrders() {
  const dispatch = useDispatch();
  const orders = useSelector(selectUserOrders);
  const status = useSelector(selectUserInfoStatus);
  
  useEffect(() => {
    dispatch(fetchLoggedInUserOrdersAsync());
  }, [dispatch]);

  const orderList = Array.isArray(orders) ? orders : [];

  return (
    <div className="max-w-7xl mx-auto p-4">
      {status === "loading" && (
        <div className="flex justify-center py-20">
          <Grid
            height="80"
            width="80"
            color="rgb(79, 70, 229)"
            ariaLabel="grid-loading"
            radius="12.5"
            visible={true}
          />
        </div>
      )}

      {orderList.length > 0 ? (
        orderList.map((order) => (
          <div
            key={order.id}
            className="mx-auto my-10 bg-white shadow-md rounded-lg overflow-hidden border border-gray-200"
          >
            <div className="border-b border-gray-200 px-6 py-4">
              <h1 className="text-3xl font-bold text-gray-900">
                Order # {order.id}
              </h1>
              <h3 className="text-lg font-semibold text-red-600 mt-2">
                Order Status: {order.status}
              </h3>
            </div>
            <div className="px-6 py-4">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">Items:</h4>
              <ul className="divide-y divide-gray-200">
                {order.items.map((item) => (
                  <li key={item._id} className="flex py-4">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={item.productId.thumbnail}
                        alt={item.productId.title}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-lg font-medium text-gray-900">
                          <h3>
                            <Link to={`/product-detail/${item.productId.id}`} className="hover:text-blue-600">
                              {item.productId.title}
                            </Link>
                          </h3>
                          <p className="ml-4 text-lg font-semibold">${item.productId.discountPrice}</p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">{item.productId.brand}</p>
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm mt-2">
                        <div className="text-gray-500">
                          <span className="font-medium">Qty: {item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-gray-200 px-6 py-4">
              <div className="flex justify-between my-2 text-lg font-medium text-gray-900">
                <p>Subtotal</p>
                <p>${order.totalAmount}</p>
              </div>
              <div className="flex justify-between my-2 text-lg font-medium text-gray-900">
                <p>Total items, That you have ordered</p>
                <p>{order.totalItems} items</p>
              </div>
              <p className="mt-0.5 text-sm text-gray-500">Shipping Address:</p>
              <div className="flex justify-between gap-x-6 px-5 py-5 border-solid border-2 border-gray-200 rounded-lg">
                <div className="flex gap-x-4 flex-1">
                  <div className="min-w-0 flex-auto">
                    <p className="text-sm font-semibold leading-6 text-gray-900">
                      {order.selectedAddress.name || "N/A"}
                    </p>
                    <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                      {order.selectedAddress.street || "N/A"}
                    </p>
                    <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                      {order.selectedAddress.pinCode || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="hidden sm:flex sm:flex-col sm:items-end">
                  <p className="text-sm leading-6 text-gray-900">
                    Phone: {order.selectedAddress.phone || "N/A"}
                  </p>
                  <p className="text-sm leading-6 text-gray-500">
                    {order.selectedAddress.city || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        status !== "loading" && <p className="text-center mt-10 text-gray-500">No orders found.</p>
      )}
    </div>
  );
}
