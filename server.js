var WebSocketServer = require("ws").Server
var http = require("http")
var express = require("express")
var app = express()
var port = process.env.PORT || 5000
var bodyParser = require('body-parser')
app.use(bodyParser.json({limit: '25mb'}));
app.use(bodyParser.urlencoded({limit: '25mb', extended: true}));
var sf = require('node-salesforce');
const {encryptDataFunc,} = require("./encrypt.js");

app.use(express.static(__dirname + "/"))

var server = http.createServer(app)
console.log('port is'+ port);
server.listen(port)

var conn = new sf.Connection({
  // you can change loginUrl to connect to sandbox or prerelease env.
   loginUrl : 'https://login.salesforce.com'
});

/*var conn1 = new sf.Connection({
  // you can change loginUrl to connect to sandbox or prerelease env.
   loginUrl : 'https://login.salesforce.com'
});*/
var username = 'anuj.singh2@resourceful-bear-nxv21i.com'
var password = 'Anuj1990J0IJpV8tW41sKfstnLOC6e6NH'

var AbhijtdaUsername  = 'sudiptahalder@gmail.com.tcrm';
var AbhijtdaPassword  = 'sudiptada123ed946uJXVfcXfbiBqlV2gA9FU';

/*conn1.login(AbhijtdaUsername, AbhijtdaPassword, function(err, userInfo) {
  if (err) { return console.error(err); }
  // Now you can get the access token and instance URL information.
  // Save them to establish connection next time.
  console.log(conn.accessToken);
  console.log(conn.instanceUrl);
  // logged in user property
  console.log("User ID: " + userInfo.id);
  console.log("Org ID: " + userInfo.organizationId);
  // ...
});*/

conn.login(username, password, function(err, userInfo) {
  if (err) { return console.error(err); }
  // Now you can get the access token and instance URL information.
  // Save them to establish connection next time.
  console.log(conn.accessToken);
  console.log(conn.instanceUrl);
  // logged in user property
  console.log("User ID: " + userInfo.id);
  console.log("Org ID: " + userInfo.organizationId);
  // ...
});

app.use(function (req, res, next) {
  var responseObject;
  const reqpath = req.path;
  if(reqpath.includes('Salesforce/NDHMEncrypt')){ 
    console.log('Data to check' +req.body.dataToEncrypt)
    encryptDataFunc(req.body.dataToEncrypt)
    res.end(encryptDataFunc(req.body.dataToEncrypt)); 
  }
  else{
    responseObject = req.body;
    responseObject["inboundUrl"] = req.path;
    console.log('path'+ reqpath);
    console.log('final body'+JSON.stringify(req.body));
    
    //responseObject.inboundUrl = req.path;
    console.log('Final Data' + responseObject);
    conn.apex.post("/gateway/onFetchMode/", responseObject, function(res) {
    // the response object structure depends on the definition of apex class
    console.log('request sent back')
    });
    /*conn1.apex.post("/gateway/onFetchMode/", responseObject, function(res) {
      // the response object structure depends on the definition of apex class
      console.log('request sent back')
      });*/
  }
  
  next()
})
require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  console.log('addr: ' + add);
})