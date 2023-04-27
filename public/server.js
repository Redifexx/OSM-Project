import express from 'express';
import bodyParser from 'body-parser';
import oracledb from 'oracledb';
import { username, pw } from './logininfo.js';
import { hello, fetchNode, fetchWay } from './algorithms.js';

var PORT = process.env.PORT || 3000;

var app = express();
app.set('view engine', 'ejs');

var connectionProperties = 
{
    user: username,
    password: pw,
    connectionString: "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=oracle.cise.ufl.edu)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SERVICE_NAME=orcl)))"
}
function doRelease(con) {
    con.release(function (err) {
      if (err) {
        console.error(err.message);
      }
    });
}


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

app.post('/query1', (req, res) => {
    const query = req.body.query;
    console.log('Query received from client:', query);
    oracledb.getConnection(connectionProperties, function (err, con) {
        if (err) {
          console.error(err.message);
          res.status(500).send("Error connecting to DB");
          return;
        }
        con.execute(query,{},  
        { outFormat: oracledb.OBJECT },
        function (err, result) {
            if (err) {
                console.error(err.message);
                res.status(500).send("Error getting data from DB");
                doRelease(con);
                return;
            }
            console.log(result);
            res.status(200).send(result);
        });
      });
  });


app.post('/source', (req, res) => {
    const source = req.body.source;
    const destination = req.body.destination;
    var result = fetchNode(source, destination)
        .then(result_ => {
            console.log("SERVER: " + result_);
            res.status(200).send(result_);
        })
        .catch((error) => {
            console.error(error);
        });
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