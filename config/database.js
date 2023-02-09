
const { Sequelize } = require('sequelize');

module.exports = new Sequelize('warehuse_system','root','', {
  host: 'localhost',
  dialect: 'mysql'
     
});

