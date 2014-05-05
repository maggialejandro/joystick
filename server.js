'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Module dependencies
var express = require('express'),
    path = require('path'),
    config = require('./lib/config/config');

/**
 * Main application file
 */

var app = express();

app.use(express.static(path.join(config.root, 'www')));

app.get('/', function(req, res){
  res.sendfile(__dirname + '/www/index.html');
});

// Start server
app.listen(config.port, config.ip, function () {
  console.log('Express server listening on %s:%d, in %s mode', config.ip, config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;
