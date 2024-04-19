const {Schema,model}=require('mongoose')


const ArtistSchema=new Schema({
        artistId:{
            type:String,
            required:true
        },
        artistName:{
            type:String,
            required:true,
            trim:true,
            lowercase:true
        }
},{ timestamps: true },);

const ArtistModel=model("Artist",ArtistSchema) 
module.exports = {ArtistModel}