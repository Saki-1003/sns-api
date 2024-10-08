const Identicon = require("identicon.js");

const generateIdenticon = (input, size = 64) => {
  //inputをhash化する
  const hash = require("crypto").createHash("md5").update(input).digest("hex");
  const data = new Identicon(hash, size).toString();

  return `data:image/png;base64,${data}`;
};

module.exports = generateIdenticon;
