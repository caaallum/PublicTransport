const http = require('http');
const express = require('express');
const path = require('path');
const app = express();
const router = express.Router();

const { MongoClient }  = require("mongodb");
const url = "mongodb://localhost:27017/";
const client = new MongoClient(url);

app.use(express.urlencoded({
  extended: true
}))

// Page call backs
router.get('/', (req, res) =>
{
  res.sendFile(path.join(__dirname + '/pages/index.html'));
});

router.get('/about', (req, res) =>
{
  res.sendFile(path.join(__dirname + '/pages/about.html'));
});

router.get('/form', (req, res) =>
{
  res.sendFile(path.join(__dirname + '/pages/form.html'));
});

// Form submit
router.post('/submit', async (req, res) => {
  // Create mongodb connection
  try
  {
    await client.connect();
    const database = client.db("publictransport");
    const collection = database.collection("interest");

    // Insert submission into database
    await collection.insertOne(req.body);

    const submissions = await collection.find().toArray();
    console.log(JSON.stringify(submissions));
  }
  catch (e)
  {
    console.log(e)
  }
  finally
  {
    await client.close();
  }

  // Send user back to form page
  res.sendFile(path.join(__dirname + '/pages/form.html'));
});

app.use('/', router);

const server = http.createServer(app);
const port = 3000;

server.listen(port);
console.debug('Server listening on port ' + port);