// create express app
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');

app.use(cors());

// initialize swagger-UI
const swaggerUi = require('swagger-ui-express');
const staff = require('./staff.json'); 
const client = require('./client.json');
const alumni = require('./alumni.json');
const supplier = require('./supplier.json');

const j2s = require('joi-to-swagger');

// Create a single middleware function using an object literal
const swaggerMiddleware = {
  '/client': {
    serve: swaggerUi.serve,
    setup: (req, res, next) => swaggerUi.setup(client)(req, res, next),
  },
  '/staff': {
    serve: swaggerUi.serve,
    setup: (req, res, next) => swaggerUi.setup(staff)(req, res, next),
  },
  '/alumni': {
    serve: swaggerUi.serve,
    setup: (req, res, next) => swaggerUi.setup(alumni)(req, res, next),
  },
  '/supplier': {
    serve: swaggerUi.serve,
    setup: (req, res, next) => swaggerUi.setup(supplier)(req, res, next),
  },
  setup: (req, res, next) => {
    next(); // Pass control to the next middleware if the path doesn't match
  },
};

// Apply Swagger UI middleware based on path
for (const path in swaggerMiddleware) {
  if (path !== 'setup') {
    app.use(path, swaggerMiddleware[path].serve, swaggerMiddleware[path].setup);
  } 
}

// Create API endpoints using Express routes.
// Define Joi schemas for request validation:
const joi = require('joi');
// const j2s = require('joi-to-swagger');

const userSchema = joi.object().keys({
  name: joi.string().required(),
  email: joi.string().email().required(),
});

const validate = (data, schema) => {
  const { error } = schema.validate(data);
  if (error) return { error };
  return { value: data };

};
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Use joi-to-swagger to convert Joi schemas to Swagger definitions
const swaggerUserSchema = j2s(userSchema).swagger;

// Start the server
const PORT = 3300;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

