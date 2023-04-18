const Restaurant = require('../models/restaurant')
const argon2 = require("argon2"); 
const jwt = require("jsonwebtoken");
const validator = require("validator");
const restaurant = require('../models/restaurant');
const jwt_secret = process.env.JWT_SECRET;


const removeRestaurant = async (req,res)=>{
    let {email}= req.body /* the email of the logged in restaurant*/
    
    try{
        const findEmail = await Restaurant.findOne({email})
        if (findEmail){
            await Restaurant.deleteOne({email})
            await Menu.find({restaurant_id:findEmail._id}).delete()
            res.send({ok:true, message:"The restaurant was successfully removed"})
        }
        else{
            res.send({ok:true, message:"This email is not registered in Foodies"})
        }
    }
    catch(error){
        res.send({ok:false,message:{error}})
    }
}


const updateRestaurant = async (req,res)=>{
    let {newCountry, newCity, newAddress, newRestaurant, newName, newSurname, newPhone, email, newEmail, newPassword, newFilter}= req.body 
   
    try{
        const findEmail = await Restaurant.findOne({email})
        if (!findEmail){
            res.send({ok:true, message:"This email is not registered in Foodies"})
        }
        else{
            await Restaurant.findOneAndUpdate({email}, {country: newCountry, city: newCity, address: newAddress, restaurant: newRestaurant, name: newName, surname: newSurname, phone: newPhone, email: newEmail, password:newPassword, filter: newFilter})
            res.send({ok:true, message:"The restaurant was successfully updated"})   
        }
    }
    catch(error){
        res.send({ok:false,message:{error}})
    }
}

const registerRestaurant = async (req,res)=>{
    let {country, city, address,restaurant, name, surname, phone, email, password, password2, filter}= req.body
    const salt = "corazones429"

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
        const findEmail = await Restaurant.findOne({email})
        const findRestaurant = await Restaurant.findOne({restaurant})
        if (findEmail || findRestaurant){
            res.send({ok:true, message:"This email is already registered in Foodies"})
        }
        else{
            const hash = await argon2.hash(password,salt);
            await Restaurant.create({country, city, address,restaurant, name, surname, phone, email, password:hash, filter})
            res.send({ok:true, message:"The restaurant was successfully added"})
        }
    }
    catch(error){
        res.send({ok:false,message:{error}})
    }
}

const loginRestaurant = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password){
      return res.json({ ok: false, message: "All fields are required" });
    }
    if (!validator.isEmail(email)){
      return res.json({ ok: false, message: "Invalid email provided" });
    }
    try {
      const restaurant = await Restaurant.findOne({ email });
      if (!restaurant) return res.json({ ok: false, message: "Invalid email provided" });
      const match = await argon2.verify(restaurant.password, password);
      if (match) {
        const token = jwt.sign({userEmail:restaurant.email}, jwt_secret, { expiresIn: "1h" }); 
        res.json({ ok: true, message: "welcome back", token, email });
      } else return res.json({ ok: false, message: "Invalid data provided" });
    } catch (error) {
      res.json({ ok: false, error });
    }
  };

  const verify_tokenRestaurant = (req, res) => {
    const token = req.headers.authorization;
    jwt.verify(token, jwt_secret, (err, succ) => {
      err
        ? res.json({ ok: false, message: "Token is corrupted" })
        : res.json({ ok: true, succ });
    });
  };

  const displayAllRestaurant = async (req,res)=>{
    try{
        const restaurants = await Restaurant.find()
        res.send({ok:true, message:restaurants})   
        }
    catch(error){
        res.send({ok:false,message:{error}})
    }
}

const displayFilterRestaurant = async (req,res)=>{
    let {restaurant}= req.params 
    try{
        const restaurants = await Restaurant.find({restaurant})
        res.send({ok:true, message:restaurants})
        console.log(restMenu)   
        }
    catch(error){
        res.send({ok:false,message:{error}})
    }
}


module.exports={
    removeRestaurant,
    updateRestaurant,
    registerRestaurant,
    loginRestaurant,
    verify_tokenRestaurant,
    displayAllRestaurant,
    displayFilterRestaurant 
}