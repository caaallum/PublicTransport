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
  res.sendFile(path.join(__dirname + '/pages/petition.html'));
});

app.get('/get-count', async (req, res) =>
{
    try {
        await client.connect();
        const database = client.db("publictransport");
        const collection = database.collection("interest");
        var count = await collection.countDocuments();
        res.send({body: count});
    }
    catch (ex)
    {
        console.log(ex)
    }
    finally {
        await client.close();
    }
})

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
        res.redirect('/form?error=' + JSON.stringify(errors.array()));
      }

      // Create mongodb connection
      try
      {
        await client.connect();
        const database = client.db("publictransport");
        const collection = database.collection("interest");

        // Insert submission into database
        await collection.insertOne(req.body);
      }
      catch (e)
      {
        console.log(e)
      }
      finally
      {
        await client.close();
      }

      let backURL = req.header('Referer') || '/';
      res.redirect(backURL + '?error=success');
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