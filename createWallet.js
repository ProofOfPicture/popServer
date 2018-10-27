

let BITBOXSDK = require('bitbox-sdk/lib/bitbox-sdk').default;
let BITBOX = new BITBOXSDK();

class Wallet {

    constructor(keyPair, cashAddress) {
        this.cashAddress = cashAddress;
        this.keyPair = keyPair;

        BITBOX.Address.utxo(cashAddress).then(
            result => {
                if (!result[0]) {
                    return;
                }
                this.utxos = result;
            }

        );
    }
}

class WalletBuilder {
    createWallet() {

        let masterHDNode = this.createMasterHDNode();

        let publicKey = this.generatePublicKey(masterHDNode);
        let keyPair = this.generateKeyPair(masterHDNode);

        return new Wallet(keyPair, publicKey);
    }

    createMasterHDNode() {
        let randomBytes = BITBOX.Crypto.randomBytes(32);
        let mnemonic = BITBOX.Mnemonic.fromEntropy(randomBytes);
        let rootSeed = BITBOX.Mnemonic.toSeed(mnemonic);
        return BITBOX.HDNode.fromSeed(rootSeed, "testnet");
    }

    generatePublicKey(masterHDNode) {
        let account = BITBOX.HDNode.derivePath(masterHDNode, "m/44'/145'/0'");
        return BITBOX.HDNode.toCashAddress(account);
    }

    generateKeyPair(masterHDNode){        
        return BITBOX.HDNode.toKeyPair(masterHDNode);
    }
}

module.exports = {Wallet, WalletBuilder};