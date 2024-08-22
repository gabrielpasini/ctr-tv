const express = require("express");
const router = express.Router();

const User = require("../models/user");

router.get("/get-profile", async (req, res) => {
  const { username } = req.query;
  try {
    const user = await User.findOne({ username });
    const userProfile = {
      username: user.username,
      name: user.name,
      lastname: user.lastname,
      phone: user.phone,
      birthDate: user.birthDate,
      ...user.profile,
    };
    return res.status(200).send(userProfile);
  } catch (err) {
    return res.status(400).send({
      showMessage: true,
      error: "Erro ao buscar o usuario",
      source: err,
    });
  }
});

module.exports = (app) => app.use("/user", router);
