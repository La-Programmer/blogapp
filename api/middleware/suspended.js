import User from "../models/UserSchema.js";

const checkUserSuspension = async (req, res, next) => {
	const { userEmail } = req.body;

  // Find user in database
  const user = await User.findOne({ email: userEmail });

  if (!user) {
    next();
  } else if (user.isSuspended) {
    return res.status(403).json({ msg: 'User account suspended'});
  }

  next();
};

export default checkUserSuspension;