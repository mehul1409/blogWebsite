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
   try{
    const token = await user.matchedPasswordAndGenerateToken(email,password);
    return res.cookie("token",token).redirect('/');
   }catch(error){
        return res.render('signin',{
            error:'Incorrect Password or Email',
        });
   }
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

router.get('/logout',(req,res)=>{
    res.clearCookie("token").redirect('/');
})

module.exports = router;