"use strict";

const AccessService = require("../services/access.service");
const { OK, CREATED, SuccessResponse } = require("../core/success.response");
class AccessController {

  handlerRefreshToken = async (req, res, next) => {

    const result = await AccessService.handlerRefreshToken(req.body.refreshToken);
    new SuccessResponse({
      message: "Get token success",
      metadata: result,
    }).send(res);

  };

  login = async (req, res, next) => {
    new SuccessResponse({
      message: "Login Success",
      metadata: await AccessService.login(req.body),
    }).send(res);
  };
  signUp = async (req, res, next) => {
    new CREATED({
      message: "Register OK",
      metadata: await AccessService.signUp(req.body),
      options:
        { limit: 10 }
    }).send(res);
  };
  logout = async (req, res, next) => {
    new SuccessResponse({
      message: "Logout Success",
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  };
}

module.exports = new AccessController();
