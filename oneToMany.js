const Sequlize = require("sequelize");
const sequelize = new Sequlize("sequelize-practice", "root", "zxcvbnm", {
  dialect: "mysql",
});

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
