const Customer = require('../models/customer')


const removeCustomer = async (req,res)=>{
    let {email}= req.body /* the email of the logged in customer*/
    const findEmail = await Customer.findOne({email})
    try{
        if (findEmail){
            await Customer.deleteOne({email})
            res.send({ok:true, data:"The customer was successfully removed"})
            
        }
        else{
            res.send({ok:true, data:"This email is not registered in Foodies"})
        }
    }
    catch(error){
        res.send({ok:false,data:{error}})
    }
}

const updateCustomer = async (req,res)=>{
    let {newName, email, newEmail, newPassword, newAddress}= req.body 
    const findEmail = await Customer.findOne({email})
    try{
        if (!findEmail){
            res.send({ok:true, data:"This email is not registered in Foodies"})
        }
        else{
            await Customer.findOneAndUpdate({email}, {name: newName, email: newEmail, password:newPassword,address:newAddress})
            res.send({ok:true, data:"The customer was successfully updated"})   
        }
    }
    catch(error){
        res.send({ok:false,data:{error}})
    }
}

const loginCustomer = async (req,res)=>{
    let {newName, email, newEmail, newPassword, newAddress}= req.body 
    const findEmail = await Customer.findOne({email})
    try{
        
    }
    catch(error){
        res.send({ok:false,data:{error}})
    }
}



module.exports={
    removeCustomer,
    updateCustomer,
    loginCustomer,
}