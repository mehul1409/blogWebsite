const Router = require('express');
const multer = require('multer');
const path = require('path');

const blog = require('../models/blog');

const router = Router();

const storage = multer.diskStorage({
    destination: function (req,file,cb) {
        cb(null, path.resolve(`./public/images/uploads/`))
    },
    filename: function (req,file, cb) {
        const filename = `${Date.now()}-${file.originalname}`;
        cb(null, filename);
    }
})

const upload = multer({ storage: storage })

router.get('/add-blog', (req, res) => {
    return res.render('addBlog', {
        user: req.user,
    });
})

router.post('/add-blog', upload.single("coverimage"), async (req, res) => {
    const { title, body } = req.body;
    const newblog = await blog.create({ 
        body,
        title,
        createBy: req.user._id,
        coverImageURL:`/uploads/${req.file.filename}`
    });
    return res.redirect(`/blog/${newblog._id}`);
})

module.exports = router 