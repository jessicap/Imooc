var Movie =require('../models/movie')
var Comment =require('../models/comment')
var Catetory=require('../models/catetory')
var _=require('underscore')
var fs=require('fs')
var path= require('path')

//detail page
exports.detail=function(req,res){
  var id =req.params.id

  Movie.findById(id,function(err,movie){
    Movie.update({_id:id},{$inc:{pv:1}},function(err){ //修改器$inc可以对文档的某个值为数字型（只能为满足要求的数字）的键进行增减的操作。
      if(err){
        console.log(err)
      }
    })
    Comment
      .find({movie:id})
      .populate('from','name')
      .populate('reply.from reply.to','name')
      .exec(function(err,comments){
        //console.log(comments)
        res.render('detail',{
          title: 'imooc  '+ movie.title,
          movie: movie,
          comments:comments
       })
      })
   })

}

//admin page
exports.new = function(req, res) {
  Catetory.find({}, function(err, catetories) {
    res.render('admin', {
      title: 'imooc 后台录入页',
      catetories: catetories,
      movie: {}
    })
  })
}


//admin update movie
exports.update=function(req,res){
  var id= req.params.id

  if(id){
    Movie.findById(id,function(err,movie){
      Catetory.find({},function(err,catetories){
      res.render('admin',{
        title:'imooc 后台更新页面',
        movie:movie,
        catetories:catetories
        })
       })
      })
  }
}
//admin poster
exports.savePoster=function(req,res,next){
  var posterData=req.files.uploadPoster
  var filePath=posterData.path
  var originalFilename=posterData.originalFilename
  if(originalFilename){
    fs.readFile(filePath,function(err,data){
      var timestamp=Date.now()
      var type=posterData.type.split('/')[1]
      var poster=timestamp+'.'+type
      var newPath=path.join(__dirname,'../../','/public/upload/'+poster)
      fs.writeFile(newPath,data,function(err){
        req.poster=poster
        next()
      })
    })
  }
  else{
    next()
  }
}

//admin post movie
exports.save=function(req,res){
  var id =req.body.movie._id
  var movieObj= req.body.movie
  var _movie

  if(req.poster){
    movieObj.poster=req.poster
  }
    
  if (id){
    Movie.findById(id,function(err,movie){
      if (err){
        console.log(err)
      }

      _movie=_.extend(movie,movieObj)
      _movie.save(function(err,movie){
        if(err){
          console.log(err)
        }
        res.redirect('/movie/'+ movie._id)
      })
    })
  }
  else{
    _movie=new Movie(movieObj)

    var catetoryId=movieObj.catetory
    var catetoryName=movieObj.catetoryName
    _movie.save(function(err,movie){
      if(err){
          console.log(err)
        }
        if(catetoryId){
        Catetory.findById(catetoryId,function(err,catetory){
          catetory.movies.push(movie._id)

          catetory.save(function(err,catetory){
              res.redirect('/movie/'+movie._id)
          })

        })  
        }
        else if(catetoryName){
          var catetory =new Catetory({
            name:catetoryName,
            movies:[movie._id]
          })
          catetory.save(function(err,catetory){
            movie.catetory=catetory._id
            movie.save(function(err,movie){
              res.redirect('/movie/'+movie._id)
            })
              
          })
        }
    })
  }
}



//list page
exports.list=function(req,res){
  Movie.fetch(function(err,movies){
    if (err){
      console.log(err)
    }
   res.render('list',{
   	  title: 'imooc 列表页 ',
        movies:movies
   })
})
}

//list delete movie
exports.del=function(req,res){
  var id=req.query.id

  if(id){
    Movie.remove({_id:id},function(err,movie){
      if (err){
        console.log(err)
      }
      else{
        res.json({success:1})
      }
    })
  }

}
