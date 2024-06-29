import User from "../models/User";
export const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if(user.userType == "ADMIN"){
      res.status(200).json(user);
    }
    else {
      res.status(403).json({ message: "You are not authorized to perform this action. Admin privileges required." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get user!" });
  }
};
export const getCustomers = async (req, res) => {
  try {
    const customers = await User.find({ userType: "User" }).select("-password");
    res.status(200).json(customers);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
