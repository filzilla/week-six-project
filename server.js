const express = require ('express');
const mustacheExpress = require ('mustache-express');
const expressValidator = require('express-validator');
const session = require('express-session');

const models = require ('./models');

const bodyParser = require ('body-parser');

var application = express();
application.engine('mustache', mustacheExpress());
application.set('view engine', 'mustache');

application.set('views', './views');


application.use(express.static('public'));

application.use(bodyParser.urlencoded());
application.use(bodyParser.json());

application.use(session({
  secret: 'beck&miles',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));


application.use(function(request, response, next){
    if(request.session.user){
        request.session.isAuthenticated = true;
    }else{
        request.session.isAuthenticated = false;
    }
    next()
    });


application.get('/', async (request, response) => {
  //  console.log(request.session);
    if(request.session.user){
    var list =  await models.Messages.findAll({
        order:[
        ['createdAt', 'DESC']]
    });
    //console.log(list)
   
      
//if logged in display 
      console.log(list);
    response.render('home', {list:list});
    }else{
        response.redirect('/signup');
    }
});




application.get('/signup', (request, response) => {



    response.render('signup');
   
});

application.post('/signup', async(request, response) => {

    var username = request.body.name;
    var password = request.body.password;
    var displayname = request.body.displayname;
    var email = request.body.email;

     await models.Users.create({

        username: username,
        password: password,
        email: email,
       displayname: displayname,
        
     });
   
    response.redirect('login');
});

application.get('/login', (request, response) => {
    response.render('login');
})

application.post('/login', async (request, response) => {
   

    let newUserName = request.body.name;
    let password = request.body.password;

    
        try {
       //     console.log(' in the try')
           const user = await models.Users.findOne({ where: { username: newUserName, password: password } });
       //     console.log(user, 'the user')
            
            request.session.user = user.username;
            request.session.isAuthenticated = true;
            request.session.userId = user.displayname;
            console.log(user.id);
            console.log(request.session.userId);
            console.log(request.session.user);
            console.log(user.displayname);
            return response.redirect('/newgabs');
           
       } catch(e) {
            
           return response.redirect('/login');
       }
       
  });


application.get('/newgabs', (request, response) => {
    if(request.session.user){
    response.render('newgabs');
    }else{
        response.redirect('/login');
    }
});

application.post('/newgabs', (request, response) => {

if(request.session.user){
var newMessage = request.body.message;
var newUserMessageId = request.session.userId;
console.log(newUserMessageId);

    models.Messages.create({
       messageText: newMessage,
       userId:     newUserMessageId
 
    })
    
   console.log(userId);
   response.redirect('/');
}else{
    response.redirect('/login');
}
});

application.get('/likes', (request, response) => {
    response.render('likes');
});


application.post('/:id', async (request, response) =>{

    var id = request.params.id;
  //  console.log(id);
    var userId= request.session.userId;

    await models.Likes.Create({
        isLiked: true,
        messageId: id,
        userId: userId
    
    })
 //   console.log(models.Likes);
    response.redirect('/');

});

application.delete('/:id', (request, response)=>{
    console.log(request.params.id)
    messageToDelete = request.params.id;
   // console.log(messageToDelete)
    models.Messages.destroy({
        where:{
        id: messageToDelete
    }
  
    })
   console.log("message successfully deleted");
    response.redirect('home');
})

application.listen(3000, function () {
  console.log('Successfully started express application!');
});
