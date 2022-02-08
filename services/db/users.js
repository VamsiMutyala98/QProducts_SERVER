const User = require('./../../model/user');
const sendEmail = require('./../../utils/email');
const Counter =  require('./../../model/counter');
const moment = require('moment');

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
            Counter.findOneAndUpdate({type:'UserId'},{$inc: { count: +1 }}, async (dbErr,dbRes) => {
              if (dbErr) {
                reject({
                  message: 'Error in Counter Model',
                  code: 403,
                  error: 'ERROR_FINDING_TYPE',
                });
              } else {
                if (!dbRes) {
                  const obj = {
                    type: 'UserId',
                    count: 1,
                  }
                  const counter = new Counter(obj);
                  counter.save(async (sErr, count) => {
                    if (sErr) {
                      reject({
                        message: 'Error in creating new Counter',
                        code: 403,
                        error: 'ERROR_DB_SAVE',
                      });
                    } else {
                      data.userId= moment().format('YYYY')+'-'+count.count;
                      const response = await saveUserDetails(data);
                      resolve(response);
                    }
                  })
                } else {
                  data.userId = moment().format('YYYY')+'-'+(dbRes.count+1);
                  const response = await saveUserDetails(data);
                  resolve(response)
                }
              }
            });
          }
        }
      });
    });
  }

  function saveUserDetails(data) {
    return new Promise((resolve,reject) => {
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
          const link = `http://${process.env.UI_HOST}:${process.env.UI_PORT}/resetPassword/${dbRes[0].userId}`;
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

  function getUserDetailsById(data) {
    return new Promise((resolve,reject) => {
      User.findOne({userId: data.id},(dbErr,dbRes) => {
        if (dbErr) {
          reject({
            message: 'Error in findng user by Id',
            code: 403,
            error: 'ERROR_FINDING_USER',
          });
        } else {
          resolve({
            value: dbRes,
            message: 'Finding User Successfully',
          });
        }
      })
    })
  }

  function updateUserDetails(data) {
    return new Promise((resolve,reject) => {
      User.findOneAndUpdate({userId: data.id}, data.updateData, (dbErr,dbRes) => {
        if (dbErr) {
          reject({
            message: 'Error in findng user by Id',
            code: 403,
            error: 'ERROR_FINDING_USER',
          });
        } else {
          resolve({
            value: dbRes,
            message: 'Updated Successfully',
          });
        }
      })
    })
  }

  return {
    createUserServices,
    getUserDetailsByMail,
    getUserDetailsById,
    updateUserDetails,
  };
};