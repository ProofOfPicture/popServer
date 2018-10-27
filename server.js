const express = require('express');
const {Wallet, WalletFactory} = require("./createWallet");
const {Broadcaster} = require("./broadcastPicture");
const app = express();
const port = process.env.PORT || 5000;
const factory = new WalletFactory();
const radio = new Broadcaster();

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

<<<<<<< HEAD
app.get('/wallet', (req, res) => res.send({
    wallet: new WalletBuilder().getExistingWallet('tprv8ZgxMBicQKsPeVyafoZewvDJnkza4dCkt9U2FD1xdtcbU3LHcm3vPv1G8siHFDg2FWihV7mGDdugRyAgziy9sTNTrb7YDcxWCoYspMSJMDe')
}));
=======
app.put('/wallet', (req, res) => res.send(factory.createWallet()));
app.put('/broadcast', (req, res) => {
    console.log(req);
    let wallet = new Wallet(req.walletPrivateKey, req.walletCachAddress);
    console.log(wallet);
    radio.broadcastPictureHash(req.pictureHash, wallet);
    res.send("ok");
});
>>>>>>> 2ead0d3042cf7b24881cafa95642ec30e035fea9
