const express = require('express');
const { WalletBuilder } = require("./createWallet");
const app = express();
const port = process.env.PORT || 5000;

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

app.get('/wallet', (req, res) => res.send({
    wallet: new WalletBuilder().getExistingWallet('tprv8ZgxMBicQKsPeVyafoZewvDJnkza4dCkt9U2FD1xdtcbU3LHcm3vPv1G8siHFDg2FWihV7mGDdugRyAgziy9sTNTrb7YDcxWCoYspMSJMDe')
}));