const Sequlize = require("sequelize");
const sequelize = new Sequlize("sequelize-practice", "root", "zxcvbnm", {
  dialect: "mysql",
});

const Country = sequelize.define(
  "country",
  {
    countryName: {
      type: Sequlize.DataTypes.STRING,
      unique: true,
    },
  },
  {
    timestamps: false,
  }
);

const Capital = sequelize.define(
  "capital",
  {
    capitalName: {
      type: Sequlize.DataTypes.STRING,
      unique: true,
    },
  },
  {
    timestamps: false,
  }
);

// One to One
// HasOne or Belongs To

// Parent has one Child
Country.hasOne(Capital, {
  //   foreignKey: "soccer", // give custom name to foreign key
});

// enables Capital.setCountry()
Capital.belongsTo(Country);

let country, capital;
sequelize
  .sync({
    alter: true,
  })
  .then(() => {
    return Country.findOne({
      where: {
        countryName: "France",
      },
    });
  })
  .then((data) => {
    country = data;
    return Capital.findOne({
      where: {
        capitalName: "Paris",
      },
    });
  })
  .then((data) => {
    capital = data;

    return capital.setCountry(country);
  })
  .then((data) => {
    console.log(data);
  });
//   .then(() => {
//     console.log("Working with updated table");

//     let country, capital;

//     return Capital.findOne({
//       where: {
//         capitalName: "Madrid",
//       },
//     });
//   })
//   .then((data) => {
//     capital = data;
//     return Country.create({
//       countryName: "USA",
//     });
//   })
//   .then((data) => {
//     country = data;
// country.setCapital(capital);

// country.getCapital(); // returns promise
//     return country.createCapital({
//       capitalName: "Washington D.C",
//     });
//   });
