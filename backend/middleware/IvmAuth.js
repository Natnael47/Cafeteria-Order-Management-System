import jwt from "jsonwebtoken";

const IvmAuth = async (req, res, next) => {
  try {
    const { itoken } = req.headers; // Expecting "itoken" in headers
    if (!itoken) {
      return res.json({
        success: false,
        message: "Not Authorized. Login failed",
      });
    }

    // Verify the token with JWT_SECRET and extract the ID
    const token_decode = jwt.verify(itoken, process.env.JWT_SECRET);
    req.body.empId = token_decode.id; // Attach the employee ID to the request body
    next();
  } catch (error) {
    console.log("Authentication error:", error);
    res.json({ success: false, message: "Authorization Error" });
  }
};

export default IvmAuth;
