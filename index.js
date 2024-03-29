const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')

const blog = require('./models/blog.js');

const userRoute = require('./routes/user.js');
const blogRoute = require('./routes/blog.js');

const { checkForAuthenticationCookie } = require('./middlewares/authentication.js');

const app = express();
const PORT = 8000;

mongoose.connect('mongodb://127.0.0.1:27017/blogWebsite').then(() => { console.log('Mongodb connected!') }).catch((err) => { console.log(err) })

app.set('view engine', 'ejs');
app.set('views', path.resolve("./views"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve('/public')));

app.get('/', async (req, res) => {
    const allBlogs = await blog.find({});
    res.render("home",{
        user:res.user,
        blogs:allBlogs,
    });
})

app.use('/user', userRoute);
app.use('/blog', blogRoute);


app.listen(PORT, (err) => {
    if (err) {
        console.log(`Error:${err}`);
    } else {
        console.log(`Server is started at PORT:${PORT}`);
    }
})
