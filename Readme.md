# Sequelize

Sequelize is an ORM (Object Relational Mapper) is a promise based nodejs ORM.
ORM is a technique to write database queries in Object oriented way in any programming language.

{ Object } <-> Mapping <-> Relational Database

## Install

`npm i sequelize`

## Model

Model basically represents a table in your database.

sequalize.define() is used to create a model.

## Adding Data to Model

We can create an Instance of an Model by using the build() method on the method.

```
model.build({
    // keys and values
})

mode.save()
```

Or we can simply create an instance which will automatically save to database as well without any extra save() call.

```
const instance = await model.create({
    // keys and values
})
```

## Serialize an Sequelize Model Instance

We can Serialize Sequlize instance to an object by toJSON() method, It returns an object with the values without containing any internal sequelize methods or properties.

```
const instance = await model.create({
    // keys and values
})

const obj = instance.toJSON();
```

## Delete an Instance

destroy() method removes the record of current instance from the database.

```
model.destroy()
```

## Reload

We can reset a model instance back to it's values which was created with it's contructor function

```
const user = User.create({
    name: "Adarsh"
})

user.name = "John";
user.reload(); // reverts back to "Adarsh"
```

## Saving specific fields.

We can mention the fields to save if we have to be specific by passing an key named fields with the value of array containing the keys we want to save.

So only the mentioned fields will reflect in the database.

```
model.save({
   fields: ['name', 'age']
})
```

## Increment and Decrement values

We have increment and decrement methods available on the model that can be used on fields containing integer values.

```
const user = User.create({
    name: "adarsh",
    age: 24
});

// Increment age by 2
user.increment({
    age: 2
    // supports mutiple columns at once
})
```

## Create multiple instances at once

We can create multiple instances using model.bulkCreate() method.
It accepts an array of objects to save and also returns an array of objects when executed.

```
const users = User.bulkCreate([
    {
        userName: "Adarsh",
        age: 24
    },
     {
        userName: "John",
        age: 27
    }
]);
```

But it will not validate by default if there is any validation exists on the model. We will have to pass validate key with value true to the bulkCreate method.

```
const users = User.bulkCreate([
    {
        userName: "Adarsh",
        age: 24
    },
     {
        userName: "John",
        age: 27
    }
],
{
    validate: true
});
```

# Model Querying

Sequelize provides alot of methods to get data from the database.

```
const users = await User.findAll(); // returns array
users.forEach(element => element.toJSON())
```

### Selecting by specific attributes.

Returns only the speicifc attributes in the result.

```
const users = await User.findAll({attributes: ['userName', 'password']}); // returns array
users
```

### Alias

We can change the fields of the object by using alias.
We just have to pass an nested array containing array of fieldName and the name to be used as alias.

userName changes to myName
password changes to pwd

```
const users = await User.findAll({attributes:
[
    ['userName', 'myName'],
    ['password', 'pwd']
]}); // returns array
users
```

## Aggregation Functions

Aggregation function performs some operation of multiple records and returns a single value as result.

It exists on sequlize.fn("string", "column to perform operation on")

```
const user = await User.findAll({
    attributes: [[sequelize.fn("SUM", sequlize.col('age')), "howOld"]]
})
```

### exclude a field while querying

To exclude a specific field in an query we can pass exclude key with the value of an array containing the fields to exclude.

```
const users = await User.findAll({
attributes: {
exclude: ["password"]
}
});
```

## Query with Where clause

We can filter result based on some condition for that where clause is used.

```
// find all users based on of some specific age.
const users = User.findAll({
    where: {
        age: 25
    }
});
```

#### OrderBy and GroupBy and Limit

```
// find all users based on of some specific age.
const users = User.findAll({
    where: {
        age: 25
    },
    limit: 2
});

const users2 = User.findAll({
    order: [['age', 'DESC']]
});
```

Grouping is a technique used to group rows of data together based on the values in one or more columns. This is typically done in combination with aggregate functions to perform calculations or summary operations on the grouped data.

```
const users = User.findAll({
  attributes: [
  'username',
  [sequelize.fn("SUM", sequlize.col('age')), 'sum_age']],
  group: 'username'
});
```

## OR Operator

First of all we get the Operator from Sequlize class

```
const {Op} = require('Sequelize');

const user = User.findAll({
    // pass where clause

})
```

#### Find all users with age is greater than 25

```
const usersAbove25 = Users.findAll({
    where: {
        age: {
            [OP.gt]: 25
        }
    }
})
```

#### Find all users with username length is 6

```
const usersAbove25 = Users.findAll({
    where: sequelize.where(sequelize.fn("char_length", sequelize.col("ok")),6 )
})
```

#### Update username to Adarsh where age is 26

```
Users.update(
  {
    username: "Adarsh"
  },
  {
    where: {
      age: {
        [Op.gt]: 1 // Using [Op.gt] for "greater than" condition
      }
    }
  }
)
```

#### Deleting a specific Record and all records.

