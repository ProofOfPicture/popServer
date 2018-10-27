const express = require('express');
const {Wallet, WalletFactory} = require("./createWallet");
const {Broadcaster} = require("./broadcastPicture");
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 5000;
const factory = new WalletFactory();
const radio = new Broadcaster();

app.use(bodyParser.json());
// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

app.put('/wallet', (req, res) => res.send(factory.createNewWallet()));
app.put('/broadcast', (req, res) => {
    let params = req.body;
    let wallet = new Wallet(params.privateKey, params.cashAddress, params.exPriv);
    radio.broadcastPictureHash(params.pictureHash, wallet).then(value => res.send(value));
});