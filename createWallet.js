let BITBOXSDK = require('bitbox-sdk/lib/bitbox-sdk').default;
let BITBOX = new BITBOXSDK();

class Wallet {
<<<<<<< HEAD
    constructor(privateKey, cashAddress, exPriv) {
=======

    constructor(privateKey, cashAddress) {
    constructor(privateKey, cashAddress) {
>>>>>>> 2ead0d3042cf7b24881cafa95642ec30e035fea9
        this.cashAddress = cashAddress;
        this.privateKey = privateKey;
        this.exPriv = exPriv;

        BITBOX.Address.utxo(cashAddress).then(
            result => {
                if (!result[0]) {
                    return;
                }
                this.utxos = result;
            }
        );
    }
<<<<<<< HEAD
    
    getKeyPair(){      
        let masterHDNode = BITBOX.HDNode.fromXPriv(privateKey);
=======

    getKeyPair(){
        let masterHDNode = WalletBuilder.getExistingWallet(this.privateKey);
>>>>>>> 2ead0d3042cf7b24881cafa95642ec30e035fea9
        return BITBOX.HDNode.toKeyPair(masterHDNode);
    }
}

class WalletFactory {
    createNewWallet() {
        let masterHDNode = this.createMasterHDNode("testnet");
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

module.exports = { Wallet, WalletFactory};