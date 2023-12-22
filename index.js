// create express app
const express = require('express');
const app = express();

// initialize swagger-UI
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json'); // Your Swagger definition

const j2s = require('joi-to-swagger');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
