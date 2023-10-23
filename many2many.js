const Sequlize = require("sequelize");
const sequelize = new Sequlize("sequelize-practice", "root", "zxcvbnm", {
  dialect: "mysql",
});

const Customer = sequelize.define(
  "customer",
  {
    customerName: {
      type: Sequlize.DataTypes.STRING,
    },
  },
  {
    timestamps: false,
  }
);

const Product = sequelize.define(
  "product",
  {
    productName: {
      type: Sequlize.DataTypes.STRING,
    },
  },
  {
    timestamps: false,
  }
);

const CustomerProduct = sequelize.define(
  "customerproduct",
  {
    customerProductId: {
      type: Sequlize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    timestamps: false,
  }
);

// Junction table is passed in through
// pass string (table name) to automatically create table
// or just pass the model
Customer.belongsToMany(Product, {
  through: CustomerProduct,
  //   foreignKey: 'customer_id', // custom name for foreign key
});
Product.belongsToMany(Customer, {
  through: CustomerProduct,
});

let customers, product;
sequelize
  .sync({ alter: true })
  .then(() => {
    // add products
    return Customer.findAll();
  })
  .then((data) => {
    customers = data;

    return Product.findOne({
      where: {
        productName: "laptop",
      },
    });
  })
  .then((data) => {
    product = data;
    product.addCustomers(customers);
  })
  .catch((err) => {
    console.log(err);
  });
