'use strict';

const Fs = require('fs');
const Joi = require('Joi');
const Resumable =  require('resumable-js-hapi');

module.exports = {
    method: 'POST',
    path: '/upload-file',
    options: {
        tags: ['api'],
        description: 'Upload that monster file',
        plugins: {
            'hapi-swagger': {
                payloadType: 'form' // tweak swagger config to give upload button
            }
        },
        validate: {
            payload: {
                bigFile: Joi.any()
                    .meta({ swaggerType: 'file' })
                    .description('Big File')
            }
        },
        payload: {
            output: 'stream',
            maxBytes: 5368709120, //5gb
            // allow: 'multipart/form-data'
        },
        handler: async (request, h) => {

            const file = request.payload.bigFile;
            // const myService = new ResumableJsService();

            //profilePic: (file, cropPosition, cropRotation, bucket, callback) => {

            const fileName = file.hapi.filename;

            const original = __dirname + '/../uploads/' + fileName;

            const upload = Fs.createWriteStream(original);

            file.pipe(upload);

            const end = new Promise((resolve, reject) => {

                file.on('error', (error) => {

                    return error;
                });

                file.on('end', (err) => {

                    // const exists = await myService.get(request);

                    return 'This works.  Who knew? ';
                });
            });
            const uploaded = await end;
            return uploaded;
        }
    }
};
