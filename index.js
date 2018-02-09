var express = require("express");
var fs = require("fs");
var app = express();
var bodyParser = require("body-parser");
var cors = require("cors");
var port = 3000;
var path = require("path");
var requests = require("./data/requests.json");
var dogs = require("./data/dogs.json");

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
app.use('/static', express.static(__dirname + '/public'));

function writeDog(cb) {
    fs.writeFile("./data/dogs.json",
        JSON.stringify(dogs), cb);
}

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "./index.html"));
})

app.get("/list", function (req, res) {
    var result;
    if (req.query.category) {
        result = dogs.filter(function (dog) {
            return dog.type === Number(req.query.category);
        })
    } else {
        result = dogs;
    }
    res.send(result);
})

app.post("/dog", function (req, res) {
    var dog = req.body;
    if (dog.type && dog.name) {
        dog.id = dogs[dogs.length - 1].id + 1;
        dogs.push(dog);
        writeDog(function () {
            res.send(dog);
        });
    } else {
        res.status(400);
        res.send();
    }
})

app.patch("/dog/:id", function(req, res){
    var id = Number(req.params.id);
    var body = req.body;
    var foundDog = dogs.find(function(dog){
        return dog.id === id;
    });
    if(foundDog){
        Object.assign(foundDog, body);
        writeDog(function(){
            res.send(foundDog);
        });    
    }else{
        res.status(400);
        res.send();
    }
    
})

app.delete("/dog/:id", function (req, res) {
    var id = req.params.id;
    var dog = dogs.find(function(dog){
        return dog.id === Number(id);
    })
    dogs.splice(dogs.indexOf(dog), 1);
    writeDog(function(){
        res.send();
    });
})

app.get("/list/:dogId", function (req, res) {
    var filterDogs = dogs.find(function (dog) {
        return dog.id === Number(req.params.dogId);
    });
    res.send(filterDogs);
})

app.post("/search", function (req, res) {
    var key = req.body.key;
    var relevant = key ? getRelevant(key) : [];
    key && updateRequests(req.body.key);
    res.json(relevant);
})

app.listen(port, function () {
    console.log("Server is running on port " + port);
})