import { useEffect, useState } from "react";
import { ITEMS_PER_PAGE } from "../../../app/constants";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllOrdersAsync,
  selectOrders,
  selectTotalOrders,
  updateOrderAsync,
} from "../../order/orderSlice";
import {
  PencilIcon,
  EyeIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/outline";
import Pagination from "../../common/Pagination";

function AdminOrders() {
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const totalOrders = useSelector(selectTotalOrders);
  const [editableOrderId, setEditableOrderId] = useState(-1);
  const [sort, setSort] = useState({});

  const handleEdit = (order) => {
    setEditableOrderId(order.id);
  };

  const handleShow = () => {
    console.log("handleShow");
  };

  const handleOrderStatus = (e, order) => {
    const updatedOrder = { ...order, status: e.target.value };
    dispatch(updateOrderAsync(updatedOrder));
    setEditableOrderId(-1);
  };

  const handleOrderPaymentStatus = (e, order) => {
    const updatedOrder = { ...order, paymentStatus: e.target.value };
    dispatch(updateOrderAsync(updatedOrder));
    setEditableOrderId(-1);
  };

  const handleSort = (sortOption) => {
    const newSort = { _sort: sortOption.sort, _order: sortOption.order };
    setSort(newSort);
  };

  const chooseColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-purple-200 text-purple-600";
      case "shipped":
        return "bg-yellow-200 text-yellow-600";
      case "delivered":
        return "bg-green-200 text-green-600";
      case "received":
        return "bg-green-200 text-green-600";
      case "refunded":
        return "bg-green-200 text-green-600";
      case "canceled":
        return "bg-red-200 text-red-600";
      case "failed":
        return "bg-red-200 text-red-600";
      default:
        return "bg-purple-200 text-purple-600";
    }
  };

  useEffect(() => {
    const pagination = { _page: page, _limit: ITEMS_PER_PAGE };
    dispatch(fetchAllOrdersAsync({ sort, pagination }));
  }, [dispatch, page, sort]);

  return (
    <div className="flex flex-col items-center">
      <div className="bg-gray-100 w-full p-4">
        <div className="flex justify-between mb-4">
          <h1 className="text-xl font-bold">Orders</h1>
          <div className="flex space-x-2 mb-4">
            <button
              onClick={() =>
                handleSort({
                  sort: "id",
                  order: sort?._order === "asc" ? "desc" : "asc",
                })
              }
              className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
                sort._sort === "id"
                  ? sort._order === "asc"
                    ? "bg-blue-500 text-white"
                    : "bg-blue-400 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Sort by Order ID
              {sort._sort === "id" &&
                (sort._order === "asc" ? (
                  <ArrowDownIcon className="inline w-4 h-4 ml-2" />
                ) : (
                  <ArrowUpIcon className="inline w-4 h-4 ml-2" />
                ))}
            </button>

            <button
              onClick={() =>
                handleSort({
                  sort: "createdAt",
                  order: sort?._order === "asc" ? "desc" : "asc",
                })
              }
              className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
                sort._sort === "createdAt"
                  ? sort._order === "asc"
                    ? "bg-blue-500 text-white"
                    : "bg-blue-400 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Sort by Order Time
              {sort._sort === "createdAt" &&
                (sort._order === "asc" ? (
                  <ArrowDownIcon className="inline w-4 h-4 ml-2" />
                ) : (
                  <ArrowUpIcon className="inline w-4 h-4 ml-2" />
                ))}
            </button>

            <button
              onClick={() =>
                handleSort({
                  sort: "totalAmount",
                  order: sort?._order === "asc" ? "desc" : "asc",
                })
              }
              className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
                sort._sort === "totalAmount"
                  ? sort._order === "asc"
                    ? "bg-blue-500 text-white"
                    : "bg-blue-400 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Sort by Total Amount
              {sort._sort === "totalAmount" &&
                (sort._order === "asc" ? (
                  <ArrowDownIcon className="inline w-4 h-4 ml-2" />
                ) : (
                  <ArrowUpIcon className="inline w-4 h-4 ml-2" />
                ))}
            </button>
          </div>
        </div>
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white shadow-lg rounded-lg p-4 mb-4 w-full max-w-md"
          >
            <h2 className="text-xl font-bold">Order ID: {order.id}</h2>
            <div className="flex flex-col">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center my-2">
                  {item.productId?.thumbnail ? (
                    <img
                      className="w-16 h-16 rounded-md"
                      src={item.productId.thumbnail}
                      alt={item.productId.title}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-md bg-gray-200"></div>
                  )}
                  <span className="ml-2">
                    {item.productId
                      ? `${item.productId.title} - Qty: ${item.quantity} - ₹${item.productId.discountPrice}`
                      : "Product not available"}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-2">
              <h3 className="font-bold">Shipping Address:</h3>
              <p>
                {order.selectedAddress.name}, {order.selectedAddress.street},{" "}
                {order.selectedAddress.city}, {order.selectedAddress.state},{" "}
                {order.selectedAddress.pinCode}, {order.selectedAddress.phone}
              </p>
            </div>
            <div className="flex justify-between mt-4">
              <div>
                {order.id === editableOrderId ? (
                  <select
                    onChange={(e) => handleOrderStatus(e, order)}
                    value={order.status}
                  >
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="canceled">Canceled</option>
                    <option value="failed">Failed</option>
                  </select>
                ) : (
                  <span
                    className={`py-1 px-2 rounded-full text-xs ${chooseColor(
                      order.status
                    )}`}
                  >
                    Order Status: {order.status}
                  </span>
                )}
              </div>
              <div>
                {order.id === editableOrderId ? (
                  <select
                    onChange={(e) => handleOrderPaymentStatus(e, order)}
                    value={order.paymentStatus}
                  >
                    <option value="pending">Pending</option>
                    <option value="received">Paid</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                ) : (
                  <span
                    className={`py-1 px-2 rounded-full text-xs ${chooseColor(
                      order.paymentStatus
                    )}`}
                  >
                    Payment Status: {order.paymentStatus}
                  </span>
                )}
              </div>
            </div>
            <div className="flex justify-between mt-4">
              <div>
                <h4 className="font-bold">
                  Total Amount: ₹{order.totalAmount}
                </h4>
              </div>
              <div className="flex">
                <button
                  onClick={() => handleEdit(order)}
                  className="p-2 rounded-lg bg-blue-500 text-white"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={handleShow}
                  className="p-2 rounded-lg bg-green-500 text-white ml-2"
                >
                  <EyeIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="text-xs mt-2">
              <p>Order Time: {new Date(order.createdAt).toLocaleString()}</p>
              <p>Last Updated: {new Date(order.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
      <Pagination
        page={page}
        setPage={setPage}
        handlePage={setPage}
        totalItems={totalOrders}
      />
    </div>
  );
}

export default AdminOrders;