```
Users.destroy(
{
     where: {
      username: "Yes" // Delete all usernames with Yes
    }
})

Users.destroy(
{
    truncate: true // Deletes all records in the table but does not delete the table.
})
```

#### Utility Functions

```
Users.max("age") // Returns maximum age

```

# Finder Methods

### findByPk

Primary key uniquely identifies a row on the table.
Returns 1 record

```
User.findByPk(28)
```

### findOne

Finds only 1 record

```
User.findOne({
    where: {
        // ...
    }
})
```

### findOrCreate

returns an array with [record, isCreated]

```
const [record, isNewCreated] = await User.findOrCreate({
    where: {
        username: "Adarsh Chakraborty"
    },
    defaults: {
        age: 76
    }
})
```

### findAndCountAll

returns object with rows and count keys.

Find all the records matching the statement along with number of records.

```
const {rows, count} = await User.findAndCountAll({
    where: {
        username: "Adarsh Chakraborty"
    }
})
```

# Getters and Setters

We can customize the data when it is retrived from database or stored in the database.

We can set a get function on any attribute on a model.

```
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
      get(){
        // automatically called when the field value is get
        const rawValue = this.getDataValue('username');
        // this.username calls the get function itself; infinite loop

        return rawValue.toUpperCase();
      },
      set(value) {
        this.setDataValue("name", "24" + value);
      },
    },
  }
);
```

## Virtual Fields

Virtual fields are the fields that don't exists on database but instead they are populated virtually derived from other attributes that do exists.

```
const Student = sequelize.define(
  "student",
  {
    student_id: {
      type: Sequlize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequlize.DataTypes.VIRTUAL,
      get(){
       return this.FieldName;
      },

    },
  }
);
```

## Validators and Constraints

Constraints are rules defined at database level. Like Data type.

```
email: {
      type: Sequlize.DataTypes.STRING,
      validate: {
        isIn: {
          args: [["baaw@gmail.com", "mygmail@ko.com"]],
          msg: "Invalid email bro",
        },
      },
    },
```

## Model-wise Validation

It runs after all the column (fields) specific tests are passed.

```
const Student = sequelize.define(
  "student",
  {
    username: String,

  },
  {
// second arguement
validate: {
    usernamePassMatch(){
        if(this.username == this.password){
            throw new Error("Username and password cannot be same")
        }
    }
}
  });
```

### Replacements

```
// Define the SQL query with placeholders
const sqlQuery = 'INSERT INTO Users (username, email) VALUES (?, ?)';

// Define the replacements as an array
const replacements = ['john_doe', 'john.doe@example.com'];

sequelize.query(sqlQuery, {
  replacements: replacements,
  type: Sequelize.QueryTypes.INSERT,
})
  .then(([results]) => {
    console.log('User inserted successfully.');
  })
  .catch(error => {
    console.error('Error inserting user:', error);
  });
```

With named keys

```
// Define a SQL query with named placeholders
const sqlQuery = 'SELECT * FROM Users WHERE username = :username';

// Define named replacements as an object
const replacements = { username: 'john_doe' };

sequelize.query(sqlQuery, {
replacements: replacements,
type: Sequelize.QueryTypes.SELECT,
})
.then(([results]) => {
  console.log('Retrieved users:', results);
})
.catch(error => {
  console.error('Error retrieving users:', error);
});
```

### Even better: Bind Parameters

```
// Define a SQL query with numbered placeholders
const sqlQuery = 'SELECT * FROM Users WHERE username = $1 AND age >= $2';

sequelize.query(sqlQuery, {
  bind: ['john_doe', 25], // Values to bind to $1 and $2
  type: Sequelize.QueryTypes.SELECT,
})
  .then(([results]) => {
    console.log('Retrieved users:', results);
  })
  .catch(error => {
    console.error('Error retrieving users:', error);
  });
```

Or with named keys

```
// Define a SQL query with numbered placeholders
const sqlQuery = 'SELECT * FROM Users WHERE username = $username AND age >= $age';

sequelize.query(sqlQuery, {
  bind: {
    username,
    age
  }, //Passing an object with named keys instead of array
  type: Sequelize.QueryTypes.SELECT,
})
  .then(([results]) => {
    console.log('Retrieved users:', results);
  })
  .catch(error => {
    console.error('Error retrieving users:', error);
  });
```

## Paranoid Table

In Paranoid Table, data is softly deleted so when deletion occurs it.

Def: It is used for handling soft deletes or archiving records. In some cases, developers implement "soft delete" functionality by adding a "deletedAt" timestamp column to tables and then using Sequelize hooks to prevent records from being permanently deleted.

When Paranoid table is enabled, sequelize automatcally ignores the soft deleted queries on find operations except raw queries.

```
const User = sequelize.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },

}, {
  paranoid: true, // Enable soft delete functionality
  timestamps: true, // Enable timestamps (created at and updated at columns),
  // change the columnName of deletedAt
  deletedAt: "NewColumnNameHere",
});
```

