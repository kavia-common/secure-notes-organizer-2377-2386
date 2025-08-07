const swaggerJSDoc = require('swagger-jsdoc');

/** 
 * Swagger config: add JWT bearer and tag grouping
 */
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Secure Notes Organizer API',
      version: '1.0.0',
      description: 'REST API for managing secure notes with user authentication, tagging, and filtering.',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: 'auth', description: 'User authentication' },
      { name: 'notes', description: 'Notes management' }
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
