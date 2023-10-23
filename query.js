const Sequlize = require("sequelize");
const { Op } = require("sequelize");
// no need to require mysql as it is used internally by sequelize.

const sequelize = new Sequlize("sequelize-practice", "root", "zxcvbnm", {
  dialect: "mysql",
});

const User = sequelize.define(
  "user",
  {
    userId: {
      type: Sequlize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userName: {
      type: Sequlize.DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: Sequlize.DataTypes.STRING,
    },
    age: {
      type: Sequlize.DataTypes.INTEGER,
      defaultValue: 21,
    },
  },
  {
    freezeTableName: true,
  }
);

User.sync({
  alter: true,
})
  .then((data) => {
    console.log("Table and model synced successfully.");
    return User.findAll();
  })
  .then((users) => {
    users.forEach((element) => console.log(element.toJSON()));
    User.findAll({
      attributes: [
        "userName",
        [sequelize.fn("SUM", sequelize.col("age")), "sum_age"],
      ],
      group: "userName",
    });

    return User.findAll({
      where: {
        [Op.or]: {
          userName: "John",
          age: 25,
        },
      },
    });
  })
  .then((groupedData) => {
    console.log(typeof groupedData);
    groupedData.forEach((elem) => console.log(elem.toJSON()));
  })
  .then()
  .catch((err) => {
    console.log(err);
    console.log("Error syncing model with database");
  });
