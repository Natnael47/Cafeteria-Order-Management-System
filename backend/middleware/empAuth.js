import jwt from "jsonwebtoken";

const empAuth = async (req, res, next) => {
  try {
    // Retrieve either cToken or iToken from the headers
    const token = req.headers.ctoken || req.headers.itoken;
    // Check if a token is provided
    if (!token) {
      return res.json({
        success: false,
        message: "Not Authorized. Login failed",
      });
    }

    // Verify and decode the token
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.body.empId = token_decode.id; // Store the decoded employee ID for future use
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export default empAuth;
