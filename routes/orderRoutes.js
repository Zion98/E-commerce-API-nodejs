const express = require("express");
const router = express.Router();

const {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
} = require("../controllers/orderControllers");

const {
  authenticateUser,
  authorizePermissions,
} = require("../middlewares/authentication");

router.route("/").get(authorizePermissions("admin"), getAllOrders);
router.route("/showAllMyOrders").get(authenticateUser, getCurrentUserOrders);
router.route("/").post(authenticateUser, createOrder)
router
  .route("/:id")
  .get(authenticateUser, getSingleOrder)
  .patch(authenticateUser, updateOrder);

module.exports = router;
