const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      ddd: {
        type: String,
        required: true,
      },
      numero: {
        type: String,
        required: true,
      },
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  }
)

const User = mongoose.model('User', userSchema)

module.exports = User;
