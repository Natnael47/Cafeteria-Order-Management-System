import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String, required: true },
  phone: { type: Number, required: true },
  Position: { type: String, required: true },
  shift: { type: String, required: true },
  education: { type: String, required: true },
  experience: { type: String, required: true },
  salary: { type: Number, required: true },
  address: { type: Object, required: true },
  about: { type: String, required: true },
  hireDate: { type: Number, required: true },
});

const employeeModel =
  mongoose.models.employee || mongoose.model("employee", employeeSchema);

export default employeeModel;
