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

app.use(cors());

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

mongoose.connect(config.database, (err, client) => {
  if(err) {
      console.log(err);
  } else {
      console.log("connected to database");
      const Category = client.models.Category;
      Category.findOne({name: 'uncategorized'}).exec(function(err, docs) {
        if (!docs){
          let category = new Category();
          category.name = 'uncategorized';
          category.save();
        }
      });
  }
}); 

app.use(bodyParser.json({ limit: '50MB' }));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(morgan('dev'));
app.use(cors());

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
  res.sendFile(path.join(__dirname, 'dist/index.html'));
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
