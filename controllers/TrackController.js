const { TrackModel } = require('../mongoose/models/TrackModal');

const router=require('express').Router();

router.get('/Track/updateCount/:id',async(req,res)=>{
    const id=req.params.id;
    try{
        const databaseResult=await TrackModel.findOneAndUpdate({TrackId :id}, {$inc : {playCount : 1}})
        console.log(res)
        return res.status(200).json({
            isError: false,
            message:databaseResult
        })
    }catch(e){
        return res.status(200).json({
            isError: true,
            message:e.message
        })
    }
})

module.exports={router};                                                                