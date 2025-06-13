"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../authentication/checkAuth");
const { authentication } = require("../../authentication/authUtils");
const router = express.Router();

router.post(`/shop/signup`, asyncHandler(accessController.signUp));
router.post(`/shop/login`, asyncHandler(accessController.login));
router.post(`/shop/handlerRefreshToken`, asyncHandler(accessController.handlerRefreshToken));

//authentication
router.use(authentication);
router.post(`/shop/logout`, asyncHandler(accessController.logout));

module.exports = router;
