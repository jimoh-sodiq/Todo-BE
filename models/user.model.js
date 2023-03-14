import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please add a first name"],
      minlength: [2, "First name must be at least 2 characters"],
      maxlength: [50, "First name must not be more than 30 characters"],
    },
    lastName: {
      type: String,
      minlength: [2, "Last name must be at least 2 characters"],
      maxlength: [50, "Last name must not be more than 30 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters"],
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.createJWT = function () {
  return jwt.sign({userId: this._id, firstName: this.firstName}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION})
}

UserSchema.methods.comparePassword = async function (enteredPasssword){
  return await bcrypt.compare(enteredPasssword, this.password)
}


const User = mongoose.model("User", UserSchema);

export default User;
