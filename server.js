// Get dependencies
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config');
const path = require('path');
const http = require('http');

const app = express();

// app.use(cors());

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

mongoose.connect(config.database, (err) => {
  if(err) {
      console.log(err);
  } else {
      console.log("connected to database");
  }
}); 

app.use(bodyParser.json({ limit: '50MB' }));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(morgan('dev'));
app.use(cors());

console.log("Using node server");
var Client = require('node-rest-client').Client;

// app.get('/server_api/api/v1/rivers', function(req, res) {
//   client.get("http://riverbrain.com/api/v1/rivers", function (data, response) {
//       res.send(data);
//   }); 
// });

const userRoutes = require('./routes/account');
const mainRoutes = require('./routes/main');
const SellerRoutes = require('./routes/seller');
const productSearchRoutes = require('./routes/product-search');

app.use('/api', mainRoutes);
app.use('/api/accounts', userRoutes);
app.use('/api/seller', SellerRoutes);
app.use('/api/search', productSearchRoutes);

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/AngularAmazono/index.html'));
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3001';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on ${port}`));
