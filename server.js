import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

//API input
import netflixTitles from './data/netflix-titles.json'


const Key = 'mongodb+srv://ebbabw:gs4m4g4U6pC6ejLK@cluster0-yp7wy.mongodb.net/project-mongo?retryWrites=true&w=majority'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(Key, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Netflixdata = mongoose.model('Netflixdata', {

  title: { type: String }, 
  cast:  { type: String },
  country: { type: String },
  date_added: { type: String },
  release_year: { type: Number },
  rating: { type: String },
  duration: { type: String },
  listed_in: { type: String },
  description: { type: String },
  type: { type: String }
})

const Director = mongoose.model('Director', {

  director: { type: String },

})

if (process.env.RESET_DATABASE) {
  console.log("Resetting database...");
  const seedDatabase = async () => {
    await Netflixdata.deleteMany();
    await Director.deleteMany();

    netflixTitles.forEach((netflixdata) => new Netflixdata(netflixdata).save());
    netflixTitles.forEach((netflixdata) => new Director(netflixdata).save());

  };
  seedDatabase();
}

const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable' })
  }
})

// Start defining your routes here

app.get('/', (req, res) => {
  res.send('Hello! use these routes /netflixtitles')
})


app.get("/netflixtitles", async (req, res) => {
  const titles = await Netflixdata.find();
  res.json(titles);
});


app.get("/netflixtitles/:directors", async (req, res) => {
  const director = await Director.find();
  res.json(director);
});


app.get('/netflixtitles/:id', async (req, res) => {

  try {
    const netflixID = await Netflixdata.findById(req.params.id)

    if(netflixID) {
      res.json(netflixID)
    } else {
      res.status(404).json({error: 'Id not found'})
    }

  } catch(err) {
    res.status(400).json({error: 'Something is Invalid'})
  }

})

// app.get('/netflixtitles/:country', async (req, res) => {


//     const netflixCountry = await Netflixdata.find(req.params.country)
//     const filterByCountry =  netflixCountry.filter((item) => item.country).toLowerCase().includes(country).toLowerCase()

//     if(filterByCountry) {
//       res.json(filterByCountry)
//     } else {
//       res.status(404).json({error: 'Country not found'})
//     }

// })

// app.get("/netflixtitles/:country", async (req, res) => {

//   const country = await Netflixdata.find(req.params.country)
//   const filterByCountry = titlesbycountry.filter((title) => title.country.toString().toLowerCase().includes(country.toLowerCase())) 
//   res.json(filterByCountry);
// });

// app.get('netflixtitles/:country', async (req, res) => {
//   const { country } = req.params;
//   const bycountry = await Netflixdata.findOne({ country: country });
//   if (bycountry) {
//     res.json(bycountry);
//   } else {
//     res.status(404).json({ error: 'Could not find' });
//   }
// });


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})



