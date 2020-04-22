const express = require('express');
require('dotenv').config();
const app = express();
const authCtrl = require('./controllers/auth')
const {PORT: SERVER_PORT} = process.env
let session = null

app.get('/api/login', authCtrl.login)
app.get('/api/logout', authCtrl.logout)
app.get('/api/market/search', authCtrl.getMarketInfo)
app.get('/api/market/history', authCtrl.getMarketHistory)
app.get('/api/market/spread', authCtrl.getMarketSpread)
app.get('/api/interval', authCtrl.testSetInterval)

app.listen(SERVER_PORT, () => console.log('listening on', SERVER_PORT))
