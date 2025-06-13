'use strict'

const { Types } = require("mongoose")
const keyTokenModel = require("../models/keyToken.model")

class KeyTokenService {

    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            // const publicKeyString = publicKey.toString()
            // const token = await keyTokenModel.create({
            //     user: userId,
            //     publicKey: publicKeyString
            // })
            // return token ? token?.publicKey : null
            const filter = { user: userId }, update = {
                publicKey, privateKey, refreshTokensUsed: [], refreshToken
            }, options = { upsert: true, new: true }
            const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options)
            return tokens ? tokens?.publicKey : null
        } catch (error) {
            console.error("KeyTokenService createKeyToken error:", error);
            return error
        }
    }
    static findByUserId = async (userId) => {
        return await keyTokenModel.findOne({ user: new Types.ObjectId(userId) })
    }
    static removeKeyById = async (id) => {
        return await keyTokenModel.deleteOne({ _id: new Types.ObjectId(id) })
    }
}

module.exports = KeyTokenService