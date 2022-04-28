const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Welcome To Server')
})

app.listen(port, () => {
    console.log('Your Server is running and the port is http://localhost:', port)
})