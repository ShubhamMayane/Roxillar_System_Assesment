import express from "express";
import mongoose, { modelNames, mongo } from "mongoose";
import bodyParser from "body-parser";
import axios from "axios";




/* Database related logic --start*/

//1.to connect with the databse

mongoose.connect("mongodb://localhost:27017/StockDB");


//2.creating a schema or structure of a document in collection

const stockSchema=new mongoose.Schema({

        id:Number,
        title:String,
        price:Number,
        description:String,
        category:String,
        image:String,
        sold:Boolean,
        dateOfSale:String
});


//3.Logic to create a model
const stockModel=mongoose.model("stockCollection",stockSchema);

//4.logic to insert a valid sample document inside the collection

// const data=new stockModel({
//     "id": 1,
//     "title": "Fjallraven Foldsack No 1 Backpack Fits 15 Laptops",
//     "price": 329.85,
//     "description": "Your perfect pack for everyday use and walks in the forest. Stash your laptop up to 15 inches in the padded sleeve your everyday",
//     "category": "men's clothing",
//     "image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
//     "sold": false,
//     "dateOfSale": "2021-11-27T20:29:54+05:30"
//     });

//     data.save();






/* Database related logic --end*/



//api realated logic--start
const app=express();




app.listen(5000,()=>{

    console.log("server application is running on port 5000");
})



app.get("/",(req,res)=>{

    res.send("Jay Ganesh");
});


app.get("/getDataSource",async(req,res)=>{


    //logic to get data from another server and fill that data inside our database
    try
    {
            const response=await axios.get("https://s3.amazonaws.com/roxiler.com/product_transaction.json");

            const dataFromApi=response.data;

            console.log(dataFromApi);

            res.send(dataFromApi);


            //logic to insert all data came from api in our database

            //1.delete all existing documents in our stockCollection collection.

            let status= await stockModel.deleteMany({});

            if(await(status).deletedCount==0)
            {
                console.log("collection is empty no document is available for remove");
            }
            else if(await(status).deletedCount>0)
            {
                    console.log("All documents are removed from collection");
            }
            //2.now lets fill the data returned by the api

            stockModel.insertMany(dataFromApi).then(function(){

                console.log("data is inserted successfully....");

            }).catch(function(err){
                console.log(err);
            })




    }
    catch(err)
    {
        console.log(err);
    }



});




app.get("/getTransactions",(req,res)=>{

    let inputMonth=parseInt(req.query.month);

    console.log(inputMonth);

    stockModel.find({}).then((data)=>{


        // console.log(data);
        // res.send(data);
        //to get a document of specific month only
        
        let date;
        let month;


      let finalData = data.filter((element)=>{

        date=new Date(element.dateOfSale);

        
        month=date.getMonth();

       
        if(month==(inputMonth-1))
        {   
            // console.log(element.dateOfSale);
            // console.log(date+"  "+"  "+month);
            return true;
        }else
        {
            return false;
        }
        
        })

        res.send(finalData);


});

});




app.get("/getStatistics",(req,res)=>{

    let inputMonth=parseInt(req.query.month);

    console.log(inputMonth);


    try{
        stockModel.find({}).then((data)=>{


            // console.log(data);
            // res.send(data);
            //to get a document of specific month only
            
            let date;
            let month;
    
    
          let finalData = data.filter((element)=>{
    
            date=new Date(element.dateOfSale);
    
            
            month=date.getMonth();
    
           
            if(month==(inputMonth-1))
            {   
                // console.log(element.dateOfSale);
                // console.log(date+"  "+"  "+month);
                return true;
            }else
            {
                return false;
            }
           
            })
    
    
            //logic to get total sale of specific month
            let totalSale=0;
            let totalSoldItem=0;
            let totalUnSoldItem=0;
    
            for(let i=0;i<finalData.length;i++)
            {
                if(finalData[i].sold==true)
                {
                    totalSale=totalSale+finalData[i].price;
                    totalSoldItem++;
                }
                else
                {
                    totalUnSoldItem++;
                }
                
            }
            
            let finalRes={
                TotalSale:totalSale,
                TotalSoldItem:totalSoldItem,
                totalUnSoldItem:totalUnSoldItem
            }
            console.log(finalRes);
    
            res.send(finalRes);
    })

    }
    catch(err)
    {
        console.log(err);
        res.sendStatus(404);
    }
    
});



