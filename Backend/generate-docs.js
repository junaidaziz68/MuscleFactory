const p2o = require('postman-to-openapi');
const path = require('path');

const collectionPath = path.join(__dirname, '../MuscleFactory_API.postman_collection.json');
const openapiPath = path.join(__dirname, 'openapi.yml');

(async () => {
    try {
        await p2o(collectionPath, openapiPath, { defaultTag: 'General' });
        console.log('Successfully generated openapi.yml');
    } catch (err) {
        console.error('Error generating OpenAPI:', err);
        process.exit(1);
    }
})();
