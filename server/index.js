require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const app = express();
const server = http.createServer(app);

const URL = process.env.MONGODB_URI;
const port = 3030;

const router = require('./routes');

//=============== DB ================
mongoose
  .connect(URL)
  .then(() => {
    console.log(`App connected to DB!`);
  })
  .catch((err) => {
    console.error(`DB Error: ${err}`);
  });

// ============== Socket =============
const setupSocketIO = require('./socket');
const io = setupSocketIO(server);

//============= API ==============
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors());
app.use(router);

server.listen(port, () => console.log(`App is listening on port ${port}...`));