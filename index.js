const Sequlize = require("sequelize");
// no need to require mysql as it is used internally by sequelize.

const sequelize = new Sequlize("sequelize-practice", "root", "zxcvbnm", {
  dialect: "mysql",
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection Successful");
  })
  .catch((err) => {
    console.log(err);
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

    const user = User.build({
      userName: "Adarsh",
      password: "1234",
      age: 25,
    });

    console.log(user);
    return user.save();
  })
  .then((data) => {
    console.log(data);
    User.create({
      userName: "John",
      age: 30,
      password: "jkl",
    });
    console.log("Saved to database");
    const obj = data.toJSON();
  })
  .catch((err) => {
    console.log("Error syncing model with database");
  });
