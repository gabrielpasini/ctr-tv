const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res
      .status(401)
      .send({ showMessage: true, error: "Token não informado" });

  const parts = authHeader.split(" ");

  if (!parts.length === 2)
    return res.status(401).send({ showMessage: true, error: "Erro no token" });

  const [scheme, token] = parts;

  if (scheme !== "Bearer")
    return res
      .status(401)
      .send({ showMessage: true, error: "Token não formatado" });

  jwt.verify(token, process.env.AUTH_SECRET, (err, decoded) => {
    if (err)
      return res
        .status(401)
        .send({ showMessage: true, error: "Token inválido" });

    req.userId = decoded.id;
    return next();
  });
};
