const { Router } = require('express');
const user = require("../models/user.js");

const router = Router();

router.get('/signin', (req, res) => {
    return res.render('signin.ejs');
});

router.get('/signup', (req, res) => {
    return res.render('signup.ejs');
});

router.post('/signin', async (req,res)=>{
    const {email , password} = req.body;
    await user.matchedPassword(email,password)

    return res.redirect('/');
})

router.post('/signup', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    await user.create({
        firstName,
        lastName,
        email,
        password,
    });
    return res.redirect('/');
});


module.exports = router;