app.get("/getBarChartData",(req,res)=>{

    let inputMonth=parseInt(req.query.month);
    let obj;

    console.log(inputMonth);


   //start--1.first lets create response data structure
    let responseData=[];
    
    var i=0;

    while(i<900)
    {
        //for first element only
       
        if(i==0)
        {
            obj={
                startRange:i,
                endRange:i+100,
                items:[]
            }
            responseData.push(obj);
            i=i+101;
            
        }
        else
        {
            obj={
                startRange:i,
                endRange:i+99,
                items:[]
            }
            responseData.push(obj);
            i=i+100;


        }
       


    }

    //inserting last element in responseData array

    responseData.push({
                startRange:901,
                endRange:"infinity",
                items:[]
            });
   

    console.log(responseData);


       //end:-- 1.first lets create response data structure

    stockModel.find({}).then((data)=>{


                let date;
                let month;


                let finalData = data.filter((element)=>{

                date=new Date(element.dateOfSale);

                
                month=date.getMonth();

            
                if(month==(inputMonth-1))
                {   
                    // console.log(element.dateOfSale);
                    // console.log(date+"  "+"  "+month);
                    return true;
                }else
                {
                    return false;
                }
            
                })


                //now lets add the elements in the response data structure 
                
                let itemPrice=0;
                for(let i=0;i<finalData.length;i++)
                {
                       itemPrice=finalData[i].price;

                       if(itemPrice>=0 && itemPrice<=100)
                        {
                            responseData[0].items.push(finalData[i]);
                        }
                        else if(itemPrice>=101 && itemPrice<=200)
                        {
                            responseData[1].items.push(finalData[i]);
                        }
                        else if(itemPrice>=201 && itemPrice<=300)
                        {
                            responseData[2].items.push(finalData[i]);
                        }
                        else if(itemPrice>=301 && itemPrice<=400)
                        {
                            responseData[3].items.push(finalData[i]);
                        }
                        else if(itemPrice>=401 && itemPrice<=500)
                        {
                            responseData[4].items.push(finalData[i]);
                        }
                        else if(itemPrice>=501 && itemPrice<=600)
                        {
                            responseData[5].items.push(finalData[i]);
                        }
                        else if(itemPrice>=601 && itemPrice<=700)
                        {
                            responseData[6].items.push(finalData[i]);
                        }
                        else if(itemPrice>=701 && itemPrice<=800)
                        {
                            responseData[7].items.push(finalData[i]);
                        }
                        else if(itemPrice>=801 && itemPrice<=900)
                        {
                            responseData[8].items.push(finalData[i]);
                        }
                        else if(itemPrice>=901)
                        {
                            responseData[9].items.push(finalData[i]);
                        }
                }
                
                res.send(responseData);



    });




})




app.get("/getByCategory",(req,res)=>{

  
    let inputMonth=parseInt(req.query.month);

        


    stockModel.find({}).then((data)=>{

        //to get a document of specific month only
        
        let date;
        let month;
    
    //filtering out the data according to month

      let finalData = data.filter((element)=>{

        date=new Date(element.dateOfSale);

        
        month=date.getMonth();

       
        if(month==(inputMonth-1))
        {   
            // console.log(element.dateOfSale);
            // console.log(date+"  "+"  "+month);
            return true;
        }else
        {
            return false;
        }
       
        });


        // console.log(finalData);
        //lets create a responsedata structure---start
        let responseData={};

        for(let i=0;i<finalData.length;i++)
        {
           
            
            if(finalData[i].category in responseData ==true) //to checj key is exist or not
            {
                continue;
            }
            else
            {
                    //logic to add new key in object
                    responseData[finalData[i].category]=0;
            }
           
                  
           
           
        }

        console.log(responseData);

        //lets create a responsedata structure---end

        //now lets fill the data in the resonseData

        let category="";
        for(let i=0;i<finalData.length;i++)
        {   

                category=finalData[i].category;
                console.log(category)
                // console.log(responseData[category]);//to access the value of key using the value inside variable name
                
                responseData[category]=responseData[category]+1;
        }
    

            res.send(responseData);
    });

});


app.get("/getCombineData",async (req,res)=>{


    let inputMonth=parseInt(req.query.month);

    //lets create a response data structure
    let resData={}


    
    //getting a categories
    const alltransactions=await axios.get("http://localhost:5000/getTransactions?month="+ inputMonth);
     //adding a key valu pair in resData js object
    resData["AllTransactions"]=alltransactions.data;

    //getting a categories
    const Statastics=await axios.get("http://localhost:5000/getStatistics?month="+ inputMonth);
     //adding a key valu pair in resData js object
    resData["Statastics"]=Statastics.data;


    //getting a categories
    const categories=await axios.get("http://localhost:5000/getByCategory?month="+inputMonth);
    //adding a key valu pair in resData js object
    resData["categoryWiseCount"]=categories.data;
    
      //getting a categories
      const barChartData=await axios.get("http://localhost:5000/getBarChartData?month="+inputMonth);
      //adding a key valu pair in resData js object
      resData["barChartData"]=barChartData.data;


  
    res.send(resData);
})


//api realated logic--end

