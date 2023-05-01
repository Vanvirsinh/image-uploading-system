const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// Passing necessary middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));


// ejs setup
app.set('view engine', 'ejs');


// Storage engine set-up
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});


// Check file type
function fileType(file, cb) {
    const filetypes = /png|jpg|jpeg/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
        return cb(null, true)
    } else {
        cb("Please upload images only")
    }
}


// Multer middleware
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        fileType(file, cb)
    }
}).any();


// Get route
app.get('/', (req, res) => {
    fs.readdir('./public/images', (err, files) => {
        if (err) throw err;
        res.render('index', {
            images: files
        });
    });
});


// Post routes
app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err || req.files.length == 0) {
            res.statusMessage = 'No Images selected!';
            res.status(401).end();
        } else {
            res.status(201).send('Images uploaded successfully.');
        }
    });
});

app.post('/delete', (req, res) => {

    const images = req.body.selectedImageToRemove;

    if (images == "") {
        res.statusMessage = 'No images were selected to delete!';
        res.status(401).end();
    } else {
        images.forEach(image => {
            fs.unlinkSync("./public/images/" + image);
        });
        res.status(201).send('Images are deleted successfully.');
    }

});


// port configuration
const port = process.env.PORT || 3000;

app.listen(port, (err) => {
    if (err) throw err;
    console.log(`The server is running on the port ${port}...`);
});
