const {Schema,model}=require('mongoose')


const GenreSchema=new Schema({
        genreId:{
            type:String,
            required:true
        },
        genreName:{
            type:String,
            required:true,
            trim:true,
            lowercase:true
        }
},{ timestamps: true },);



const GenreModel=model("Genre",GenreSchema)

module.exports = {GenreModel}