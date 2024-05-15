const express = require('express') ;
const router = express.Router();
const movieController = require('../controller/moviesController') ;

router.route('/')
.post(movieController.addmovie)
.get(movieController.getmovie) 

router.route('/:propertyId')
.delete(movieController.deletemovie)
.patch(movieController.updatemovie)


module.exports = router ;