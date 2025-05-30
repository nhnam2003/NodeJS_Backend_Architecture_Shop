"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../authentication/authUtils");
const { getInfoData } = require("../utils");
const roleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      console.log("run accsesssss service");

      const hodelShop = await shopModel.findOne({ email }).lean();
      if (hodelShop) {
        return {
          code: "xxxx",
          message: "Email already exists",
        };
      }
      console.log("hodelShop::", hodelShop);

      const hashPassword = await bcrypt.hash(password, 10);
      const newShop = await shopModel.create({
        name, email, password: hashPassword, roles: [roleShop.SHOP],
      });
      if (newShop) {
        //create private key, public key
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
        console.log("===============================================");

        const publicKeyString = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey: publicKey
        });
        console.log("===============================================");

        if (!publicKeyString) {
          return {
            code: "xxxx",
            message: "publicKeyString error",
          };
        }

        const publicKeyObject = crypto.createPublicKey(publicKeyString);

        //create token pair
        const token = await createTokenPair({ userId: newShop._id, email }, publicKeyObject, privateKey);
        console.log("Create successfull token::", token);

        return {
          code: 201,
          metadata: {
            shop: getInfoData({ filed: ['_id', 'name', 'email'], object: newShop }),
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
}

module.exports = AccessService;
