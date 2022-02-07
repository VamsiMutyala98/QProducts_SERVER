const joi = require('joi');

const createUsersSchema = joi.object().keys({ 
  name: joi.string().required(),
  email: joi.string().email().required(),
  password:joi.string().required(),
}); 

module.exports = {
  POST: {
    url: '/api/QP/create/user',
    handler: (req,res) => {

      const validate = createUsersSchema.validate(req.body);
      if (validate.error) {
        res.status(400).send(JSON.stringify(validate.error));
      }
      
      const data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      };

      global.services.db.UserServices.createUserServices(data).then((response) => {
        res.send(JSON.stringify(response));
      }).catch((error) => {
        res.send(JSON.stringify(error));
      });
    },
  },
}
