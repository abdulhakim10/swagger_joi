const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const joi = require('joi');
const j2s = require('joi-to-swagger');
const { swaggerMiddleware } = require('./middleware/middleware');

app.use(cors());

// Apply Swagger UI middleware based on path
for (const path in swaggerMiddleware) {
  if (path !== 'setup') {
    app.use(path, swaggerMiddleware[path].serve, swaggerMiddleware[path].setup);
  }
}

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

const swaggerUserSchema = j2s(userSchema).swagger;

const PORT = 3300;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
