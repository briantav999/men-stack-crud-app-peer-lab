const express = require('express');
const app = express();

const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI);
const Planet = require("./models/planet.js");

const morgan = require("morgan")
const methodOverride = require('method-override')

const connect = async() => {
    await mongoose.connect(process.env.MONGODB_URI)
}


app.use(express.static('public'));
app.use(express.urlencoded({extended:false}))
app.use(methodOverride('_method'))


app.post('/planets', async (req, res)=> {
    if(req.body.noGravity === 'on'){
        req.body.noGravity = true
    } else {
        req.body.noGravity = false
    }
    const createdPlanet = await Planet.create(req.body)
    res.redirect('/planets')
})

app.get('/planets', async (req, res)=> {
    const allPlanets = await Planet.find()
    res.render('planets/index.ejs', {
        planets: allPlanets
    })
})


app.get('/planets/:planetId/edit', async (req,res)=> {
    const foundPlanet = await Planet.findById(req.params.planetId)
    res.render('planets/edit.ejs', {
        planet: foundPlanet
    })
})

app.put('/planets/:planetId', async (req,res)=>{
    if(req.body.noGravity === 'on'){
        req.body.noGravity = true
    } else {
        req.body.noGravity = false
    }
    await Planet.findByIdAndUpdate(req.params.planetId, req.body)
    res.redirect('/planets')
})



app.delete('/planets/:planetId', async (req, res)=> {
    await Planet.findByIdAndDelete(req.params.planetId)
    res.redirect('/planets')
})



app.get('/', (req,res)=> {
    res.render('index.ejs')
})

app.get("/planets/new", (req, res) => {
    res.render('planets/new.ejs')
});


app.get('/planets/:planetId', async (req, res)=> {
    const foundPlanet = await Planet.findById(req.params.planetId)
    res.render('planets/show.ejs', {
        planet:foundPlanet
    })
   
})

app.listen(3000, () =>{
    console.log("Running on the Server!")
})