import jwt from "jsonwebtoken";

const empAuth = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res.json({
        success: false,
        message: "Not Authorized Login failed",
      });
    }

    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.body.empId = token_decode.id;
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export default empAuth;
