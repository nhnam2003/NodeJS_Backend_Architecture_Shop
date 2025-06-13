"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../authentication/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError, ForbiddenError } = require("../core/error.response");
const { FindByEmail } = require("../services/shop.service");
const keyTokenModel = require("../models/keyToken.model");

const roleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {

  static handlerRefreshToken = async (refreshToken) => {
    console.log("handle");

    //check token da duoc su dung hay chua
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken)
    if (foundToken) {
      //neu co thi kiem tra day la ai
      const { userId, email } = await verifyJWT(refreshToken, foundToken.publicKey)
      console.log("[1]{ userId, email }", { userId, email });

      // xoa tat ca token trong keystore

      await KeyTokenService.deleteKeyByUserId(foundToken._id)
      throw new ForbiddenError('Something wrong happend !! Pls relogin')
    }
    //neu khong
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)
    console.log('refreshToken:', refreshToken)

    if (!holderToken) throw new ForbiddenError('Shop not registed 1')

    //verify token
    const { userId, email } = await verifyJWT(refreshToken, holderToken.publicKey)
    console.log("[2]{ userId, email }", { userId, email });

    //check userid
    const foundShop = await FindByEmail({ email })
    if (!foundShop) throw new ForbiddenError('Shop not registed 2')

    // create 1 cap token moi

    const tokens = await createTokenPair({ userId, email }, holderToken.publicKey, holderToken.privateKey)

    //update token

    await keyTokenModel.updateOne(
      { _id: holderToken._id },
      { $set: { refreshToken: tokens.refreshToken } }
    );

    return {
      user: { userId, email },
      tokens
    }

  }

  static signUp = async ({ name, email, password }) => {
    try {
      const hodelShop = await shopModel.findOne({ email }).lean();
      if (hodelShop) {
        throw new BadRequestError('Error : Shop already registed  ')
      }
      const hashPassword = await bcrypt.hash(password, 10);
      const newShop = await shopModel.create({
        name, email, password: hashPassword, roles: [roleShop.SHOP],
      });
      if (newShop) {
        //create private key, public key
        // const privateKey = crypto.randomBytes(64).toString('hex')
        // const publicKey = crypto.randomBytes(64).toString('hex')
        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
          },
          privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
          }
        });

        console.log("{ privateKey, publicKey }::", { privateKey, publicKey }); // save collection KeyStore
        console.log("===============================================1");

        const keyStore = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
          privateKey,
          refreshToken: null,
        });

        if (!keyStore) {
          throw new BadRequestError("keyStore error")
        }

        //create token pair
        const token = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey);
        console.log("Create successfull token::", token);

        return {
          code: 201,
          metadata: {
            shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }),
            tokens: token,
          },
        };
      }
      return {
        code: 201,
        metadata: null,
      };
    } catch (error) {
      return {
        code: "xxx1",
        message: error.message,
        status: error.status,
      };
    }
  };

  static login = async ({ email, password }) => {
    const foundShop = await FindByEmail({ email });
    if (!foundShop) {
      throw new BadRequestError("Shop not registed");
    }
    const match = await bcrypt.compare(password, foundShop.password);
    if (!match) {
      throw new AuthFailureError("Authentication error");
    }
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem'
      }
    });
    const tokens = await createTokenPair({ userId: foundShop._id, email }, publicKey, privateKey);
    await KeyTokenService.createKeyToken({
      userId: foundShop._id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });
    return {
      shop: getInfoData({ fields: ['_id', 'name', 'email'], object: foundShop }),
      tokens,
    };
  };

  static logout = async (keyStore) => {
    console.log("logout called", keyStore);
    try {
      const delKey = await KeyTokenService.removeKeyById(keyStore._id);
      console.log({ delKey });
      return delKey;
    } catch (err) {
      console.error("AccessService.logout error:", err);
      throw err;
    }
  };

}

module.exports = AccessService;
