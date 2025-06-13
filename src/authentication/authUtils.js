"usestrict";
const jwt = require("jsonwebtoken");
const { asyncHandler } = require("./checkAuth");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const KeyTokenService = require("../services/keyToken.service");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await jwt.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "2 days",
    });
    const refreshToken = await jwt.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "7 days",
    });

    jwt.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.log("error verify", err);
      } else {
        console.log('decode verify', decode);

      }
    });
    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);

  }
};

const authentication = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID]
  if (!userId) {
    throw new AuthFailureError("Invalid request")
  }
  const keyStore = await KeyTokenService.findByUserId(userId)
  if (!keyStore) {
    throw new NotFoundError("Not found keyStore")
  }
  const accessToken = req.headers[HEADER.AUTHORIZATION]
  if (!accessToken) {
    throw new AuthFailureError("Invalid request")
  }

  try {
    const decodeUser = jwt.verify(accessToken, keyStore.publicKey)
    if (userId !== decodeUser.userId) {
      throw new AuthFailureError("Invalid userId")
    }
    req.keyStore = keyStore
    return next()
  } catch (error) {
    throw error
  }

})

module.exports = {
  createTokenPair, authentication
};
