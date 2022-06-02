const express = require('express')


const PORT = process.env.PORT || 4000
const app = express()

app.use(express.json())
app.use(require('./route/route.js'))

app.listen(PORT, () => {
    console.log("server started at"+PORT)
})