const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const userRoute = require('./routes/user.js');

const app = express();
const PORT = 8000;

mongoose.connect('mongodb://127.0.0.1:27017/blogWebsite').then(() => { console.log('Mongodb connected!') }).catch((err) => { console.log(err) })

app.set('view engine', 'ejs');
app.set('views', path.resolve("./views"));
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.render("home");
})

app.use('/user', userRoute);

app.listen(PORT, (err) => {
    if (err) {
        console.log(`Error:${err}`);
    } else {
        console.log(`Server is started at PORT:${PORT}`);
    }
})
