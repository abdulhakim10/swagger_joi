// create express app
const express = require('express');
const app = express();
const router = express.Router();


// initialize swagger-UI
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./staff.json'); // Your Swagger definition
const swaggerAwfa = require('./client.json')

const j2s = require('joi-to-swagger');

// Create a single middleware function using an object literal
const swaggerMiddleware = {
  '/client': {
    serve: swaggerUi.serve,
    setup: (req, res, next) => swaggerUi.setup(swaggerAwfa)(req, res, next),
  },
  '/staff': {
    serve: swaggerUi.serve,
    setup: (req, res, next) => swaggerUi.setup(swaggerDocument)(req, res, next),
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

// Your other middleware or route handlers go here







// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerAwfa));
// app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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

app.get('/', (req, res) => {
  // if (req.path === '/app-docs') {
  //   app.use(swaggerUi.serve, swaggerUi.setup(swaggerAwfa));
  // }
  console.log(req.path)
    // Get users logic...
    res.json({ message: 'server running' });
});

app.post('/users', async (req, res) => {
    const { error } = await validate(req.body, userSchema);
    if (error){
        return res.status(400).json({ error: error.details[0].message })
    }
    else{
         // Create user logic...
    res.status(201).json({ message: 'User created successfully' });
    }
   
});


// Use joi-to-swagger to convert Joi schemas to Swagger definitions
const swaggerUserSchema = j2s(userSchema).swagger;

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
