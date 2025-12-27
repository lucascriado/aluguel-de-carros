const jwt = require("jsonwebtoken");

function Auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "b2ffcda4-2109-40d0-a7a8-0f66d6131788"
    );

    req.user = decoded;
    next();

  } catch (err) {
    return res.status(403).json({ error: "Token inválido ou expirado" });
  }
}

module.exports = Auth;
