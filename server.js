const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

// create a GET route
app.put('/picture', (req, res) => {
    res.send(
        {
            transaction_hash: "this will be a transaction hash"
        });
});