const swaggerUi = require('swagger-ui-express');
const swaggereJsdoc = require('swagger-jsdoc');

const options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: 'smartbell Detection API',
            version: '1.0.0',
            description: 'Specification of API with Firebases',
            contact: {
            name: "BS-Soft",
            url: "http://www.bs-soft.co.kr/support",
            email: "office@bs-soft.co.kr",
            },
        },
        host: 'api-smartbell.bs-soft.co.kr',
        basePath: '/smartalert-353fe/us-central1/api/',
        servers: [
            {
                url: "http://api-smartbell.bs-soft.co.kr/smartalert-353fe/us-central1/api/",
                description: "dev API",
            },
            {
                url: "https://us-central1-smartalert-353fe.cloudfunctions.net/api/",
                description: "published(Firebase) API",
            },
          ],
    },

   
      
    apis: ['./routes/*.js', './docs/*', './index.js']
};


const specs = swaggereJsdoc(options);



module.exports = {
    swaggerUi,
    specs
};