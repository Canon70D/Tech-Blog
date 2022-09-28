const { User } = require("../models");

const seedUser = async () => {
  const user = {
    username: "Test Name 1",
    email: "test@test.com",
    password: "123456789",
  };
  const newUser = await User.create(user);
  return newUser.id;
};

module.exports = seedUser;
