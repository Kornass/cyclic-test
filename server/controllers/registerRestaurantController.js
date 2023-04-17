const Restaurant = require('../models/restaurant')
const argon2 = require("argon2"); 
const jwt = require("jsonwebtoken");
const validator = require("validator");
const restaurant = require('../models/restaurant');
const jwt_secret = process.env.JWT_SECRET;


const registerRestaurant = async (req,res)=>{
    let {country, city, address,restaurant, name, surname, phone, email, password, password2, filter}= req.body
    const findEmail = await Restaurant.findOne({email})
    const findRestaurant = await Restaurant.findOne({restaurant})
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
        if (findEmail || findRestaurant){
            res.send({ok:true, data:"This email is already registered in Foodies"})
        }
        else{
            const hash = await argon2.hash(password,salt);
            await Restaurant.create({country, city, address,restaurant, name, surname, phone, email, password:hash, filter})
            res.send({ok:true, data:"The restaurant was successfully added"})
        }
    }
    catch(error){
        res.send({ok:false,data:{error}})
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
        // after we send the payload to the client you can see how to get it in the client's Login component inside handleSubmit function
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

module.exports={
    registerRestaurant,
    loginRestaurant,
    verify_tokenRestaurant
}
