import { useDispatch, useSelector } from "react-redux";
import {
  clearSelectedProduct,
  createProductAction,
  fetchProductByIdAction,
  selectBrands,
  selectCategories,
  selectProductById,
  updateProductAction,
} from "../../product/productSlice";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Modal from "../../common/Modal";

function ProductForm() {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();
  const brands = useSelector(selectBrands);
  const categories = useSelector(selectCategories);
  const dispatch = useDispatch();
  const params = useParams();
  const selectedProduct = useSelector(selectProductById);
  const [openModal, setOpenModal] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  const colors = [
    {
      name: "White",
      class: "bg-white",
      selectedClass: "ring-gray-400",
      id: "white",
    },
    {
      name: "Gray",
      class: "bg-gray-200",
      selectedClass: "ring-gray-400",
      id: "gray",
    },
    {
      name: "Black",
      class: "bg-gray-900",
      selectedClass: "ring-gray-900",
      id: "black",
    },
    {
      name: "Red",
      class: "bg-red-600",
      selectedClass: "ring-red-700",
      id: "red",
    },
    {
      name: "Blue",
      class: "bg-blue-600",
      selectedClass: "ring-blue-700",
      id: "blue",
    },
    {
      name: "Green",
      class: "bg-green-600",
      selectedClass: "ring-green-700",
      id: "green",
    },
    {
      name: "Yellow",
      class: "bg-yellow-400",
      selectedClass: "ring-yellow-500",
      id: "yellow",
    },
    {
      name: "Purple",
      class: "bg-purple-600",
      selectedClass: "ring-purple-700",
      id: "purple",
    },
    {
      name: "Teal",
      class: "bg-teal-600",
      selectedClass: "ring-teal-700",
      id: "teal",
    },
    {
      name: "Pink",
      class: "bg-pink-600",
      selectedClass: "ring-pink-700",
      id: "pink",
    },
  ];

  const sizes = [
    { name: "XXS", inStock: true, id: "xxs" },
    { name: "XS", inStock: true, id: "xs" },
    { name: "S", inStock: true, id: "s" },
    { name: "M", inStock: true, id: "m" },
    { name: "L", inStock: true, id: "l" },
    { name: "XL", inStock: true, id: "xl" },
    { name: "2XL", inStock: true, id: "2xl" },
    { name: "3XL", inStock: true, id: "3xl" },
  ];

  useEffect(() => {
    if (params.id) {
      dispatch(fetchProductByIdAction(params.id));
    } else {
      dispatch(clearSelectedProduct());
    }
  }, [params.id, dispatch]);

  useEffect(() => {
    if (selectedProduct && params.id) {
      setValue("title", selectedProduct.title);
      setValue("description", selectedProduct.description);
      setValue("price", selectedProduct.price);
      setValue("discountPercentage", selectedProduct.discountPercentage);
      setValue("stock", selectedProduct.stock);
      setValue("highlight1", selectedProduct.highlights[0]);
      setValue("highlight2", selectedProduct.highlights[1]);
      setValue("highlight3", selectedProduct.highlights[2]);
      setValue("highlight4", selectedProduct.highlights[3]);
      setValue(
        "sizes",
        selectedProduct.sizes.map((size) => size.id)
      );
      setValue(
        "colors",
        selectedProduct.colors.map((color) => color.id)
      );
      setImages(selectedProduct.images);
      setThumbnail(selectedProduct.thumbnail);
      setValue(
        "brands",
        selectedProduct.brands.map((brand) => brand.id)
      );
      setValue(
        "categories",
        selectedProduct.categories.map((category) => category.id)
      );
    }
  }, [selectedProduct, params.id, setValue]);

  const handleDelete = () => {
    const product = { ...selectedProduct };
    product.deleted = true;
    dispatch(updateProductAction(product));
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files;
    if (file) {
      const newImages = [...images];
      newImages[index] = file;
      setImages(newImages);
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
    }
  };

  return (
    <>
      <form
        noValidate
        onSubmit={handleSubmit((data) => {
          const product = { ...data };
          product.images = images;
          product.thumbnail = thumbnail;
          product.highlights = [
            product.highlight1,
            product.highlight2,
            product.highlight3,
            product.highlight4,
          ];
          product.rating = 0;
          if (product.colors) {
            product.colors = product.colors.map((color) =>
              colors.find((clr) => clr.id === color)
            );
          }
          if (product.sizes) {
            product.sizes = product.sizes.map((size) =>
              sizes.find((sz) => sz.id === size)
            );
          }
          if (product.brands) {
            product.brands = product.brands.map((brandId) =>
              brands.find((brand) => brand.id === brandId)
            );
          }
          if (product.categories) {
            product.categories = product.categories.map((categoryId) =>
              categories.find((category) => category.id === categoryId)
            );
          }

          product.price = +product.price;
          product.stock = +product.stock;
          product.discountPercentage = +product.discountPercentage;

          if (params.id) {
            product.id = params.id;
            product.rating = selectedProduct.rating || 0;
            dispatch(updateProductAction(product));
            reset();
          } else {
            dispatch(createProductAction(product));
            reset();
          }
        })}
      >
        <div className="space-y-12 bg-gray-50 p-12 rounded-lg shadow-md">
          <div className="border-b border-gray-300 pb-12">
            <h2 className="text-lg font-bold leading-7 text-gray-800">
              Add Product
            </h2>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              {selectedProduct && selectedProduct.deleted && (
                <h2 className="text-red-600 sm:col-span-6 font-semibold">
                  This product is deleted
                </h2>
              )}

              <div className="sm:col-span-6">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium leading-6 text-gray-800"
                >
                  Product Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    {...register("title", { required: "Name is required" })}
                    id="title"
                    className="block flex-1 border-0 bg-transparent py-2 pl-3 pr-3 text-gray-800 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Enter product name"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium leading-6 text-gray-800"
                >
                  Description
                </label>
                <div className="mt-2">
                  <textarea
                    id="description"
                    {...register("description", {
                      required: "Description is required",
                    })}
                    rows={3}
                    className="block w-full rounded-md border-0 py-2 px-3 text-gray-800 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Write a few sentences about the product."
                  />
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-500">
                  Write a few sentences about the product.
                </p>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="brands"
                  className="block text-sm font-medium leading-6 text-gray-800"
                >
                  Brands
                </label>
                <div className="mt-2 flex flex-col gap-2">
                  {brands?.map((brand) => (
                    <label key={brand.id} className="flex items-center">
                      <input
                        type="checkbox"
                        {...register("brands")}
                        value={brand.id}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      <span className="ml-2 text-gray-700">{brand.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="categories"
                  className="block text-sm font-medium leading-6 text-gray-800"
                >
                  Categories
                </label>
                <div className="mt-2 flex flex-col gap-2">
                  {categories?.map((category) => (
                    <label key={category.id} className="flex items-center">
                      <input
                        type="checkbox"
                        {...register("categories")}
                        value={category.id}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      <span className="ml-2 text-gray-700">
                        {category.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="colors"
                  className="block text-sm font-medium leading-6 text-gray-800"
                >
                  Colors
                </label>
                <div className="mt-2 flex flex-col gap-2">
                  {colors?.map((color) => (
                    <label key={color.id} className="flex items-center">
                      <input
                        type="checkbox"
                        {...register("colors")}
                        value={color.id}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      <span
                        className={`ml-2 rounded-full h-4 w-4 ${color.class} ring-1 ${color.selectedClass} ring-opacity-50`}
                      ></span>
                      <span className="ml-2 text-gray-700">{color.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="sizes"
                  className="block text-sm font-medium leading-6 text-gray-800"
                >
                  Sizes
                </label>
                <div className="mt-2 flex flex-col gap-2">
                  {sizes?.map((size) => (
                    <label key={size.id} className="flex items-center">
                      <input
                        type="checkbox"
                        {...register("sizes")}
                        value={size.id}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      <span className="ml-2 text-gray-700">{size.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium leading-6 text-gray-800"
                >
                  Price
                </label>
                <div className="mt-2">
                  <input
                    type="number"
                    {...register("price", {
                      required: "Price is required",
                      min: 0,
                    })}
                    id="price"
                    className="block w-full border-0 bg-transparent py-2 pl-3 pr-3 text-gray-800 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Enter product price"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="thumbnail"
                  className="block text-sm font-medium leading-6 text-gray-800"
                >
                  Thumbnail
                </label>
                <div className="mt-2">
                  <input
                    type="file"
                    {...register("thumbnail")}
                    id="thumbnail"
                    className="block w-full border-0 bg-transparent py-2 pl-3 pr-3 text-gray-800 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="images"
                  className="block text-sm font-medium leading-6 text-gray-800"
                >
                  Image
                </label>
                <div className="mt-2">
                  <input
                    type="file"
                    {...register("images")}
                    multiple
                    id="images"
                    className="block w-full border-0 bg-transparent py-2 pl-3 pr-3 text-gray-800 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="discountPercentage"
                  className="block text-sm font-medium leading-6 text-gray-800"
                >
                  Discount Percentage
                </label>
                <div className="mt-2">
                  <input
                    type="number"
                    {...register("discountPercentage")}
                    id="discountPercentage"
                    className="block w-full border-0 bg-transparent py-2 pl-3 pr-3 text-gray-800 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Enter discount percentage"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="stock"
                  className="block text-sm font-medium leading-6 text-gray-800"
                >
                  Stock
                </label>
                <div className="mt-2">
                  <input
                    type="number"
                    {...register("stock", {
                      required: "Stock is required",
                      min: 0,
                    })}
                    id="stock"
                    className="block w-full border-0 bg-transparent py-2 pl-3 pr-3 text-gray-800 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Enter available stock"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="highlight1"
                  className="block text-sm font-medium leading-6 text-gray-800"
                >
                  Highlight 1
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    {...register("highlight1")}
                    id="highlight1"
                    className="block w-full border-0 bg-transparent py-2 pl-3 pr-3 text-gray-800 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Highlight 1"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="highlight2"
                  className="block text-sm font-medium leading-6 text-gray-800"
                >
                  Highlight 2
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    {...register("highlight2")}
                    id="highlight2"
                    className="block w-full border-0 bg-transparent py-2 pl-3 pr-3 text-gray-800 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Highlight 2"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="highlight3"
                  className="block text-sm font-medium leading-6 text-gray-800"
                >
                  Highlight 3
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    {...register("highlight3")}
                    id="highlight3"
                    className="block w-full border-0 bg-transparent py-2 pl-3 pr-3 text-gray-800 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Highlight 3"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="highlight4"
                  className="block text-sm font-medium leading-6 text-gray-800"
                >
                  Highlight 4
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    {...register("highlight4")}
                    id="highlight4"
                    className="block w-full border-0 bg-transparent py-2 pl-3 pr-3 text-gray-800 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Highlight 4"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            {params.id && (
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-red-600 bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700"
                onClick={() => setOpenModal(true)}
              >
                Delete Product
              </button>
            )}
            <div>
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
              >
                {params.id ? "Update Product" : "Create Product"}
              </button>
            </div>
          </div>
        </div>
      </form>

      {openModal && (
        <Modal
          title="Confirm Delete"
          onClose={() => setOpenModal(null)}
          onConfirm={handleDelete}
        >
          Are you sure you want to delete this product?
        </Modal>
      )}
    </>
  );
}

export default ProductForm;
