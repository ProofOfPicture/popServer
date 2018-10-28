const express = require('express')
const {Wallet, WalletFactory} = require('./createWallet')
const {Broadcaster} = require('./broadcastPicture')
const {Validator} = require('./validatePicture')
const app = express()
const bodyParser = require('body-parser')
const port = process.env.PORT || 5000
const factory = new WalletFactory()
const radio = new Broadcaster()
const validator = new Validator()

app.use(bodyParser.json());
app.listen(port, () => console.log(`Listening on port ${port}`));

app.put('/wallet', (req, res) => res.send(factory.createNewWallet()))
app.put('/broadcast', (req, res) => {
  console.log(req.body)
  let params = req.body
  let wallet = new Wallet(params.cashAddress, params.exPriv)
  radio.broadcastPictureHash(params.pictureHash, wallet)
    .then(value => res.send(value))
    .catch(err => console.error(err))
})
app.put('/isValid', (req, res) => {
  console.log(req)
  let params = req.body
  let response1 = Promise.resolve(validator.validatePictureHash(params.pictureHash, params.transactionId))
  let response = validator.validatePictureHash(params.pictureHash, params.transactionId)
  res.send(response1)
})
