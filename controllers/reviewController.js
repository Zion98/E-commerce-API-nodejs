const Review = require("../models/Review");
const Product = require("../models/Product");

const { checkPermissions } = require("../utils");
const { NotFoundError, BadRequestError } = require("../errors");

const createReview = async (req, res) => {
  const { product: productId } = req.body;

  const isValidProduct = await Product.findOne({ _id: productId });

  if (!isValidProduct) {
    throw new NotFoundError(`Product with the id: ${productId}`);
  }

  const alreadySubmittted = await Review.findOne({
    product: productId,
    user: req.user.userId,
  });

  if (alreadySubmittted) {
    throw BadRequestError("Already submitted review for this product");
  }
  req.body.user = req.user.userId;
  const review = await Review.create(req.body);
  res.status(201).json({ review });
};
const getAllReview = async (req, res) => {
  const review = await Review.find({}).populate({
    path: "product",
    select: "name company price",
  });
  // .populate({
  //   path: "user",
  //   select: "name",
  // });
  res.status(200).json({ review });
};

const getSingleReview = async (req, res) => {
  const review = await Review.findOne({ _id: req.params.id });
  if (!review) {
    throw new NotFoundError(`No review with id ${req.params.id}`);
  }
  res.status(200).json({ review });
};

const updateReview = async (req, res) => {
  const { rating, title, comment } = req.body;
  const review = await Review.findOne({ _id: req.params.id });
  if (!review) {
    throw new NotFoundError(`No review with id ${req.params.id}`);
  }

  checkPermissions(req.user, review.user);

  const updatedReview = await Review.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json({ updatedReview });
};

const deleteReview = async (req, res) => {
  const review = await Review.findOne({ _id: req.params.id });
  if (!review) {
    throw new NotFoundError(`No review with id ${req.params.id}`);
  }

  checkPermissions(req.user, review.user);
  await review.remove();

  res.status(201).json({ msg: "Review successfully deleted" });
};

const getSingleProductReview = async (req, res) => {
  const { id: productId } = req.params;
  const reviews = await Review.find({ product: productId });

  res.status(200).json({ reviews, count: reviews.length });
};

module.exports = {
  createReview,
  getAllReview,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReview,
};
