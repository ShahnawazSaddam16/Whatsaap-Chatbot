require("dotenv").config();
const express = require("express");
const webhookRoutes = require("./routes/webhook");

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req,res)=>{
  res.status(200).send("Server Running Successfully");
});

app.use("/webhook", webhookRoutes);

app.listen(PORT,(err)=>{
  if(err){
    console.log(err);
  } else{
    console.log(`Server Running at ${PORT}`);
  }
});