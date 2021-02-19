var fs = require("fs");
const multer = require('multer');
const path = require('path');
var config = require("../controlers/config");


//set storge engine
const storge = multer.diskStorage({
    destination: './public/upload',
    filename: function (req, file, cb) {
        cb(null, `${productArray.length == 0 ? 1 :Number(productArray[productArray.length - 1].productID) + 1}-${req.body.productName}-${Date.now()}-${file.originalname}`);
    }
});

//init upload 
const upload = multer({
    storage: storge,
    limits: {
        fileSize: 1000000
    },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single("image");


//check File Type
function checkFileType(file, cb) {
    //allowed exteion
    const fileTypes = /jpeg|jpg|png|gif/;

    //check extetion
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

    //check mime
    const mimeType = fileTypes.test(file.mimetype);

    if (mimeType && extName) {
        return cb(null, true);
    } else {
        cb({
            message: 'Images Only'
        });
    }

}

exports.controler = {
    allproductsView: function (req, res) {
        console.log(req.session);
        res.render("products/productList.ejs", {
            items: productArray,
            reload:false,
           login: req.session.name?'ok':'no',
            errormessage: ""
        })
    },
    productsViewByPage: (req, res) => {

        var lB = ((req.params.id * 6) - 6);
        var uB = (req.params.id * 6);
        if (config.controler.mode == 'devolopment') {
            console.log(req.params.id);
            console.log(lB)
            console.log(uB)
            console.log("productArray.length -> " + productArray.length)
        }
        if ((lB < productArray.length) && (uB <= productArray.length)) {
            var newArray = [];
            var count = 0;
            let obj = {}

            for (var i = lB; i < uB; i++) {
                newArray.push(productArray[i]);
                count++;
                //console.log( productArray[i])
            }
            Object.assign(obj, {
                page: req.params.id,
                imgprepage: count,
                total: productArray.length,
                data: newArray
            })

            res.send(obj)
        } else {
            if ((lB < productArray.length) && (uB > productArray.length)) {
                var newArray = [];
                var count = 0;
                for (var i = lB; i < productArray.length; i++) {
                    newArray.push(productArray[i]);
                    count++;
                }
                let obj = {}
                Object.assign(obj, {
                    page: req.params.id,
                    imgprepage: count,
                    total: productArray.length,
                    data: newArray
                })

                res.send(obj)
            } else {
                if ((lB >= productArray.length)) {
                    res.send({
                        message: "No data"
                    });
                }
            }
        }
        console.log(req.params.id)


    },
    add: (req, res) => {
        upload(req, res, (error) => {
            if (error) {
                res.render('adminindex', {
                    msg: `Error: ${error.message}`,
                    err: true
                });
            } else {
                if (req.file == undefined) {
                    res.render('adminindex', {
                        msg: 'Error: No File Selected',
                        err: 1
                    });
                } else {
                    if (config.controler.mode == 'devolopment') {
                        console.log(req.file);
                        console.log(req.body);
                    }
                    var newqq = {};
                    var id;
                    if (productArray.length == 0) {
                        id = 1;
                    } else {
                        id = Number(productArray[productArray.length - 1].productID) + 1;
                    }
                    if (config.controler.mode == 'devolopment') {
                        console.log('hi -> ' + req.file.filename);
                    }
                    Object.assign(newqq, {
                        productID: `${id}`
                    }, req.body, {
                        productImage: `${req.file.filename}`
                    });

                    // Object.assign(newqq, {
                    //     productImage: `${req.file.filename}`
                    // });

                    productArray.push(newqq);
                    saveProductArrayToFile();

                    if (config.controler.mode == 'devolopment') {
                        console.log(productArray.length)
                    }
                    let obj = {}
                    Object.assign(obj, {
                        page: 1,
                        imgprepage: productArray.length,
                        data: productArray
                    })

                    if (config.controler.mode == 'devolopment') {
                        console.log(obj.data[7])
                    }

                    res.render('adminindex', {
                        msg: 'File Uploaded',
                        err: 0,
                        file: `upload/${req.file.originalname}`
                    });
                }
            }
        });
    },
    delete: (req, res) => {
        var productIndex = productArray.findIndex((item) => item.productID == req.params.id);
        var imageName = '';
        if (productIndex >= 0) {
            imageName = productArray[productIndex].productImage;
            productArray.splice(productIndex, 1);

            saveProductArrayToFile();
            try {
                fs.unlinkSync(`public/upload/${imageName}`);



            } catch (e) {
                res.status(400).send({
                    message: "Error deleting image!",
                    error: e.toString(),
                    req: req.body
                });
            }
            res.send({
                success: "product deleted"
            });
        } else {
            res.send({
                error: "product not found"
            });
        }
    },
    productitem:(req,res) => {
        var productIndex = productArray.findIndex((item) => item.productID == req.params.id);
        res.render("products/product.ejs", {
            item: productArray[productIndex],
            login: req.session.name?'ok':'no',
            errormessage: ""
        })
    }
}


var productArray = [];
if (fs.existsSync("db/product.json")) {
    fs.readFile("db/product.json", function (err, data) {
        productArray = JSON.parse(data);
    });
}

function saveProductArrayToFile() {
    fs.writeFile("db/product.json", JSON.stringify(productArray), function (err) {
        if (err) console.log(err);
    });
}