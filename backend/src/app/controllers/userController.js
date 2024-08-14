const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const authMiddleware = require("../middlewares/auth");
const User = require("../models/user");

router.use(authMiddleware);

router.get("/get-user", async (req, res) => {
  const { token } = req.query;
  try {
    const userId = await jwt.verify(
      token,
      process.env.AUTH_SECRET,
      (err, decoded) => {
        if (err)
          return res
            .status(401)
            .send({ showMessage: true, error: "Token inválido" });
        return decoded.id;
      }
    );

    const user = await User.findById(userId);
    return res.status(200).send({ user });
  } catch (err) {
    return res.status(400).send({
      showMessage: true,
      error: "Erro ao buscar o usuario",
      source: err,
    });
  }
});

router.put("/edit-user", async (req, res) => {
  const { token, editedData, isEditedEmail } = req.body;
  try {
    const userId = await jwt.verify(
      token,
      process.env.AUTH_SECRET,
      (err, decoded) => {
        if (err)
          return res
            .status(401)
            .send({ showMessage: true, error: "Token inválido" });
        return decoded.id;
      }
    );

    const editedFields = { ...editedData };

    if (isEditedEmail) {
      if (await User.findOne({ email: editedFields.email })) {
        return res.status(400).send({
          showMessage: true,
          error: "Já existe um usuário com este email",
        });
      }
      const now = new Date();
      now.setHours(now.getHours() + 24);
    }

    await User.findByIdAndUpdate(userId, {
      $set: {
        ...editedFields,
      },
    });
    const newUser = await User.findById(userId);

    return res.status(200).send({
      showMessage: true,
      user: newUser,
      success: "Dados alterados com sucesso",
    });
  } catch (err) {
    return res.status(400).send({
      showMessage: true,
      error: "Erro ao editar dados do usuario",
      source: err,
    });
  }
});

router.put("/edit-password", async (req, res) => {
  const { password, token } = req.body;
  try {
    const userId = await jwt.verify(
      token,
      process.env.AUTH_SECRET,
      (err, decoded) => {
        if (err)
          return res
            .status(401)
            .send({ showMessage: true, error: "Token inválido" });
        return decoded.id;
      }
    );

    const user = await User.findById(userId);
    user.password = password;
    await user.save();

    return res
      .status(200)
      .send({ showMessage: true, success: "Senha alterada com sucesso" });
  } catch (err) {
    return res.status(400).send({
      showMessage: true,
      error: "Erro ao editar a senha",
      source: err,
    });
  }
});

module.exports = (app) => app.use("/user", router);
