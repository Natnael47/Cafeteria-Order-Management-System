import mongoose from "mongoose";

//mongodb+srv://COMS:23!user!23@cluster0.esrxd.mongodb.net/?
//mongodb+srv://C_O_M_S:23!user!23@cluster0.a3qhh.mongodb.net/?

export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://C_O_M_S:23!user!23@cluster0.a3qhh.mongodb.net/C-O-M-S"
    )
    .then(() => console.log("DB connection established"));
};
