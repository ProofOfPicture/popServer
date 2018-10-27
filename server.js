const express = require('express');
const {Wallet, WalletFactory} = require("./createWallet");
const {Broadcaster} = require("./broadcastPicture");
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 5000;
const factory = new WalletFactory();
const radio = new Broadcaster();

app.use(bodyParser.json());
app.listen(port, () => console.log(`Listening on port 5000`));

app.put('/wallet', (req, res) => res.send(factory.createNewWallet()));
app.put('/broadcast', (req, res) => {
    let params = req.body;
    let wallet = new Wallet(params.private_key, params.cash_address);
    radio.broadcastPictureHash(params.picture_hash, wallet);
    res.send("ok");
});