var express = require("express");
var router = express.Router();
const DButils = require("../routes/utils/DButils");
const bcrypt = require("bcryptjs");

router.post("/Register", async (req, res, next) => {
  try {
    // parameters exists
    // valid parameters
    // username exists
    const users = await DButils.execQuery(
        "SELECT username FROM Users"
    );
    if (users.find((x) => x.username === req.body.username))
      throw { status: 409, message: "Username taken" };

    //hash the password
    let hash_password = bcrypt.hashSync(
        req.body.password,
        parseInt(process.env.bcrypt_saltRounds)
    );
    req.body.password = hash_password;

    // add the new username
    await DButils.execQuery(
      `INSERT INTO Users (username, FirstName, LastName, country, password, email, url, user_status) VALUES ('${req.body.username}','${req.body.FirstName}', 
      '${req.body.LastName}', '${req.body.country}', '${hash_password}', '${req.body.email}', '${req.body.url}', '${req.body.status}')`);

    res.status(201).send("user created");
  } catch (error) {
    next(error);
  }
});

router.post("/Login", async (req, res, next) => {
  try {
    const user = (
        await DButils.execQuery(
            `SELECT username, password,user_status FROM Users WHERE username = '${req.body.username}'`
        )
    )[0];
    // user = user[0];
    // check that username exists & the password is correct
    if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
      throw { status: 401, message: "Username or Password incorrect" };
    }

    // Set cookie
    if (req.session && req.session.user_id && req.session.user_id === user.username){
      throw { status: 406, message: "User Already Logged In" };
    }
    req.session.user_id = user.username;
    req.session.user_status = user.user_status;
    // return cookie
    res.status(200).send("login succeeded");
  } catch (error) {
    next(error);
  }
});


router.post("/Logout", function (req, res) {
  req.session.reset(); // reset the session info --> send cookie when  req.session == undefined!!
  res.send({ success: true, message: "logout succeeded" });
});

module.exports = router;
