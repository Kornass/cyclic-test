const Orders = require('../models/order')
const Menu = require('../models/menu')
const ObjectId= require ('mongoose').Types.ObjectId
const Restaurant = require('../models/restaurant')
const Customer = require('../models/customer')

const addOrder = async (req,res)=>{
    let {email, restaurant, quantity, menu, totalPrice}= req.body    
    try{
        const findCustomer = await Customer.findOne({email})
        await Orders.create({restaurant, quantity, menu, totalPrice, customer_id: new ObjectId(findCustomer._id)})
        res.json({ok:true, message:"The order was successfully created"})        
    }
    catch(error){
        res.json({ok:false,message:{error}})
    }
}

module.exports={
    addOrder,
}

