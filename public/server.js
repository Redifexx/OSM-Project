import express from 'express';
import bodyParser from 'body-parser';
import { hello } from './algorithms.js';

var PORT = process.env.PORT || 3000;

var app = express();
app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: '*/*' }));

var router = express.Router();

router.use(function (request, response, next) {
    console.log("REQUEST:" + request.method + "   " + request.url);
    console.log("BODY:" + JSON.stringify(request.body));
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    response.setHeader('Access-Control-Allow-Credentials', true);
    next();
});



app.get('/', (req, res) => {
    console.log("REFRESHED!");
    res.render('index'); //Renders EJS 
});

var toSend = 'send';
app.post('/test', (req, res) => {
    var test = req.body.query; //HTML to JS
    res.send(toSend) //JS TO HTML
});

console.log(hello);

app.use(express.static('public'));
app.use('/', router);
app.listen(PORT);