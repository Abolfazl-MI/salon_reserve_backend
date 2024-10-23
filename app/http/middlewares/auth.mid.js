const jwt = require("jsonwebtoken");
const { DataBaseService } = require("../../database/mongo_db_client");

 function authMiddleware(req, res, next) {
  console.log('request ')
  // get authorization headers
  let header = req.headers.Authorization|| req.headers.authorization
  // if not header exists or not start with Bearer or bearer
  if (!header || !header.startsWith("Bearer")) {
    return next({ status: 400, message: "unauthorized request" });
  }
  // get token
  const token = header.split(" ")[1];
  //   if token miss
  if (!token) {
    return next({ status: 400, message: "unauthorized request" });
  }
  // verify token
  jwt.verify(token, process.env.JWT_SECRET,async (err, decoded) => {
    if (err) {
      console.log(err)
      return next({ status: 400, message: "unauthorized request" });
    }
    // the decoded data is the user id so
    // we get user info then pass to other side
    let user=await DataBaseService.getUserById(decoded.id);
    req.user=user
    return next();
  });
}

function authorizeAdmin(req, res, next) {
  if (req.user.role == "admin") {
    next();
  } else {
    return res.status(403).json({
      status: 403,
      message: "forbidden",
    });
  }
}

module.exports = {
  authMiddleware,
  authorizeAdmin,
};
