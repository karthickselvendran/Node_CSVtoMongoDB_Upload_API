const express = require('express');
const router = express.Router();
const Orders = require('../schema/orders');
const Customers = require('../schema/users');

router.post('/createOrder', async (req, res) => {
    try {
        const { customerName, mobileNumber } = req.user
        const { productId, productQuantity } = req.body

        let count = await Orders.find().countDocuments();

        let order = new Orders({
            orderId: count + 1,
            customerName,
            mobileNumber,
            productId,
            productQuantity
        })
        await order.save()
        return res.status(200).json({
            status: 200,
            message: "success"
        })
    } catch (error) {
        return res.json({
            message: error.message
        })
    }
})

router.put('/updateOrder/:id', async (req, res) => {

    try {
        const { id } = req.params;
        const { productId, productQuantity } = req.body;

        await Orders.updateOne({ orderId: id }, { productId, productQuantity });

        return res.status(200).json({
            message: "updated successfully!"
        })
    } catch (error) {
        return res.json({
            message: error.message
        })
    }
})

router.put('/cancelOrder/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Orders.updateOne({ orderId: id }, { status: false });
        return res.status(200).json({
            message: "Order cancelled!"
        })
    } catch (error) {
        return res.json({
            message: error.message
        })
    }
})

router.get('/getOrders', async (req, res) => {
    const { orderId = "", customerName = "", mobileNumber = "", startTime = "", endTime = "", sort = "asc" } = req.query;
    let searchCondtions = [];
    let filterConditions = [];

    if (orderId) {
        searchCondtions.push({ orderId })
    }
    if (customerName) {
        searchCondtions.push({ customerName })
    }
    if (mobileNumber) {
        searchCondtions.push({ mobileNumber })
    }
    if (startTime && endTime) {
        searchCondtions.push({ date: { $gte: startTime, $lt: endTime } })
    }
    if (sort) {
        filterConditions.push({ createdAt: sort === "desc" ? "desc" : "asc" })
    }
    try {
        const orders = await Orders.find(...searchCondtions).sort(...filterConditions);
        return res.status(200).json({
            OrdersList: orders
        })
    } catch (error) {
        return res.json({
            message: error.message
        })
    }
})

router.get('/customerPurchasedCounts', async (req, res) => {
    try {
        const customersData = await Customers.find().select({ customerName: 1 });

        const ordersData = await Orders.find({ status: true })

        const customerPurchasedCounts = customersData.map((data) => {
            let matchingOrders = ordersData.filter((item) => item.customerName === data.customerName)
            if (matchingOrders.length)
                return {
                    customerName: data.customerName,
                    purchasedCounts: matchingOrders.reduce((preValue, currValue) => preValue + currValue.productQuantity, 0)
                }
        })
        return res.status(200).json({
            customerPurchasedCounts
        })
    } catch (error) {
        return res.json({
            message: error.message
        })
    }
})

module.exports = router;