module.exports = async (req, res, next) => {
  try {
    if (req.user?._doc?.isAdmin || req.user?.isAdmin) {
      return next();
    }
    res.status(401).json({ message: "Only Admin can access this resource!" });
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Token is not valid" });
  }
};
