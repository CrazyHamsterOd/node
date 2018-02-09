var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var cors = require("cors");
var port = 3000;
var path = require("path");
var requests = require("./data/requests.json");

function updateRequests(requestString) {
    var same = requests.find(function (searchStr) {
        return requestString === searchStr.key;
    })

    !same && requests.push({
        key: requestString
    })
}

function getRelevant(query) {
    var requestQuery = new RegExp("^" + query, "i");
    return requests.filter(function (searchStr) {
        return requestQuery.test(searchStr.key);
    });
}


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/scripts', express.static(__dirname + '/node_modules'));
app.use('/public', express.static(__dirname + '/public'));

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "./index.html"));
})

app.post("/search", function(req, res){
    var searchStr = req.body.key;
    var result = searchStr ? getRelevant(searchStr) : [];
    searchStr && updateRequests(searchStr);
    res.send(result);
})

// app.get("/search", function (req, res) {
//     console.log(req.query);
//     res.send(req.query);
// })

app.listen(port, function () {
    console.log("Server is running on port " + port);
})