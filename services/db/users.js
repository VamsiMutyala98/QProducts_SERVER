const User = require('./../../model/user');
const sendEmail = require('./../../utils/email');

module.exports = function UsersServices() {

  function createUserServices(data) {
    return new Promise((resolve, reject) => {
      const filter = {
        email: data.email,
      };
      User.find(filter,(dbErr,dbRes)=> {
        if (dbErr) {
          reject({
            message: 'Error finding User in database',
            code: 403,
            error: 'ERROR_DB_SAVE',
          });
        } else {
          if (dbRes.length > 0) {
            reject({
              message: 'User Already exists',
              code: 403,
              error: 'USER_EXISTS'
            });
          } else {
            const instance = new User(data);
            instance.save((saveErr, newUser) => {
              if (saveErr) {
                reject({
                  message: 'Error in saving User in database',
                  code: 403,
                  error: 'ERROR_DB_SAVE',
                });
              } else {
                resolve({
                  value: newUser,
                  code: 400,
                  message: 'Created Successfully',
                });
              }
            });
          }
        }
      });
    });
  }

  function getUserDetailsByMail(data) {
    return new Promise((resolve, reject) => {
      const filter = {
        email: data.email,
      }
      User.find(filter, (dbErr, dbRes) => {
        if (dbErr) {
          reject({
            message: 'Error finding user in database',
            code: 403,
            error: 'ERROR_DB_SAVE',
          });
        } else {
          console.log(data);
          const link = `http://${process.env.UI_HOST}:${process.env.UI_PORT}/resetPassword`;
          const emailData = {
            to: dbRes[0].email,
            subject: 'Reset Qproducts Account Password',
            html: `<div>
                      <p>Hi, ${dbRes[0].name}</p>
                      Click here: <a href=${link}>Reset Your Password</a>
                   </div>`,
          }
          if (data.isVerification) {
            sendEmail(emailData);
          }
          resolve({
            value: dbRes,
            message: 'Finding User successfully',
          });
        }
      });
    });
  }

  return {
    createUserServices,
    getUserDetailsByMail,
  };
};