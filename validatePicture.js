let BITBOXSDK = require('bitbox-sdk/lib/bitbox-sdk').default;
let BITBOX = new BITBOXSDK();

class Validator {
    validatePictureHash(pictureHash, transactionId) {
        this.isValidPicture = false;
        (async () => {
            try {
              let details = await BITBOX.Transaction.details(transactionId);

              let pictureHashInBlockchain = BITBOX.Script.decode([
                BITBOX.Script.opcodes.OP_RETURN,
                Buffer.from(details.vout[0].scriptPubKey.hex, "hex")
            ]);

            if(pictureHashInBlockchain === pictureHash){
                this.isValidPicture = true;
            } else{
                this.isValidPicture = false;
            }

            } catch(error) {
             console.error(error)
             this.isValidPicture = false;
            }
          })().then(() => this.isValidPicture);
    }
}

module.exports = {Validator};