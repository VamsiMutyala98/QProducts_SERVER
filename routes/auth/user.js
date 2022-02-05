// exports.get = function (req, res, next) {
//   res.send('hello world');
// };

module.exports = {
  POST: {
    url: '/api/QP/create/user',
    handler: (req,res) => {
      const data = {
        fullName: req.body.fullName,
        email: req.body.email,
        password: req.body.password,
      };
      console.log(data);
    }
  }
}
