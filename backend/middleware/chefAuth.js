import jwt from "jsonwebtoken";

const chefAuth = async (req, res, next) => {
  //console.log("Received headers:", req.headers);
  try {
    const { ctoken } = req.headers;
    if (!ctoken) {
      return res.json({
        success: false,
        message: "Not Authorized Login failed",
      });
    }

    const token_decode = jwt.verify(ctoken, process.env.JWT_SECRET);
    req.body.empId = token_decode.id;
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export default chefAuth;
