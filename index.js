let express=require('express')
let app=express();
let cors=require('cors')
let fs=require('fs');
let path=require('path');
const { dbConnect } = require('./mongoose/connect');
const { upload } = require('./multer');
require('dotenv').config();
const {v4:uuid}=require('uuid');
const { TrackModel:TrackModal } = require('./mongoose/models/TrackModal');
const { router:TrackRouter } = require('./controllers/TrackController');

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended:true}));


dbConnect();
app.use(TrackRouter);

let songs=['kinkin.mp3','hass.mp3','soft.mp3']
app.get('/',(req,res)=>{
    res.send('hello')
})
app.get('/getTracks',(req,res)=>{
    res.send(songs);
})
app.get('/sendImage/:filename',(req,res)=>{
    let {filename}=req.params  
    console.log(filename) 
    var options = {
        root: path.join(__dirname,`/upload/image/`),
        dotfiles: 'deny',
        headers: {
          'x-timestamp': Date.now(),
          'x-sent': true
        }
      }
    res.sendFile(filename,options,(err)=>{
        console.log(err);
    })

})

app.get('/audioTrack/:filename',(req,res)=>{
    let {filename}=req.params;
    let audioFilePath=path.join(__dirname,`upload/audio/${filename}`)
    
    const stat = fs.statSync(audioFilePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

        const chunkSize = (end - start) + 1;
        const file = fs.createReadStream(audioFilePath, { start, end });
        const headers = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'audio/mpeg',
        };

        console.log(file)
        res.writeHead(206, headers);
        file.pipe(res);
    } else {
        const headers = {
        'Content-Length': fileSize,
        'Content-Type': 'audio/mpeg',
        };
        res.writeHead(200, headers);
        fs.createReadStream(audioFilePath).pipe(res);
    }
})



app.post('/api/tracks',upload.any(),async (req,res)=>{
    try{
        let data=req.body;
        let files=req.files;

        const genres=JSON.parse(data.selectedGenre);
        const artists=JSON.parse(data.selectedArtist);
        const trackAttributes=JSON.parse(data.trackattributes);

        const TrackModel=new TrackModal();

        TrackModel.TrackId=uuid();

        TrackModel.Title=trackAttributes.title;
        TrackModel.ReleaseDate=trackAttributes.releaseDate;
        TrackModel.Language=trackAttributes.language;

        TrackModel.Artist=artists;
        TrackModel.Genre=genres;

        TrackModel.FileImageAttributes.FileName=files[0].filename
        TrackModel.FileImageAttributes.OriginalName=files[0].originalname
        TrackModel.FileImageAttributes.FilePath=files[0].path

        TrackModel.FileAudioAttributes.FileName=files[1].filename;
        TrackModel.FileAudioAttributes.OriginalName=files[1].originalname;
        TrackModel.FileAudioAttributes.FilePath=files[1].path;


        await TrackModel.save();

        console.log(TrackModel)                                                                                                                                                                                                             

        return res.json({
            isError: false,
            message:"files Uploaded successfully"
        });
    }catch(e){
        console.log(e)
        return res.json({
            isError: true,
            message:e.message
        })
    }
})


app.listen(5000,(PORT)=>{
    console.log(`server running on 5000`)
})