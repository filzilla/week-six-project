const express = require ('express');
const mustache = require('mustache');
const mustacheExpress = require ('mustache-express');
const models = require ('./models');

const bodyParser = require ('body-parser');

var application = express();
application.engine('mustache', mustacheExpress());
application.set('view engine', 'mustache');

application.set('views', './views');


application.use(express.static('public'));

application.use(bodyParser.urlencoded());
application.use(bodyParser.json());

application.get('/', (request, response) => {

/// if logged in display 
    response.render('home');
});

//application.delete('/',(request, response) => {

//var currentmessage = body.request.message;

//models.Messages.message.find({ where:{ currentmessage === message}})
//.then(message => {
  // now you see me...
//  return message.destroy();
//}).then(() => {
 // now i'm gone :)

//response.render('home');
//});

application.get('/signup', (request, response) => {
    response.render('signup');
});

application.post('/signup', (request, response) => {

    var username = request.body.name;
    var password = request.body.password;
    var displayname = request.body.displayname;
    var userId = request.body.email;

    models.Users.create({

        username: username,
        password: password,
        displayname: displayname,
        userId:  userId
    });
    // console.log (Users);
    response.redirect('login');
});

application.get('/login', (request, response) => {

    response.render('login');
});

application.post('/login', (request, response) => {
///// do the authentication to compare to the sign in info and send you to the homepage

response.redirect('newgabs')
});


application.get('/newgabs', (request, response) => {
    response.render('newgabs');
});

application.post('/newgabs', (request, response) => {

var newMessage = request.body.message;

    models.Messages.create({
       messageText: newMessage,
        userId:     models.Users.userId,
        messageId: models.Messages.Id,
   })
   response.redirect('home');
});

application.get('/likes', (request, response) => {
    response.render('likes');
});


application.post('/likes', (request, response) =>{
///// need to use a post to add likes to db

    var newLike = request.body.//checked;

    models.Likes.create({
        isLiked: true,
        userId: models.Users.userId,
        messageId: models.messageId

    });

response.render('likes')
});





application.listen(3000, function () {
  console.log('Successfully started express application!');
});
