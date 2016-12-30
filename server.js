// set up

var express = require('express');
var app = express();            //create our app with express
var mongoose = require('mongoose'); // mongoose for mongodb
var morgan = require('morgan');  // log request to the console (express4)
var bodyParser = require('body-parser'); // pull information from HTML POST
var methodOverride = require('method-override'); // simulate DELETE and PUT

// configuration

mongoose.connect(process.env.DATABASEURL_TODO);

app.use(express.static(__dirname + '/public')); // set the static files location
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(methodOverride());

//define model
var Todo = mongoose.model('Todo', {
  text: String
});

// routes
    //api

    // get all todos
    app.get('/api/todos', function(req, res){
      // use mongose to get all todos in the database
      Todo.find(function(err, todos){
        if (err)
          res.send(err);
        res.json(todos); // return all todos in JSON format
      })
    });

    // create to do and send back all todos after creation
    app.post('/api/todos', function(req, res){
      // create a to do, information comes from AJAX request from Angular
      Todo.create({
        text: req.body.text,
        done: false
      }, function(err, todo){
        if (err)
          res.send(err);
        // get and return all the to dos after you create another
        Todo.find(function(err, todos){
          if (err)
            res.send(err)
          res.json(todos);
        })
      })
    });

    // delete a to do
    app.delete('/api/todos/:todo_id', function(req, res){
      Todo.remove({
        _id : req.params.todo_id
      }, function(err, todo){
        if (err)
          res.send(err);

        // get and return all the to dos after you delete another
        Todo.find(function(err, todos){
          if (err)
            res.send(err)
          res.json(todos);
        });
      });
    });

    // application
    app.get('*', function(req, res){
      res.sendfile('./public/index.html');
    });

// listen
app.listen(8080);
console.log("App listening on port 8080");