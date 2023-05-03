const express = require("express"),
  app = express(),
  mongoose = require("mongoose");
require("dotenv").config();
mongoose.set("debug", true);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(require("cors")());

const path = require("path");

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, "../client/build")));

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

async function connecting() {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to the DB");
  } catch (error) {
    console.log(
      "ERROR: Seems like your DB is not running, please start it up !!!"
    );
  }
}
connecting();

app.use("/customer", require("./routes/customerRoute"));
app.use("/restaurant", require("./routes/restaurantRoute"));
app.use("/menu", require("./routes/menuRoute"));
app.use("/verify_token", require("./routes/verify_token"));
app.use("/order", require("./routes/orderRoute"));
app.use("/payment", require("./routes/paymentRoute"));
app.use("/pictures", require("./routes/picturesRoute"));

app.listen(4000, () => console.log(`listening on port 4000`));
