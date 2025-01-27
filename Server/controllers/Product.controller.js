import uploadOnCloudinary from '../config/cloudinary.js';
import { Product } from '../model/Product.js';

export const createProduct = async (req, res) => {
  // Check if thumbnail and images are provided
  if (!req.files || !req.files.thumbnail || req.files.thumbnail.length === 0 || !req.files.images || req.files.images.length === 0) {
    return res.status(400).json({ message: "Thumbnail and images are required." });
  }

  // Check for required fields in the request body
  const { title, category, brand, price, discountPercentage } = req.body;
  if (!title || !category || !brand || price === undefined) {
    return res.status(400).json({ message: "Title, category, brand, and price are required." });
  }

  try {
    const thumbnailFile = req.files.thumbnail[0];
    const thumbnailResponse = await uploadOnCloudinary(thumbnailFile.path);

    // Upload images
    const imageResponses = await Promise.all(
      req.files.images.map(async (image) => {
        const response = await uploadOnCloudinary(image.path);
        return response.url; // Return only the URL
      })
    );

    // Calculate discount price, ensure valid input
    const discountPrice = price && discountPercentage ? Math.round(price * (1 - discountPercentage / 100)) : null;

    // Create product object
    const product = {
      title,
      description: req.body.description,
      price,
      discountPrice,
      category,
      brand,
      thumbnail: thumbnailResponse.url,
      images: imageResponses,
    };

    const productData = new Product(product);
    const doc = await productData.save();
    res.status(201).json(doc);
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};



export const fetchAllProducts = async (req, res) => {
  let condition = {};
  if (!req.query.admin) {
    condition.deleted = { $ne: true };
  }

  let query = Product.find(condition);
  let totalProductsQuery = Product.find(condition);

  if (req.query.category) {
    query = query.find({ category: { $in: req.query.category.split(',') } });
    totalProductsQuery = totalProductsQuery.find({ category: { $in: req.query.category.split(',') } });
  }
  if (req.query.brand) {
    query = query.find({ brand: { $in: req.query.brand.split(',') } });
    totalProductsQuery = totalProductsQuery.find({ brand: { $in: req.query.brand.split(',') } });
  }
  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
  }

  const totalDocs = await totalProductsQuery.countDocuments().exec();

  if (req.query._page && req.query._limit) {
    const pageSize = Number(req.query._limit);
    const page = Number(req.query._page);
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  try {
    const docs = await query.exec();
    res.set('X-Total-Count', totalDocs);
    res.status(200).json(docs);
  } catch (err) {
    res.status(400).json(err);
  }
};

export const fetchProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
    product.discountPrice = Math.round(product.price * (1 - product.discountPercentage / 100));
    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(400).json(err);
  }
};
