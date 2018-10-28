let BITBOXSDK = require('bitbox-sdk/lib/bitbox-sdk').default;
let BITBOX = new BITBOXSDK();

class Wallet {
    constructor(cashAddress, exPriv) {
        this.cashAddress = cashAddress;
        this.exPriv = exPriv;
    }
}

class WalletFactory {
    createNewWallet() {
        let masterHDNode = this.createMasterHDNode("bitcoincash");
        let publicKey = this.generatePublicKey(masterHDNode);
        let privateKeyWIF = BITBOX.HDNode.toWIF(BITBOX.HDNode.derive(masterHDNode, 0));
        let exPriv = BITBOX.HDNode.toXPriv(masterHDNode);
        return new Wallet(privateKeyWIF, publicKey, exPriv);
    }

    getExistingWallet(exPriv){ // Has to be extended private key like: xprvxxxxxxxxxx
        let masterHDNode = BITBOX.HDNode.fromXPriv(exPriv);
        let publicKey = this.generatePublicKey(masterHDNode);
        let privateKeyWIF = BITBOX.HDNode.toWIF(BITBOX.HDNode.derive(masterHDNode, 0));
        return new Wallet(privateKeyWIF, publicKey, exPriv);
    }

    createMasterHDNode(network) { // Network "testnet" for testnet and "bitcoincash" for main net.
        let randomBytes = BITBOX.Crypto.randomBytes(32);
        let mnemonic = BITBOX.Mnemonic.fromEntropy(randomBytes);
        let rootSeed = BITBOX.Mnemonic.toSeed(mnemonic);
        return BITBOX.HDNode.fromSeed(rootSeed, network);
    }

    generatePublicKey(masterHDNode) {
        let account = BITBOX.HDNode.derivePath(masterHDNode, "m/44'/145'/0'");
        return BITBOX.HDNode.toCashAddress(account);
    }
}

module.exports = {Wallet, WalletFactory};