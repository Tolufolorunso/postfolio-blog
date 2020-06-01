const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");

router.route("/").get(adminController.getAdminPage);
router
  .route("/oreofe")
  .get(adminController.getDashboard)
  .post(adminController.login);

router.route("/oreofe/dashboard").get(adminController.getAdminDashboard);
// router.route("/oreofe/user").post(adminController.signupUser);

module.exports = router;
// adminController.authorize,
