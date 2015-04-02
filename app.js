var express =require('express')
var path = require('path')
var mongoose=require('mongoose')
var Movie =require('./app/models/movie')
var User =require('./app/models/user')
var _=require('underscore')
var port = process.env.PORT||3000
var app = express()
var fs=require('fs')
var bodyParser=require('body-parser')
var cookieParser=require('cookie-parser')
var session=require('express-session')
var mongoStore=require('connect-mongodb')
var logger=require('morgan')
var multipart=require('connect-multiparty')
var dbUrl='mongodb://CloudFoundry_2q63eco9_7vulj2l6_aovqltha:Y3a5RsKGES1HlewMokhM9shKXsiHyCPh@ds029338.mongolab.com:29338/CloudFoundry_2q63eco9_7vulj2l6'

app.use(bodyParser.urlencoded({extended:true}))

mongoose.connect(dbUrl)
//models load
var models_path=__dirname+'/app/models'
var walk=function  (path) {
	fs
	.readdirSync(path)
	.forEach(function(file){
		var newPath=path+'/'+file
		var stat =fs.statSync(newPath)
		if(stat.isFile()){
			if(/(.*)\.(js|coffee)/.test(file)){
				require(newPath)
			}
		}
		else if(stat.isDirectory()){
			walk(newPath)
		}
	})
}
walk(models_path)

app.set('views','./app/views/pages')
app.set('view engine','jade')
app.use(bodyParser.json())
app.use(multipart())
app.use(express.static(path.join(__dirname,'public')))
app.use(cookieParser())
app.use(session({
  secret:'a',
  store: new mongoStore({
    url:dbUrl,
    collection:'sessions'
  })
}))

if ('development'===app.get('env')){
  app.set('showStackError',true)
  app.use(logger(':method:url:status'))
  app.locals.pretty=true
  mongoose.set('debug',true)
  
}

require('./config/routes.js')(app)
app.locals.moment = require('moment')
app.listen(port)

console.log('imooc started on port '+ port)
