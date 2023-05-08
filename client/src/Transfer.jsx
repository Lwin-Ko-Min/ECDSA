import { useState } from "react";
import server from "./server";
import { secp256k1 } from 'ethereum-cryptography/secp256k1';
import { utf8ToBytes } from "ethereum-cryptography/utils";

function Transfer({ address, setBalance, privateKey, signature, setSignature }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();
    const message = utf8ToBytes(recipient + sendAmount.toString());
    const generatedSignature = secp256k1.sign(message, privateKey); 
    setSignature(generatedSignature);
  //  console.log(signature);
  
    try {
      const response = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        signature,
        message,
      });
      const { balance } = response.data;
      setBalance(balance);
      setSignature("");
    }catch (ex) {
      alert(ex.response.data.message);
    }
  }
  

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
