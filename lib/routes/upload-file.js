'use strict';

const Fs = require('fs');
const Joi = require('joi');
// const Resumable =  require('resumable-js-hapi');

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
        timeout: {
            socket: false
        },
        payload: {
            output: 'stream',
            maxBytes: 5368709120, //5gb
            allow: 'multipart/form-data'
        },
        handler: async (request, h) => {

            const file = request.payload.bigFile;
            // const myService = new ResumableJsService();
            const fileName = file.hapi.filename;
            const original = __dirname + '/../uploads/' + fileName;
            const upload = Fs.createWriteStream(original);

            file.pipe(upload);

            const end = new Promise((resolve, reject) => {

                file.on('error', (error) => {

                    reject(error);
                });

                file.on('end', () => {

                    // const exists = await myService.get(request);

                    resolve('Upload complete.');
                });
            });
            const uploaded = await end;
            return uploaded;
        }
    }
};
