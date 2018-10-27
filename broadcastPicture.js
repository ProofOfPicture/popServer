let BITBOXSDK = require('bitbox-sdk/lib/bitbox-sdk').default;
let BITBOX = new BITBOXSDK();

class Broadcaster {

    broadcastPictureHash(pictureHash, wallet) {
        return BITBOX.Address.utxo(wallet.cashAddress).then(utxos => {

            if (!utxos || !utxos[0]) {
                return Promise.reject("No coins found in the wallet.");
            }

            // instance of transaction builder
            let transactionBuilder = new BITBOX.TransactionBuilder;

            // original amount of satoshis in vin
            let originalAmount = utxos[0].satoshis;

            // index of vout
            let vout = utxos[0].vout;

            // txid of vout
            let txid = utxos[0].txid;

            // add input with txid and index of vout
            transactionBuilder.addInput(txid, vout);

            // get byte count to calculate fee. paying 1 sat/byte
            let byteCount = BITBOX.BitcoinCash.getByteCount(
                {P2PKH: 1},
                {P2PKH: 1}
            );

            if (originalAmount < byteCount) {
                return Promise.reject(`Insufficient funds. You need at least ${byteCount} satoshi for the fee`);
            }

            // encode some text as a buffer
            let buf = Buffer.from(pictureHash, "hex");
            // create array w/ OP_RETURN code and text buffer and encode
            let data = BITBOX.Script.encode([
                BITBOX.Script.opcodes.OP_RETURN,
                buf
            ]);

            transactionBuilder.addOutput(data, 0);

            // amount to send to receiver. It's the original amount - 1 sat/byte for tx size
            let changeAmount = originalAmount - byteCount;

            // add output w/ address and amount to send
            transactionBuilder.addOutput(wallet.cashAddress, changeAmount);

            let hdnode = BITBOX.HDNode.fromXPriv(wallet.exPriv);
            let keyPair = BITBOX.HDNode.toKeyPair(hdnode);

            // sign w/ HDNode
            let redeemScript = `OP_RETURN ${pictureHash}`;
            transactionBuilder.sign(
                0,
                keyPair,
                redeemScript,
                transactionBuilder.hashTypes.SIGHASH_ALL,
                originalAmount
            );

            // build tx
            let tx = transactionBuilder.build();
            // output rawhex
            let hex = tx.toHex();

            // sendRawTransaction to running BCH node
            return BITBOX.RawTransactions.sendRawTransaction(hex);
        });
    }
}

module.exports = {Broadcaster};