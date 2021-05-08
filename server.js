import express from 'express';
import mongoose from 'mongoose';
import Pusher from 'pusher';
import cors from 'cors';

import mongoMessages from './messageModel.js';

//app config
const app = express();
const port = process.env.PORT || 9000;

const pusher = new Pusher({
    appId: "1200666",
    key: "639703e137123e691dd9",
    secret: "d7d9e0c01caca2dc4d58",
    cluster: "ap1",
    useTLS: true
});

//middlewares
app.use(express.json());
app.use(cors());

//db config
const mongoURI = "mongodb+srv://messenger-admin:OeLDG5XEeb7iuHG4@cluster0.eygh2.mongodb.net/<messengerDB>?retryWrites=true&w=majority"
mongoose.connect(mongoURI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.once('open', () => {
    console.log('connected')

    
    const changeStream = mongoose.connection.collection('messages').watch()
    changeStream.on('change', (change) => {
        pusher.trigger('messages', 'newMessage', {
            'change': change
        })
    })
})


//api routes
app.get('/', (req, res) => res.status(200).send('hello world'));

app.post('/save/message', (req, res) => {
    const dbMessage = req.body

    mongoMessages.create(dbMessage, ( err, data ) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(data)
        }
    })
})

app.get('/retrieve/conversation', (req, res) => {
    mongoMessages.find((err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            data.sort((b, a) => {
                return a.timestamp - b.timestamp;
            });
            res.status(200).send(data)
        }
    })
})

app.listen(port, () => console.log(`listening to localhost:${port}`))
