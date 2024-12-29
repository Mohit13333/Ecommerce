import { useState, useEffect } from 'react';
import { StarIcon } from '@heroicons/react/20/solid';
import { RadioGroup } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProductByIdAction,
  selectProductById,
  selectProductListStatus,
} from '../productSlice';
import { useParams } from 'react-router-dom';
import { addToCartAsync, selectItems } from '../../cart/cartSlice';
import { Grid } from 'react-loader-spinner';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function ProductDetail() {
  const [selectedColor, setSelectedColor] = useState();
  const [selectedSize, setSelectedSize] = useState();
  const items = useSelector(selectItems);
  const product = useSelector(selectProductById);
  const dispatch = useDispatch();
  const params = useParams();
  const status = useSelector(selectProductListStatus);

  // Fetch product data by ID
  useEffect(() => {
    console.log(`Fetching product with ID: ${params.id}`);
    dispatch(fetchProductByIdAction(params.id));
  }, [dispatch, params.id]);

  // Debugging: Check if product is being fetched
  useEffect(() => {
    console.log('Fetched product:', product);
  }, [product]);

  const handleCart = (e) => {
    e.preventDefault();
    if (items.findIndex((item) => item.product.id === product.id) < 0) {
      const newItem = {
        product: product.id,
        quantity: 1,
      };
      if (selectedColor) {
        newItem.color = selectedColor;
      }
      if (selectedSize) {
        newItem.size = selectedSize;
      }
      dispatch(addToCartAsync(newItem));
    } else {
      alert('Item already added to the cart.');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {status === 'loading' ? (
        <Grid
          height="80"
          width="80"
          color="rgb(55, 65, 81)"
          ariaLabel="grid-loading"
          radius="12.5"
          visible={true}
        />
      ) : null}
      {product && Object.keys(product).length > 0 ? (
        <div className="py-8">
          <nav aria-label="Breadcrumb" className="bg-white p-4 shadow">
            <ol className="flex items-center space-x-4">
              {product.breadcrumbs &&
                product.breadcrumbs.map((breadcrumb) => (
                  <li key={breadcrumb.id} className="text-sm">
                    <a
                      href={breadcrumb.href}
                      className="text-gray-700 hover:text-gray-900"
                    >
                      {breadcrumb.name}
                    </a>
                    <span className="mx-2 text-gray-400">/</span>
                  </li>
                ))}
              <li className="text-gray-500">{product.title}</li>
            </ol>
          </nav>

          <div className="container mx-auto mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Image Gallery */}
              <div className="flex overflow-x-auto p-2 space-x-4 scrollbar-hidden">
                {product.images.map((image, index) => (
                  <div
                    key={index}
                    className="flex-none w-64 h-64 shadow-lg rounded-lg overflow-hidden"
                  >
                    <img
                      src={image}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Product Details */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-semibold text-gray-900">
                  {product.title}
                </h1>
                <p className="mt-2 text-gray-500">{product.description}</p>
                <p className="mt-4 text-2xl text-gray-900">${product.discountPrice}</p>
                <p className="text-gray-400 line-through">${product.price}</p>

                {/* Reviews */}
                <div className="mt-4 flex items-center space-x-2">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={classNames(
                        product.rating > rating ? 'text-yellow-500' : 'text-gray-300',
                        'h-5 w-5'
                      )}
                      aria-hidden="true"
                    />
                  ))}
                  <span className="text-gray-500">{product.rating} out of 5</span>
                </div>

                {/* Options */}
                <form className="mt-6" onSubmit={handleCart}>
                  {/* Colors */}
                  {product.colors && product.colors.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-700">Color</h3>
                      <RadioGroup
                        value={selectedColor}
                        onChange={setSelectedColor}
                        className="mt-2 flex space-x-4"
                      >
                        {product.colors.map((color) => (
                          <RadioGroup.Option
                            key={color.id}
                            value={color}
                            className={({ checked }) =>
                              classNames(
                                checked ? 'ring-2 ring-indigo-500' : 'border border-gray-300',
                                'flex items-center justify-center w-8 h-8 rounded-full cursor-pointer focus:outline-none'
                              )
                            }
                          >
                            <span
                              aria-hidden="true"
                              className={classNames(
                                color.class, // Ensure this class correctly applies the color
                                'w-8 h-8 rounded-full'
                              )}
                            />
                          </RadioGroup.Option>
                        ))}
                      </RadioGroup>
                    </div>
                  )}

                  {/* Sizes */}
                  {product.sizes && product.sizes.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Size</h3>
                      <RadioGroup
                        value={selectedSize}
                        onChange={setSelectedSize}
                        className="mt-2 grid grid-cols-3 gap-3"
                      >
                        {product.sizes.map((size) => (
                          <RadioGroup.Option
                            key={size.id}
                            value={size}
                            className={({ checked }) =>
                              classNames(
                                checked
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-white text-gray-900',
                                'py-2 px-4 rounded-md border text-center shadow-sm cursor-pointer focus:outline-none'
                              )
                            }
                          >
                            <span>{size.name}</span>
                          </RadioGroup.Option>
                        ))}
                      </RadioGroup>
                    </div>
                  )}

                  {/* Add to Cart Button */}
                  <button
                    type="submit"
                    className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-md shadow-md hover:bg-indigo-700"
                  >
                    Add to cart
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-8">No product found.</div>
      )}
    </div>
  );
}
