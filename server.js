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
            ['createdAt', 'DESC']],
          
       //  include: [{all:true}
                 //    {  model: models.users,
                   //     as: "users"
                 //    },
                 //    {
                  //      model: models.likes,
                   //     as: "likes",
                    //    include: {
                    //                model: models.users,
                      //              as: "user"
                       //         }
                    // }
               //     ]
       
   // });
   //  } catch (e) {
   //         console.log("Error. No Messages found");
            
        }); 
    var model = {};
    var user =  await models.Users.findAll({
        where: {
            displayname: request.session.userId
        }
        
    });

    var likes = await models.List.findAll({});

        console.log(list.length);
   for (i = 0; i < list.length; i++) {
      if (list[i].userId === request.session.userId) {
         
        list[i].showDelete = true;
    
        console.log (list[i].userId);
        console.log(list[i].showDelete);
    }else{
        list.showDelete = false;
    }
   }  
    model.list = list;
    model.user = user;
    
    response.render('home', {model, list});
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
    
            return response.redirect('/newgabs');
           
       } catch(e) {
            
           return response.redirect('/login');
       }
       
  });


application.get('/newgabs', async (request, response) => {
    if(request.session.user){

        model = {};

       var newUser = request.session.userId;
       model.newUser =newUser;
    
    response.render('newgabs', {model});
    }else{
        response.redirect('/login');
    }
});

application.post('/newgabs', (request, response) => {

if(request.session.user){
var newMessage = request.body.message;
var newUserMessageId = request.session.userId;
//console.log(newUserMessageId);

    models.Messages.create({
       messageText: newMessage,
       userId:     newUserMessageId
 
    })
    
  // console.log(userId);
   response.redirect('/');
}else{
    response.redirect('/login');
}
});

application.get('/likes', (request, response) => {
    response.render('likes');
});


application.post('/like/:id', async (request, response) =>{

    var id = request.params.id;
    console.log(id);
    var userId= request.session.userId;
    console.log(userId);
    await models.Likes.create({
        isLiked: true,
        messageId: id,
        userId: userId
    
    })
    console.log("it was liked");
    response.redirect('/');

});

application.get('/likes/:id', async (request, response) =>{

    var messageToView = request.params.id;
    var singleMessage = await models.Messages.findAll({
        where: {
            id: messageToView
        }
    
    });
    var listOfLikes = await models.Likes.findAll({
        where: {
            messageId: messageToView
        }
    });

    var numberOfLikes = await models.Likes.findAll({
        where: {
            messageId: messageToView,
            isLiked: true
            }
    });
    console.log (numberOfLikes.length);
    
    
    response.render('likes', {singleMessage, listOfLikes, numberOfLikes});
});

application.post('/delete/:id', async (request, response)=>{
    console.log(request.params.id);
    messageToDelete = request.params.id;
    console.log(messageToDelete);
  
  await models.Messages.destroy({
      where: {
          id: messageToDelete
      }
    
    })
    await models.Likes.destroy({
        where: {
            messageId: messageToDelete
        }
  });

    console.log("message successfully deleted");
    response.redirect('/');

    });

    
   



application.get('/logout', (request, response) =>{



    response.redirect('/login');
})

application.listen(3000, function () {
  console.log('Successfully started express application!');
});
