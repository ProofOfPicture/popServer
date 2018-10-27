

let BITBOXSDK = require('bitbox-sdk/lib/bitbox-sdk').default;
let BITBOX = new BITBOXSDK();

class Wallet {

    constructor(privateKey, cashAddress) {
        this.cashAddress = cashAddress;
        this.privateKey = privateKey;

        BITBOX.Address.utxo(cashAddress).then(
            result => {
                if (!result[0]) {
                    return;
                }
                this.utxos = result;
            }

        );
    }

    generateKeyPair(masterHDNode){
        return BITBOX.HDNode.fromXPriv(this.privateKey);
    }
}

class WalletFactory {
    createWallet() {
        let masterHDNode = this.createMasterHDNode();
        let publicKey = this.generatePublicKey(masterHDNode);
        let privateKeyWIF = BITBOX.HDNode.toWIF(BITBOX.HDNode.derive(masterHDNode, 0));
        return new Wallet(privateKeyWIF, publicKey);
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
}

module.exports = { Wallet, WalletFactory};