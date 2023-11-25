import express from 'express';
import dotenv from 'dotenv';
import router from './src/router/index.js'
import authorizeAccount from './src/middlewares/authorizeAccount.js';

//For env File 
dotenv.config();

const app = express();
const port = process.env.PORT;

app.get('/', authorizeAccount([ 'SUPERADMIN', 'NEOTER']), (req, res) => {
  res.send('SCORING SYSTEM');
});

// app.use(cors())
app.use(express.json())
app.use('/', router);


app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});

