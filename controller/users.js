const { selectAllUsers } = require("../model/users");

exports.getAllUsers = (req, res, next) => {
  selectAllUsers().then((users) => {
    res.status(200).send({ users });
  });
};
