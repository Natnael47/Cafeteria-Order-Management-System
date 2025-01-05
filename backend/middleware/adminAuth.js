import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const adminAuth = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res.json({ success: false, message: "Not Authorized" });
    }

    // Decode the token to get the employee ID
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the admin employee using the decoded ID
    const admin = await prisma.employee.findUnique({
      where: {
        id: token_decode.id,
      },
    });

    // Check if the employee exists and if their role is 'admin'
    if (!admin || admin.position !== "admin") {
      return res.json({
        success: false,
        message: "Not Authorized for this operation",
      });
    }

    // Attach the adminId to the request object
    req.adminId = admin.id;

    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default adminAuth;
