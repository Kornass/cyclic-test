const Customer = require('../models/customer')
const argon2 = require("argon2"); 
const jwt = require("jsonwebtoken");
const validator = require("validator");
const jwt_secret = process.env.JWT_SECRET;


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

const registerCustomer = async (req,res)=>{
    let {name,email,password, password2, address,admin}= req.body
    const salt = "corazones429"
    const findEmail = await Customer.findOne({email})
    if (!email || !password || !password2){
        return res.json({ ok: false, message: "All fields required" });
      }
      if (password !== password2){
        return res.json({ ok: false, message: "Passwords must match" });
      }
      if (!validator.isEmail(email)){
        return res.json({ ok: false, message: "Invalid email" });
      }
    try{
        if (findEmail){
            res.send({ok:true, data:"This email is already registered in Foodies"})
        }
        else{
            const hash = await argon2.hash(password,salt);
            await Customer.create({name,email,password:hash, address, admin})
            res.send({ok:true, data:"The customer was successfully added"})
        }
    }
    catch(error){
        res.send({ok:false,data:{error}})
    }
}

const loginCustomer = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password){
      return res.json({ ok: false, message: "All fields are required" });
    }
    if (!validator.isEmail(email)){
      return res.json({ ok: false, message: "Invalid email provided" });
    }
    try {
      const customer = await Customer.findOne({ email });
      if (!customer) return res.json({ ok: false, message: "Invalid email provided" });
      const match = await argon2.verify(customer.password, password);
      if (match) {
        const token = jwt.sign({userEmail:customer.email}, jwt_secret, { expiresIn: "1h" }); 
        res.json({ ok: true, message: "welcome back", token, email });
      } else return res.json({ ok: false, message: "Invalid data provided" });
    } catch (error) {
      res.json({ ok: false, error });
    }
  };

  const verify_tokenCustomer = (req, res) => {
    const token = req.headers.authorization;
    jwt.verify(token, jwt_secret, (err, succ) => {
      err
        ? res.json({ ok: false, message: "Token is corrupted" })
        : res.json({ ok: true, succ });
    });
  };



module.exports={
    removeCustomer,
    updateCustomer,
    loginCustomer,
    registerCustomer,
    loginCustomer,
    verify_tokenCustomer
}