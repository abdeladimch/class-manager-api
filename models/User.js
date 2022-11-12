const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlegth: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: [isEmail, "Please enter a valid email address!"],
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email address!",
    ],
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: [8, "Password must be more than 8 characters long!"],
  },
  role: {
    type: String,
    enum: ["teacher", "student"],
    default: "student",
  },
  emailToken: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
  verified: Date,
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.pre("remove", async function (next) {
  await this.model("Class").deleteMany({ teacher: this._id });
  next();
});

module.exports = mongoose.model("User", UserSchema);
