const { SequelizeScopeError } = require('sequelize');
const Sequelize = require('sequelize');
const db = require('../config/database');


const create_warehouse = db.define('products',{
   prod_name:{
    type:Sequelize.STRING
  },
  prod_price:{
  type:Sequelize.STRING
 },
 prod_brand:{
 type:Sequelize.STRING
},
 prod_name:{
  type:Sequelize.STRING
 },
 date:{
  type:Sequelize.STRING 
},
})



module.exports = create_warehouse;