let BITBOXSDK = require('bitbox-sdk/lib/bitbox-sdk').default;
let BITBOX = new BITBOXSDK();

class Wallet {

    constructor(privateKey, cashAddress) {
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

    getKeyPair(){
        let masterHDNode = WalletBuilder.getExistingWallet(this.privateKey);
        return BITBOX.HDNode.toKeyPair(masterHDNode);
    }
}

class WalletFactory {
    createNewWallet() {
        let masterHDNode = this.createMasterHDNode("testnet");
        let publicKey = this.generatePublicKey(masterHDNode);
        let privateKeyWIF = BITBOX.HDNode.toWIF(BITBOX.HDNode.derive(masterHDNode, 0));
        return new Wallet(privateKeyWIF, publicKey);
    }

    getExistingWallet(privateKeyWIF){
        let masterHDNode = BITBOX.HDNode.fromXPriv(privateKeyWIF);
        let publicKey = this.generatePublicKey(masterHDNode);
        let privateKeyWIF = BITBOX.HDNode.toWIF(BITBOX.HDNode.derive(masterHDNode, 0));
        return new Wallet(privateKeyWIF, publicKey);
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