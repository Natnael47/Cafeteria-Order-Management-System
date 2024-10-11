import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String, default: "not selected" },
    address: { type: Object, default: { line1: "none", line2: "none" } },
    dob: { type: String, default: "not selected" },
    phone: { type: String, default: "0909090909" },
    cartData: { type: Object, default: {} },
  },
  { minimize: false }
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
