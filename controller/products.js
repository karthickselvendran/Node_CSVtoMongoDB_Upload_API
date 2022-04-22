const express = require("express");
const router = express.Router();
const Products = require('../schema/products');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname)
    }
})

const upload = multer({ storage: storage });

router.post('/csv', upload.single('file'), async function (req, res) {
    const products = await Products.find();
    let array = [];
    let product;
    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (row) => {
            array.push(row);
        })
        .on('end', async () => {
            console.log(array)
            let sucessTotal = 0;
            let updateResult = [];
            for (let i = 0; i < array.length; i++) {
                if (
                    !array[i].name ||
                    !array[i].type ||
                    !array[i].price
                ) {
                    updateResult.push({
                        status: 0,
                        query: "Some Details Are Missing - Row: " + (i + 1)
                    })
                }
                else {
                    try {
                        product = products.find(el => el.name === array[i].name)
                        if (!product) {
                            const productDetails = new Products({ ...array[i] });
                            await productDetails.save()
                        } else {
                            await Products.updateOne({ _id: product._id }, { ...array[i] });
                        }
                        sucessTotal++;
                        updateResult.push({
                            status: 1,
                            query: "Updated Sucess - Row: " + (i + 1)
                        })
                    } catch (error) {
                        return res.status(400).json({ err: error.message })
                    }
                }
            }
            res.json({ updateResult, sucessTotal });
        })
})

module.exports = router;
