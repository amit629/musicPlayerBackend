const { TrackModel } = require('../mongoose/models/TrackModal');
const { upload } = require('../multer');
let fs=require('fs');
let path=require('path');
const router=require('express').Router();
const {v4:uuid}=require('uuid');
const { GenreModel } = require('../mongoose/models/Genre');
const { ArtistModel } = require('../mongoose/models/Artists');


router.get('/api/tracks', async (req, res) => {
    try {
        let tracks = await TrackModel.find({}).limit(5);
        res.json({
            isError:false,
            message:'Tracks Fetched successfully',
            tracksData: tracks
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ isError:true,message: 'Server Error' });
    }
});
router.get('/api/tracks/artist', async (req, res) => {
    try {
        let artistData = await ArtistModel.find({});
        res.json({
            isError: false,
            artists: artistData
        });
    } catch (err) {
        console.error(err);
        res.json({ isError: true, Message: err.message });
    }
});
router.post('/api/tracks/artist', async (req, res) => {
    try {
        const { name } = req.body;
        
        if (!name) {
            return res.json({
                isError: true,
                message: "Please provide an artist name"
            });
        }

        const artist = new ArtistModel({
            artistId: uuid(),
            artistName: name
        });

        let resp = await artist.save();

        if (resp.errors) {
            return res.json({
                isError: true,
                message: resp.errors
            });
        }

        return res.json({
            isError: false,
            message: resp
        });

    } catch (err) {
        console.error(err);
        return res.json({
            isError: true,
            message: 'Server Error'
        });
    }
});

router.get('/api/tracks/genre', async (req, res) => {
    try {
        let genres = await GenreModel.find({});
        return res.json({
            genres: genres
        });
    } catch (err) {
        console.error(err);
        return res.json({
            isError: true,
            message: 'Server Error'
        });
    }
});

router.post('/api/tracks/genre', async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.json({
                isError: true,
                message: "Please provide a genre name"
            });
        }

        const genre = new GenreModel({
            genreId: uuid(),
            genreName: name
        });

        let resp = await genre.save();

        if (resp.errors) {
            return res.status(400).json({
                isError: true,
                message: resp.errors
            });
        }

        return res.json({
            isError: false,
            message: resp
        });

    } catch (err) {
        console.error(err);
        return res.json({
            isError: true,
            message: 'Server Error'
        });
    }
});
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

router.get('/sendImage/:filename',(req,res)=>{
    let {filename}=req.params  
    console.log(process.cwd())
    console.log(__dirname)
    console.log(filename) 
    var options = {                     
        root: path.join(process.cwd(),`/upload/image/`),
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

router.get('/audioTrack/:filename',(req,res)=>{
    let {filename}=req.params;
    let audioFilePath=path.join(process.cwd(),`upload/audio/${filename}`)
    
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



router.post('/api/tracks',upload.any(),async (req,res)=>{
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


router.get('/Tracks/getTrackByQuery',(req,res)=>{
    console.log(req.query)
    return res.json(req.query)
})

module.exports={router};                                                                