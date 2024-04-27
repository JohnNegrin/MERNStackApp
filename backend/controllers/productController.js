import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  // Get paraeters from url
  const pageSize = process.env.PAGINATION_LIMIT;
  const page = Number(req.query.pageNumber) || 1;
  const minPrice = req.query.minPrice
    ? { name: { $regex: req.query.minPrice, $options: "i" } }
    : {};
  const maxPrice = req.query.maxPrice
    ? { name: { $regex: req.query.maxPrice, $options: "i" } }
    : {};
  const category = req.query.category
    ? { name: { $regex: req.query.category, $options: "i" } }
    : {};
  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: "i" } }
    : {};

  // find products based on keyword search
  let count = await Product.countDocuments({ ...keyword });
  let products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  // find products based on catefory filter
  if (category?.name?.$regex) {
    products = await Product.find({
      ...keyword,
      category: category.name?.$regex,
    });

    // find products based on both categroy and price filter
    if (minPrice.name?.$regex) {
      products = await priceFilter(
        Number(minPrice.name?.$regex),
        Number(maxPrice.name?.$regex),
        products
      );
    }

    count = products.length;

    // Get number of products based on pagination limit
    const upperLimit = Number(pageSize * (page - 1) + pageSize);
    products = products.slice(pageSize * (page - 1), upperLimit);
  } else if (minPrice.name?.$regex) {
    // Find products based only on price filter
    products = await Product.find({});

    products = await priceFilter(
      Number(minPrice.name?.$regex),
      Number(maxPrice.name?.$regex),
      products
    );

    count = products.length;

    // Get number of products based on pagination limit
    const upperLimit = Number(pageSize * (page - 1) + pageSize);
    products = products.slice(pageSize * (page - 1), upperLimit);
  }

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

async function priceFilter(minPrice, maxPrice, products) {
  products = products.filter(function (product) {
    if (product.price >= minPrice && product.price <= maxPrice) {
      return true;
    }
    return false;
  });

  return products;
}

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    return res.json(product);
  }
  res.status(404);
  throw new Error("Resource not found");
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: "Sample name",
    price: 0,
    user: req.user._id,
    image: "/images/sample.jpg",
    brand: "Sample brand",
    category: "Sample category",
    countInStock: 0,
    numReviews: 0,
    description: "Sample description",
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});
// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed");
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);

  res.json(products);
});

const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
  getAllProducts,
};
