// seed all the data
const sequelize = require("../config/connection");
const userSeed = require("./userSeed");
const postSeed = require("./postSeed");
const commentSeed = require("./commentSeeds");
(async () => {
  await sequelize.sync({ force: true });

  const userId = await userSeed();
  console.log("\n---------- User Seeded ----------\n");

  const postIds = await postSeed(userId);
  console.log("\n---------- Post Seeded ----------\n");

  await commentSeed(userId, postIds);
  console.log("\n---------- comment Seeded ----------\n");

  process.exit(0);
})();
