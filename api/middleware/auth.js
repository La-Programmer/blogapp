import Session from "../models/SessionSchema.js";


const checkSessionExpiration = async (req, res, next) => {
	const sessionToken = req.headers.authorization; // Assuming the session token is sent in the 'Authorization' header

  if (sessionToken) {
    try {
      const session = await Session.findOne({ tokenId: sessionToken });

      if (session && Date.now() - session.lastActivity < 60 * 60 * 1000) {
        // Update last activity timestamp
        await Session.updateOne(
          { _id: session._id },
          { $set: { lastActivity: Date.now() } }
        );
        next(); // Continue processing the request
      } else {
        // Session has expired, delete from database.
        await Session.deleteOne({ _id: session._id });
        res.status(401).json({ msg: 'Session expired. Please log in again.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Internal server error' });
    }
  } else {
    // No session token provided
    res
      .status(401)
      .json({ msg: 'Unauthorized. Please provide a valid session token.' });
  }
};

export default checkSessionExpiration