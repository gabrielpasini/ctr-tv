const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth");
const Game = require("../models/game");

router.use(authMiddleware);

router.post("/register", async (req, res) => {
  const { name } = req.body;
  try {
    if (await Game.findOne({ name })) {
      return res.status(400).send({
        showMessage: true,
        error: "Já existe um jogo com este nome",
      });
    }
    const game = await Game.create(req.body);

    return res.status(200).send({
      game,
      showMessage: true,
      success: "Jogo cadastrado com sucesso",
    });
  } catch (err) {
    return res
      .status(400)
      .send({ showMessage: true, error: "Erro no registro", source: err });
  }
});

router.put("/edit", async (req, res) => {
  const { edited, id } = req.body;
  try {
    const game = await Game.findById(id);

    if (!game) return res.status(400).send({ error: "Jogo não encontrado" });

    const editedFields = { ...edited };

    await Game.findByIdAndUpdate(id, {
      $set: {
        ...editedFields,
      },
    });

    const newGame = await Game.findById(id);

    return res.status(200).send({
      newGame,
      showMessage: true,
      success: "Jogo alterado com sucesso",
    });
  } catch (err) {
    return res.status(400).send({
      showMessage: true,
      error: "Erro ao editar o jogo",
      source: err,
    });
  }
});

router.get("/get-all", async (req, res) => {
  try {
    const games = await Game.find();
    return res.status(200).send({
      games,
      success: "Jogos carregados com sucesso",
    });
  } catch (err) {
    return res.status(400).send({
      showMessage: true,
      error: "Erro ao buscar os jogos",
      source: err,
    });
  }
});

module.exports = (app) => app.use("/game", router);
