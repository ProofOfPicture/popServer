let BITBOXSDK = require('bitbox-sdk/lib/bitbox-sdk').default;
let BITBOX = new BITBOXSDK();

class Validator {
    async validatePictureHash(pictureHash, transactionId) {
        try {
            let details = await BITBOX.Transaction.details(transactionId).catch(error => console.log(error));
            if (details) {
                let fromASM = BITBOX.Script.fromASM(details.vout[0].scriptPubKey.asm);
                let candidate = fromASM.toString("hex").substr(4);
                return candidate === pictureHash;
            }
        } catch (error) {
            console.error(error)
            return false;
        }
    }
}

module.exports = { Validator };