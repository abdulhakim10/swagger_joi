const staff = require('../jsons/staff.json');
const client = require('../jsons/client.json');
const alumni = require('../jsons/alumni.json');
const supplier = require('../jsons/supplier.json');
const swaggerUi = require('swagger-ui-express');


const createSwaggerMiddleware = (swaggerDocument) => {
    return {
      serve: swaggerUi.serve,
      setup: (req, res, next) => swaggerUi.setup(swaggerDocument)(req, res, next),
    };
  };
  
  module.exports.swaggerMiddleware = {
    '/client': createSwaggerMiddleware(client),
    '/staff': createSwaggerMiddleware(staff),
    '/alumni': createSwaggerMiddleware(alumni),
    '/supplier': createSwaggerMiddleware(supplier),
    setup: (req, res, next) => {
      next();
    },
  };
  