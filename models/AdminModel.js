const {data} = require('joi')
const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
            {
                full_name: {
                    type: String,
                    required: true,
                },
                isAdmin: {
                    type: Boolean,
                    default: true
                },
                email: {
                    type: String,
                    required: true,
                },
                phone: {
                    type: String,
                    required: true,
                },
                password: {
                    type: String,
                    required: true,
                },
                address: {
                    type: String,
                },
                super_admin: {
                    type:Boolean,
                    default: false
                },
                isAdmin: {
                    type:Boolean,
                    default: true
                }
            },
            {
                timestamps: true,
            }
            );

module.exports = mongoose.model("Admin", adminSchema);