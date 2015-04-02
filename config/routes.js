var Index = require('../app/controllers/index')
var User = require('../app/controllers/user')
var Movie = require('../app/controllers/movie')
var Comment=require('../app/controllers/comment')
var Catetory=require('../app/controllers/catetory')

module.exports=function(app){
// pre handle 
app.use(function(req,res,next){
  var _user=req.session.user
  
    app.locals.user=_user
  
   next()
})

//index page
app.get('/',Index.index)

//User
//signup
app.post('/user/signup',User.signup)

//signin
app.post('/user/signin',User.signin)

//show signin
app.get('/signin',User.showSignin)

//show signup
app.get('/signup',User.showSignup)
//-logout 
app.get('/logout',User.logout)

//userlist pages
app.get('/admin/user/userlist',User.signinRequired,User.adminRequired,User.list)


//Movie
//detail page
app.get('/movie/:id', Movie.detail)

//admin page
app.get('/admin/movie/new',User.signinRequired,User.adminRequired,Movie.new)

//admin update movie
app.get('/admin/movie/update/:id',User.signinRequired,User.adminRequired,Movie.update)

//admin post movie
app.post('/admin/movie',User.signinRequired,User.adminRequired,Movie.savePoster,Movie.save)

//list page
app.get('/admin/movie/list',User.signinRequired,User.adminRequired,Movie.list)

//list delete movie
app.delete('/admin/movie/list',User.signinRequired,User.adminRequired,Movie.del)

//comment
app.post('/user/comment',User.signinRequired,Comment.save)

//catetory
app.get('/admin/catetory/new',User.signinRequired,User.adminRequired,Catetory.new)
app.post('/admin/catetory',User.signinRequired,User.adminRequired,Catetory.save)
app.get('/admin/catetory/list',User.signinRequired,User.adminRequired,Catetory.list)

//result
app.get('/results',Index.search)

}

