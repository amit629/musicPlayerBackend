

const {Schema,model}=require('mongoose')

const TrackSchema=new Schema({
    TrackId:{
        type:String,
        required:true,
        trim:true
    },Title:{
        type:String,
        required:true,
        trim:true
    },Artist:{
        type:[String],
    },Album:{
        type:String,
        trim:true
    },Genre:{
        type:[String],
        required:true
    },Language:{
        type:String,
        required:true,
        trim:true
    },Duration:{
        type:String,
        trim:true
    },ReleaseDate:{
        type:String,
        required:true
    },FileImageAttributes:{
        FileName:{
            type:String,
            required:true,
            trim:true,
        },
        OriginalName:{
            type:String,
            required:true,
            trim:true,
        },FilePath:{
            type:String,
            required:true,
            trim:true
        }
    },FileAudioAttributes:{
        FileName:{
            type:String,
            require:true,
            trim:true
        },
        OriginalName:{
            type:String,
            required:true,
            trim:true
        },FilePath:{
            type:String,
            required:true,
            trim:true
        }
    },  Rating:{
        type:Number,
        default:0
    },playCount:{
        type:Number,
        default:0
    }

},{ timestamps: true },);

const TrackModel=model("TrackData",TrackSchema) 

module.exports={TrackModel};