import { Link, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  deleteItemFromCartAsync,
  selectItems,
  updateCartAsync,
} from '../features/cart/cartSlice';
import { useForm } from 'react-hook-form';
import { updateUserAsync, selectUserInfo } from '../features/user/userSlice';
import { useState } from 'react';
import {
  createOrderAsync,
  selectCurrentOrder,
  selectStatus,
} from '../features/order/orderSlice';
import { Grid } from 'react-loader-spinner';

function Checkout() {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const user = useSelector(selectUserInfo);
  const items = useSelector(selectItems);
  const status = useSelector(selectStatus);
  const currentOrder = useSelector(selectCurrentOrder);

  const totalAmount = items.reduce(
    (amount, item) => item.product.discountPrice * item.quantity + amount,
    0
  );

  const totalItems = items.reduce((total, item) => item.quantity + total, 0);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);

  const handleQuantityChange = (e, item) => {
    dispatch(updateCartAsync({ id: item.id, quantity: +e.target.value }));
  };

  const handleRemoveItem = (e, id) => {
    dispatch(deleteItemFromCartAsync(id));
  };

  const handleAddressSelection = (e) => {
    setSelectedAddress(user.addresses[e.target.value]);
  };

  const handlePaymentSelection = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleOrderSubmission = () => {
    if (selectedAddress && paymentMethod) {
      const order = {
        items: items.map((item) => ({
          productId: item.product.id, // Extract productId from the product object
          quantity: item.quantity,
          price: item.product.price,    
        })),
        totalAmount,                 // Total amount of the order
        totalItems,                  // Total number of items in the order
        user: user.id,               // User ID
        paymentMethod,               // Payment method
        selectedAddress,             // Selected address
        status: 'pending',           // Initial order status
      };
  
      dispatch(createOrderAsync(order)); // Dispatch the action to create the order
    } else {
      alert('Please select an address and payment method');
    }
  };
  

  return (
    <>
      {!items.length && <Navigate to="/" replace={true} />}
      {currentOrder && (
        <Navigate
          to={currentOrder.paymentMethod === 'cash' ? `/order-success/${currentOrder.id}` : '/stripe-checkout/'}
          replace={true}
        />
      )}

      {status === 'loading' ? (
        <Grid
          height="80"
          width="80"
          color="rgb(79, 70, 229)"
          ariaLabel="grid-loading"
          radius="12.5"
          visible={true}
        />
      ) : (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-5">
            <div className="lg:col-span-3">
              {/* Address Form */}
              <form
                className="bg-white px-5 py-12 mt-12"
                noValidate
                onSubmit={handleSubmit((data) => {
                  dispatch(updateUserAsync({
                    ...user,
                    addresses: [...user.addresses, data],
                  }));
                  reset();
                })}
              >
                <div className="space-y-12">
                  <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-2xl font-semibold leading-7 text-gray-900">Personal Information</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">Use a permanent address where you can receive mail.</p>

                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                      {['name', 'email', 'phone', 'street', 'city', 'state', 'pinCode'].map((field, index) => (
                        <div className={field === 'street' ? 'col-span-full' : 'sm:col-span-4'} key={field}>
                          <label htmlFor={field} className="block text-sm font-medium leading-6 text-gray-900">
                            {field.charAt(0).toUpperCase() + field.slice(1)}
                          </label>
                          <div className="mt-2">
                            <input
                              type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                              {...register(field, { required: `${field} is required` })}
                              id={field}
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                            {errors[field] && <p className="text-red-500">{errors[field].message}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button
                      type="button"
                      onClick={reset}
                      className="text-sm font-semibold leading-6 text-gray-900"
                    >
                      Reset
                    </button>
                    <button
                      type="submit"
                      className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Add Address
                    </button>
                  </div>
                </div>
              </form>

              {/* Address List */}
              <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">Addresses</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">Choose from Existing addresses</p>
                <ul>
                  {user?.addresses?.map((address, index) => (
                    <li key={index} className="flex justify-between gap-x-6 px-5 py-5 border-solid border-2 border-gray-200">
                      <div className="flex gap-x-4">
                        <input
                          onChange={handleAddressSelection}
                          name="address"
                          type="radio"
                          value={index}
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                        <div className="min-w-0 flex-auto">
                          <p className="text-sm font-semibold leading-6 text-gray-900">{address.name}</p>
                          <p className="mt-1 truncate text-xs leading-5 text-gray-500">{address.street}</p>
                          <p className="mt-1 truncate text-xs leading-5 text-gray-500">{address.pinCode}</p>
                        </div>
                      </div>
                      <div className="hidden sm:flex sm:flex-col sm:items-end">
                        <p className="text-sm leading-6 text-gray-900">Phone: {address.phone}</p>
                        <p className="text-sm leading-6 text-gray-500">{address.city}</p>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Payment Methods */}
                <div className="mt-10 space-y-10">
                  <fieldset>
                    <legend className="text-sm font-semibold leading-6 text-gray-900">Payment Methods</legend>
                    <p className="mt-1 text-sm leading-6 text-gray-600">Choose One</p>
                    <div className="mt-6 space-y-6">
                      {['cash', 'card'].map(method => (
                        <div className="flex items-center gap-x-3" key={method}>
                          <input
                            id={method}
                            name="payments"
                            onChange={handlePaymentSelection}
                            value={method}
                            type="radio"
                            checked={paymentMethod === method}
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          />
                          <label htmlFor={method} className="block text-sm font-medium leading-6 text-gray-900">
                            {method.charAt(0).toUpperCase() + method.slice(1)} Payment
                          </label>
                        </div>
                      ))}
                    </div>
                  </fieldset>
                </div>
              </div>
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-2">
              <div className="mx-auto mt-12 bg-white max-w-7xl px-2 sm:px-2 lg:px-4">
                <div className="border-t border-gray-200 px-0 py-6 sm:px-0">
                  <h1 className="text-4xl my-5 font-bold tracking-tight text-gray-900">Cart</h1>
                  <div className="flow-root">
                    <ul role="list" className="-my-6 divide-y divide-gray-200">
                      {items?.map((item) => (
                        <li key={item.id} className="flex py-5 justify-between gap-x-6">
                          <div className="flex gap-x-4">
                            <img src={item.product.images[0]} alt={item.product.name} className="h-20 w-20 rounded-md object-cover" />
                            <div className="min-w-0 flex-auto">
                              <p className="text-sm font-semibold leading-6 text-gray-900">{item.product.name}</p>
                              <p className="mt-1 truncate text-xs leading-5 text-gray-500">Price: {item.product.discountPrice} INR</p>
                              <div className="mt-1">
                                <input
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(e) => handleQuantityChange(e, item)}
                                  className="w-16 border rounded-md p-1"
                                />
                                <button onClick={(e) => handleRemoveItem(e, item.id)} className="text-red-500 ml-2">Remove</button>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-between mt-5 text-sm font-semibold leading-6 text-gray-900">
                    <p>Total Items: {totalItems}</p>
                    <p>Total Amount: {totalAmount} INR</p>
                  </div>
                  <button
                    onClick={handleOrderSubmission}
                    className="mt-5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Submit Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Checkout;
