const Product = require("../models/Product");
const { NotFoundError, BadRequestError } = require("../errors");
const path = require("path");
const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  const product = await Product.create(req.body);

  res.status(201).json({ product });
};

const getAllProducts = async (req, res) => {
  const products = await Product.find({});
  res.status(200).json({ products, count: products.length });
};

const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId }).populate('reviews');

  if (!product) {
    throw new NotFoundError(`Product with this id ${productId} does not exist`);
  }

  res.status(200).json({ product });
};

const updateProduct = async (req, res) => {
  const { id: productId } = req.params;

  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    throw new NotFoundError(`Product with this id ${productId} does not exist`);
  }
};

const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;

  const product = Product.findOne({ _id: productId });
  if (!product) {
    throw new NotFoundError(`Product with this id ${productId} does not exist`);
  }
  await product.remove();
  res.status(200).json({ msg: "Product successfully removed" });
};

const uploadImage = async (req, res) => {
  if (!req.files) {
    throw new BadRequestError("No file uploaded");
  }

  const productImage = req.files.image;

  if (productImage.mimeType.startsWith("image")) {
    throw new BadRequestError("Please upload image");
  }
  const maxSize = 1024 * 1024;
  if (productImage.size > maxSize) {
    throw new BadRequestError("Please upload image smaller than 1MB ");
  }
  const imagePath = path.join(
    __dirname,
    "../public/uploads" + `${productImage.name}`
  );

  await productImage.mv(imagePath);
  res.status(200).json({ image: `/uploads/${productImage.name}` });
};

module.exports = {
  createProduct,
  getSingleProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  uploadImage,
};
