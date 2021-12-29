const express = require("express");
const router = express.Router();

const {
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  createProduct,
  uploadImage,
} = require("../controllers/productController");

const { getSingleProductReview } = require("../controllers/reviewController");

const {
  authenticateUser,
  authorizePermissions,
} = require("../middlewares/authentication");

router
  .route("/")
  .post([authenticateUser, authorizePermissions("admin")], createProduct)
  .get(getAllProducts);

router
  .route("/uploadImage")
  .post([authenticateUser, authorizePermissions("admin"), uploadImage]);

router
  .route("/:id")
  .get(getSingleProduct)
  .patch([authenticateUser, authorizePermissions("admin"), updateProduct])
  .delete([authenticateUser, authorizePermissions("admin"), deleteProduct]);

router.route("/:id/reviews").get(getSingleProductReview);
module.exports = router;
