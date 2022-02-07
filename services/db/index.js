const getUserServices = require('./users');

module.exports = function initServices() {
  const UserServices = getUserServices();

  return {
    UserServices,
  };
};