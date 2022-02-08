const { response } = require('express');
const joi = require('joi');

const getUserByMailSchema = joi.object().keys({
  email: joi.string().email().required(),
  isVerification: joi.boolean(),
});

const idSchema = joi.object().keys({
  id: joi.string().required(),
});

const UserDetailsSchema = joi.object().keys({
  name: joi.string(),
  email: joi.string().email(),
  password: joi.string(),
})

module.exports = {
  POST: {
    url: '/api/QP/getUserByMailId',
    handler: (req, res) => {
      const validate = getUserByMailSchema.validate(req.body);

      if (validate.error) {
        res.status(400).send(JSON.stringify(validate.error));
      }

      const data = {
        email: req.body.email,
      };

      if (req.body.isVerification) {
        data.isVerification = req.body.isVerification;
      }
      
      global.services.db.UserServices.getUserDetailsByMail(data).then((response) => {
        res.send(JSON.stringify(response));
      }).catch((error) => {
        res.send(JSON.stringify(error));
      });
    },
  },
  GET: {
    url: '/api/QP/userDetails/:id',
    handler: (req, res) => {

      const validate = idSchema.validate(req.params);

      if (validate.error) {
        res.status(400).send(JSON.stringify(validate.error));
      }

      const data = {
        id: req.params.id,
      }
      global.services.db.UserServices.getUserDetailsById(data).then((response) => {
        res.send(JSON.stringify(response));
      }).catch((error) => {
        res.send(JSON.stringify(error));
      });
    }
  },
  PUT: {
    url: '/api/QP/userDetails/:id',
    handler: (req, res) => {
      const validate = idSchema.validate(req.params);

      if (validate.error) {
        res.status(400).send(JSON.stringify(validate.error));
      }

      const userValidate = UserDetailsSchema.validate(req.body);

      if (userValidate.error) {
        res.status(400).send(JSON.stringify(userValidate.error));
      }

      const data = {
        id: req.params.id,
        updateData: req.body,
      }

      global.services.db.UserServices.updateUserDetails(data).then((response) => {
        res.send(JSON.stringify(response));
      }).catch((error) => {
        res.send(JSON.stringify(error));
      });
    }
  }
}