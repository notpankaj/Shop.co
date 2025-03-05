module.exports = async (req, res, next) => {
  try {
    if (req.user?._doc?.isAdmin || req.user?.isAdmin) {
      return next();
    }
    if (req.user?._doc?.role !== "brand") {
      return res
        .status(401)
        .json({ message: "Only Brand Account can access this resource!" });
    }
    return next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Token is not valid" });
  }
};
