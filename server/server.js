import express from "express";
import bodyParser from "body-parser";
import  mongoose from "mongoose";
import cors from "cors"
import Pusher from "pusher";
import mongoMessages from "./messageModel.js"



const app = express();


const pusher = new Pusher({
    appId: "1269680",
    key: "d2dcd76925e90697dade",
    secret: "de2e4b3adde9784795dc",
    cluster: "eu",
    useTLS: true
});

app.use(bodyParser.json({limit: "30mb",extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb",extended: true}));
app.use(cors());

const MONGO_URI ="mongodb+srv://user:user1979@cluster0.s4gbg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

// Mongo
const port = process.env.PORT || 8000;
async function startApp() {
    try {
        await mongoose.connect(MONGO_URI)
        app.listen(port,() => {
            console.log('SERVER IS RUNNING ON PORT ' + port)} )

    }
    catch (e) {
        console.log(e)
    }
}
mongoose.connection.once('open', () =>{
    console.log('Mongo Is ok!')
    const changeStream = mongoose.connection.collection('messages').watch()
    changeStream.on('change', ( change) => {
        pusher.trigger('messages', 'newMessage', {
            'change': change
        })
    })
})

 startApp()

app.get("/", (req,res ) =>
    res.status(200).send("Hello World !!!"))
app.post("/save/message", (req,res) => {
    const dbMessage = req.body;

    mongoMessages.create(dbMessage,(err, data) =>{
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(data)
        }
    })

})
app.get("/retrieve/conversation", (req,res) =>{
    mongoMessages.find((err,data) =>{
        if (err) {
            res.status(500).send(err)
        } else {
            data.sort((b,a) =>{
                return a.timestamp - b.timestamp;
            })
            res.status(201).send(data)

        }
    })
})
app.delete('/messages/:id', (req, res) => {
    mongoMessages('messages').remove({_id: mongodb.ObjectID( req.params.id)}, (err, result) => {
        if (err) return console.log(err)
        console.log(req.body)
        res.redirect('/')
    })
})