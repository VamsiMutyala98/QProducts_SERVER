const joi = require('joi');

const getUserByMailSchema = joi.object().keys({
  email: joi.string().email().required(),
  isVerification: joi.boolean(),
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
}