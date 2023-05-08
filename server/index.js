const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
//const { secp256k1 } = require("ethereum-cryptography/secp256k1");

app.use(cors());
app.use(express.json());

const balances = {
  "02ec47dd0fe437912ef515ebbf1c05c0966b6a6c4dbcdfdd88c3e5d2735c92e019": 100,
  "03aed55aef6bcc4815379ca518f76f9c57d7221351f18e2a765df5a423d96b5332": 50,
  "03941e8620560e6c5700f316742d1b783699a5514f13974c2679f9af4abc82f798": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const {/*message, sign sender,*/ recipient, amount, signature, message } = req.body;

  const sender = secp256k1.recoverPublicKey(message, signature);
  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
