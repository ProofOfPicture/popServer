let BITBOXSDK = require('bitbox-sdk/lib/bitbox-sdk').default;
let BITBOX = new BITBOXSDK();

class Validator {
    async validatePictureHash(pictureHash, transactionId) {
        this.isValidPicture = false;

        try {
            let details = await BITBOX.Transaction.details(transactionId).catch(error => console.log(error));
            if (details) {

                let pictureHashInBlockchain = details.vout[0].scriptPubKey.hex.toString().replace('6a03', ''); // Ugly I know, but works?
                return pictureHashInBlockchain === pictureHash;
            }
        } catch (error) {
            console.error(error)
            return false;
        }
    }
}

module.exports = { Validator };