### Hard deleting a record in a paranoid table

Just pass force: true while deleting

```
User.destroy({
  where: {
    // condition
  },
  force: true
})
```

### Restoring a soft deleted record

We can use the restore method on the model to restore a record which was softly deleted.

```
User.restore({
  where: {
    // condition
  }
})
```

### Retriving records even when they are soft deleted.

We can pass paranoid: false in a query when we want it to include soft deleted records.

```
User.findOne({
  paranoid: false
})
```

---

# Associations

Associations are relationships between tables in a database based on common attributes. Primary key and Foreign key.

Primary key uniquely identifies each row in a table. Foreign key is a column or group of column that share a common attribute.

```
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

sequelize
  .sync({
    alter: true,
  })
  .then(() => {
    console.log("Working with updated table");

    let country, capital;

    return Capital.findOne({
      where: {
        capitalName: "Madrid",
      },
    });
  })
  .then((data) => {
    capital = data;
    return Country.create({
      countryName: "USA",
    });
  })
  .then((data) => {
    country = data;
    // country.setCapital(capital);

    // country.getCapital(); // returns promise
    return country.createCapital({
      capitalName: "Washington D.C",
    });
  });

```

```
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
```

### Automatically Deleting all records refrencing to a parent which is being deleted

```
Country.hasOne(Capital, {
  onDelete: 'CASCADE'
});

Capital.belongsTo(Country, {
  onDelete: 'CASCADE'
})
```

### One to Many Relationship

Example of One To Many Relationship.

User Posts. User can make any posts as he wants.

```

const User = sequelize.define(
  "user",
  {
    username: {
      type: Sequlize.DataTypes.STRING,
    },
    password: {
      type: Sequlize.DataTypes.STRING,
    },
  },
  {
    timestamps: false,
  }
);

const Post = sequelize.define(
  "post",
  {
    message: {
      type: Sequlize.DataTypes.STRING,
    },
  },
  {
    timestamps: false,
  }
);

// Utility methods are only given to source model
// that is why we have to write it two times.
User.hasMany(Post, {
  onDelete: "CASCADE",
});
Post.belongsTo(User, {
  onDelete: "CASCADE",
});

let user, posts;
sequelize
  .sync({ alter: true })
  .then(() => {
    // hasMany methods a few more utility methods
    // .addPosts (plural)

    return User.findOne({
      where: {
        username: "admin",
      },
    });
  })
  .then((data) => {
    user = data;

    return Post.findAll();
  })
  .then((data) => {
    posts = data;

    user.addPosts(posts);
    // so now these posts are now owned by user

    // count

  })
  .catch((err) => console.log(err));

```

Count posts

```

let user, posts;
sequelize
  .sync({ alter: true })
  .then(() => {
    // hasMany methods a few more utility methods
    // .addPosts (plural)

    return User.findOne({
      where: {
        username: "admin",
      },
    });
  })
  .then((data) => {
    user = data;

    return user.countPosts();
  })
  .then((data) => {
    // COUNT
    console.log(data);

    // user.addPosts(posts);
    // so now these posts are now owned by user


       // changes the post's userId to null
    return user.removePost(post);
  })
  .catch((err) => console.log(err));

```

Set a Post's User

```

// Utility methods are only given to source model
// that is why we have to write it two times.
User.hasMany(Post, {
  onDelete: "CASCADE",
});
Post.belongsTo(User, {
  onDelete: "CASCADE",
});

let user, posts;
sequelize
  .sync({ alter: true })
  .then(() => {
    // hasMany methods a few more utility methods
    // .addPosts (plural)

    return User.findOne({
      where: {
        username: "admin",
      },
    });
  })
  .then((data) => {
    console.log(data.toJSON());
    user = data;

    // return user.countPosts();
    return Post.findOne(); // firstone
  })
  .then((data) => {
    posts = data;
    console.log(posts.toJSON());

    return posts.setUser(user);
  })
  .then((data) => {
    console.log(data);
  })
  .catch((err) => console.log(err));

```

### Many to Many

Customers and Products.
Customers can purchase many products
Products can be purchased by Many Customers.

Third table is used for this type of association.

In Sequelize, that join table is known as Junction Model

Let's create two tables.

```

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

sequelize
  .sync({ alter: true })
  .then(() => {

  })
  .catch((err) => {
    console.log(err);
  });

```

A Customer has purchased all the products

```

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

let customer, products;
sequelize
  .sync({ alter: true })
  .then(() => {
    // add products
    return Customer.findOne({
      where: {
        customerName: "Adarsh",
      },
    });
  })
  .then((data) => {
    customer = data;

    return Product.findAll();
  })
  .then((data) => {
    products = data;

    customer.addProducts(products);
  })
  .catch((err) => {
    console.log(err);
  });
```

Let's say a product laptop has been purchased by everyone.

```

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

```

By Default, OnDelete and OnUpdate is set to CASCADE for manyToMany Relations so we don't have to mention it

Removes record from junction table automatically by default.
