const axios = require('axios');
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const qs = require('qs');
const mongo = require('mongodb');
const path = require('path');


const app = express();
const server = http.createServer(app);
const mongoClient = mongo.MongoClient;


// Setting up our mongo database
const dbUrl = process.env.MONGODB_URI;
const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology:true
};

let database;
let memeCollection;
mongoClient.connect(dbUrl, dbOptions, (err, db) => {
    if(err) throw err;
    console.log("Database created");

    const specificDatabase = db.db("memedb");
    specificDatabase.createCollection("memes", (error, dbb) => {
        if (error) throw error;
        console.log("Meme collection created.");
    });

    database = specificDatabase;
    memeCollection = specificDatabase.collection("memes");
});

function sendToMemeDatabase(fields) {
    memeCollection.insertOne(fields, (err, res) => {
        if (err) throw err;
    });
}

function populateMemeFields(photoURL, topText, bottomText, user){
    let memeobj = {
        photoURL: photoURL,
        topText: topText,
        bottomText: bottomText,
        user: user,
        likes: 0,
        isBolded: false
    };

    return memeobj;
}

// Server will always find an open port.
const port = process.env.PORT || 3001;
server.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on port ${port}`);
});

// Needed to process body parameters for POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'build')));


// TODO: Create an API endpoint using any of the APIs from the 
// https://github.com/public-apis/public-apis. Use this as an opportunity
// to learn how to use unfamiliar APIs (I'd recommend finding one that 
// does not require an API key).
app.get('/doggo', (req, res) => {
    const doggoUrl = 'https://random.dog/woof.json'
    axios.get(doggoUrl).then(response => {
        res.send(response.data.url);
    });
});

app.get('*', function(req,res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


// TODO: Create an API endpoint called /bestmeme to grab the first meme given from the 
// get_memes endpoint for the api.imgflip.com host.
app.get('/bestmeme', (req, res) => {
    const url = 'https://api.imgflip.com/get_memes';
    axios.get(url).then(response => {
        res.send(response.data.data.memes[0]);
    });
});

app.post('/upload', (req, res) => {
    // HINT: First step is to understand the imgflip API and make an object
    // that will be inputted in the caption_image endpoint from imgflip.
    //console.log(req.body.template_id)

    const apiUrl = 'https://api.imgflip.com/caption_image';
    const params = req.body;
    const apiData = {
        template_id: params.template_id,
        username: process.env.IMGFLIP_USERNAME,
        password: process.env.IMGFLIP_PASSWORD,
        boxes: params.memeTexts.map((text) => {
            return { "text": text };
        })

    };

    axios({
        method: 'post',
        url: apiUrl,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(apiData)
    }).then(response => {
        if(response.data.success) {
            const fields = populateMemeFields(response.data.data.url, params.topText, params.bottomText, params.user);
            sendToMemeDatabase(fields);
            res.status(200).send({
                success: true,
                url: response.data.data.url
            });
        } else {
            console.log("Unsuccessful call to the imgflip API");
            console.log(response.data.error_message);
            res.status(404).send({
                success: false,
                error_message: response.data.error_message
            });
        }
    })
    .catch( (err) => { throw err; });
       
});

// TODO: Create an endpoint called /getmemes that sends the meme data from the database
// to the response. We want to use the find operation to retreive all of the documents 
// from the database. Then, we want to send our data to the response as string using
// JSON.stringify(data).
app.get('/getmemes', (req, res) => {
    // What should our query be if we want to retrieve everything in our database?
    let query = {};
    let myResult = memeCollection.find(query);
    // How do we use the find operation. We also want to make the data into an array so
    // consider using the .toArray function. 
    // (some collection).toArray((err, result) => {
    //    result represents the array
    // })

    myResult.toArray(function(err, result) {
        //if(err) throw err;
        res.send(JSON.stringify(result));
    });
  });

