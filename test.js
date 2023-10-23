const Sequlize = require("sequelize");
const sequelize = new Sequlize("sequelize-practice", "root", "zxcvbnm", {
  dialect: "mysql",
});
const Student = sequelize.define(
  "student",
  {
    student_id: {
      type: Sequlize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequlize.DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [4, 20],
      },
      get() {
        // automatically called when the field value is get
        const rawValue = this.getDataValue("name");
        // this.username calls the get function itself; infinite loop

        return rawValue.toUpperCase();
      },

      set(value) {
        this.setDataValue("name", "24" + value);
      },
    },
    favourite_class: {
      type: Sequlize.DataTypes.STRING(25),
      defaultValue: "Computer Science",
    },
    school_year: {
      type: Sequlize.DataTypes.INTEGER,
      allowNull: false,
    },
    subscribedToWittCode: {
      type: Sequlize.DataTypes.BOOLEAN,
      defaultValue: true,
    },
    email: {
      type: Sequlize.DataTypes.STRING,
      validate: {
        isIn: {
          args: [["baaw@gmail.com", "mygmail@ko.com"]],
          msg: "Invalid email bro",
        },
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

Student.sync({
  alter: true,
})
  .then(() => {
    console.log("Synced");

    // Student.bulkCreate(
    //   [
    //     {
    //       name: "Adarsh Chakraborty",
    //       favourite_class: "",
    //       school_year: 12,
    //     },
    //   ],
    //   {
    //     validate: true,
    //   }
    // );

    // return Student.findAll({
    //   attributes: ["name", ""],
    //   where: {
    //     [Sequlize.Op.or]: {
    //       favourite_class: "Computer Science",
    //       subscribedToWittCode: true,
    //     },
    //   },
    // });

    // return Student.findAll({
    //   attributes: [
    //     "school_year",
    //     [sequelize.fn("COUNT", sequelize.col("school_year")), "num_students"],
    //   ],
    //   group: "school_year",
    // });

    return Student.create({
      name: "zucc",
      school_year: 12,
      email: "mygmail@ko.com",
    });
  })
  .then((result) => {
    console.log(result.name);
  })
  .catch((err) => console.log(console.log(err)));
