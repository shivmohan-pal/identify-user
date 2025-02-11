const ErrorHandler = (err,_,res,next)=>{
    const message = err.message || "Internal Server Error";
    const status = err.status || 500;
    res.send({status,message});
   }
   
   module.exports = {
       ErrorHandler
   }