const Hapi=require('hapi');
const Joi= require('joi');

const sgClient = require('@sendgrid/mail');
sgClient.setApiKey(process.env.SENDGRID_API_KEY);


const server=Hapi.server({
    port: process.env.PORT || 3000
});

const sender = process.env.SENDER_EMAIL;

server.route({
    method:'POST',
    path:'/send',
    handler: async ({payload},h) => {
        const {message, title, to} = payload; 
        await sgClient.send({
            to,
            from: sender,
            subject: title,
            text: message,
            html: message,
          });
        return payload;
    },
    options: {
        validate: {
            payload: {
                to: Joi.string().required(),
                title: Joi.string().required(),
                message: Joi.string().required()
            }
        }
    }
});

(async function start() {
    try {
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }
    console.log('Server running at:', server.info.uri);
})();
