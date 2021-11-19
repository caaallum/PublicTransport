const http = require('http');
const express = require('express');
const path = require('path');
const app = express();
const router = express.Router();
const { body, validationResult } = require('express-validator');

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
router.post('/submit',
    body('email').isEmail(),                      // Check email is valid
    body('houseno').isNumeric(),                  // Check house number is numeric
    body('fname').isLength({ min: 3 }),    // Check first name is at least 3 characters
    body('sname').isLength({ min: 3}),     // Check last name is at least 3 characters
    async (req, res) => {
      // Check form values are valid
      const errors = validationResult(req);
      if (!errors.isEmpty())
      {
        return res.status(400).json({ errors: errors.array() });
      }

      // Create mongodb connection
      try
      {
        await client.connect();
        const database = client.db("publictransport");
        const collection = database.collection("interest");

        // Insert submission into database
        //await collection.insertOne(req.body);
        await collection.deleteMany();

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
      return res.status(200);//res.sendFile(path.join(__dirname + '/pages/form.html'));
});

// 404 page **KEEP LAST**
router.get('*', (req, res) =>
{
  res.sendFile(path.join(__dirname + '/pages/404.html'));
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', router);

const server = http.createServer(app);
const port = 3000;

server.listen(port);
console.debug(`Server listening on port ${port} @ ${Date.now()}`);