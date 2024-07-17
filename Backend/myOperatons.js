/*calling another api from another api body */

import express from "express";

import axios from "axios";

const app=express();

app.listen("3000",()=>{
    console.log("server is running on port 3000");
});

app.get("/getUsers",(req,res)=>{

        res.send("jay ganesh");

})


app.get("/getShubham",async (req,res)=>{

    const url="http://localhost:3000/getUsers";
    const user=await axios.get(url);   // calling app.get("/getUsers",...) api

    console.log("calling get shubham");
    console.log(user.data);
    res.send(user.data);

})
