const jwt = require("jsonwebtoken");

function isAuthenticated(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1]; //Bearerとtokenの間のスペースで区切る

  if (!token) {
    return res.status(401).json({ message: "No authorization issued." });
  }

  //tokenをdecodeする
  jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {
    if (error) {
      // decodeしたけど元のtokenと一致しなかった場合
      return res.status(401).json({ message: "No authorization issued." });
    }

    req.userId = decoded.id; // 上記エラーを抜けた場合、userIdをreqオブジェクトに追加してdecoded.idを入れる。

    next(); //上記すべてをクリアした場合に、middlewareの次の処理に進ませるための関数
  });
}

module.exports = isAuthenticated;
