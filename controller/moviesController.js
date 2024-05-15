    const { validationResult } = require("express-validator");
    const movie = require("../model/moivemodel");
    const addmovie = async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }
        const newmovie = new movie(req.body);
        try {
            await newmovie.save();
            res.status(201).json(newmovie);
        } catch (err) {
            console.error('Error saving property:', err); // Log the error
            res.status(500).json({ msg: 'Server error' });
        }
    };
    
    const getmovie =  async (req, res) => {
        try {
            const movies = await movie.find();
            res.json(movies);
        } catch (err) {
            res.status(500).json({ msg: 'Server error' });
        }
    }
    const deletemovie =  async (req, res) => {
        const data = await movie.deleteOne({ _id: req.params.propertyId });
        res.status(200).json({ success: true, msg: data });

    }
    const updatemovie = async (req,res) => {
        const movieID = req.params.propertyId;
        try {

            const movieUpdated = await movie.updateOne({ _id: movieID }, { $set: { ...req.body }});
            res.status(200).json(movieUpdated) ;
        }catch(err){
        return res.status(400).json({ success :false , msg : err.msg})
        }

    }


    module.exports = {
        addmovie ,
        getmovie ,
       deletemovie,
       updatemovie

    }