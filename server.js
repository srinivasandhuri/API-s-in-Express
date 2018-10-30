const express = require('express');
const app= express();
const mongoose = require('mongoose');
 const routes = require('./Routes');

app.use(express.json());
app.use(routes);

app.use((req,res,next)=> {
    const error = new Error('Not Found');
    error.status=404;
    next(error);
});
app.use((error,req,res,next)=>{
    res.status(error.status || 500).json({
      message:"technical error"
    });
});


const port = process.env.PORT || 3000;
app.listen(port);


mongoose.connect('mongodb://127.0.0.1:27017/userdb',(err,res)=> {
    if(err) {
        console.log("database not connected");
    }else {
        console.log("database is connected")
    }
})