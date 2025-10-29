const Sequelize = require("sequelize");
const sequelize = new Sequelize("crud_products", "root", "", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
