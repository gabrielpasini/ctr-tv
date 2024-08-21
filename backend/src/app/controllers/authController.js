const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const mailer = require("../../modules/mailer");

const User = require("../models/user");

function generateToken(id) {
  return jwt.sign({ id }, process.env.AUTH_SECRET);
}

router.post("/register", async (req, res) => {
  const { email, username } = req.body;
  try {
    if (await User.findOne({ email })) {
      return res.status(400).send({
        showMessage: true,
        error: "Já existe um usuário com este email",
      });
    }
    if (
      await User.findOne({
        username: {
          $regex: `^(?i)${username}$`,
        },
      })
    ) {
      return res.status(400).send({
        showMessage: true,
        error: "Este nome de usuário não está disponível",
      });
    }
    const user = await User.create(req.body);
    user.password = undefined;

    return res.status(200).send({
      user,
      token: generateToken(user.id),
      showMessage: true,
      success: "Cadastro realizado com sucesso",
    });
  } catch (err) {
    return res
      .status(400)
      .send({ showMessage: true, error: "Erro no registro", source: err });
  }
});

router.post("/authenticate", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({
      username: {
        $regex: `^(?i)${username}$`,
      },
    }).select("+password");

    if (!user) {
      return res
        .status(400)
        .send({ showMessage: true, error: "Usuário não encontrado" });
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return res
        .status(400)
        .send({ showMessage: true, error: "Senha inválida" });
    }

    user.password = undefined;

    return res.status(200).send({
      showMessage: true,
      user,
      token: generateToken(user.id),
      success: "Login realizado com sucesso",
    });
  } catch (err) {
    return res
      .status(400)
      .send({ showMessage: true, error: "Erro no login", source: err });
  }
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user)
      return res
        .status(400)
        .send({ showMessage: true, error: "Usuário não encontrado" });

    const token = crypto.randomBytes(20).toString("hex");

    const now = new Date();
    now.setHours(now.getHours() + 1);

    await User.findByIdAndUpdate(user.id, {
      $set: {
        passwordResetToken: token,
        passwordResetExpires: now,
      },
    });

    mailer.sendMail(
      {
        to: [email],
        from: `CTR TV <${process.env.EMAIL_INBOX}>`,
        subject: "ESQUECI MINHA SENHA - CTR TV",
        template: "auth/forgot-password",
        context: {
          nome: user.name,
          frontendUrl: process.env.FRONTEND_URL,
          token,
          email,
        },
      },
      (err) => {
        if (err)
          return res.status(400).send({
            showMessage: true,
            error: "Não foi possível enviar o email de recuperação de senha",
          });

        return res.status(200).send({
          showMessage: true,
          success: "Email de recuperação de senha enviado com sucesso",
        });
      }
    );
  } catch (err) {
    return res.status(400).send({
      showMessage: true,
      error: "Erro no esqueci minha senha, tente novamente",
      source: err,
    });
  }
});

router.post("/reset-password", async (req, res) => {
  const { email, token, password } = req.body;
  try {
    const user = await User.findOne({ email }).select(
      "+passwordResetToken +passwordResetExpires"
    );
    if (!user)
      return res
        .status(400)
        .send({ showMessage: true, error: "Usuário não encontrado" });

    if (token !== user.passwordResetToken)
      return res
        .status(400)
        .send({ showMessage: true, error: "Token inválido" });

    const now = new Date();
    if (now > user.passwordResetExpires)
      return res
        .status(400)
        .send({ showMessage: true, error: "Token expirou, gere um novo" });

    user.password = password;

    await user.save();

    return res.status(200).send({
      showMessage: true,
      success: "Sua senha foi redefinida com sucesso",
    });
  } catch (err) {
    return res.status(400).send({
      showMessage: true,
      error: "Erro ao resetar a senha, tente novamente",
      source: err,
    });
  }
});

module.exports = (app) => app.use("/auth", router);
