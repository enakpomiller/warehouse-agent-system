// const express = require('express');
// const router = express.Router();
// const create_warehouse = require('../models/Agent_m');
// const { SequelizeScopeError } = require('sequelize');
// const Sequelize = require('sequelize');
// const db = require('../config/database');
// const Op = Sequelize.Op;


// router.get('/agent_reg',(req,res) => {
//      res.render("agent_reg");
//     // res.send(" agent page ");
// });

// router.get('/wareh',(req,res) => {
//     //res.send(" ware house min");
//      res.render("wareh");
// });

// router.post('/wareh',async(req,res) => {
//   const {prod_name,prod_price,prod_brand,prod_weight,prod_image,date} = req.body;
//   let errors = [];
//   if(!prod_price){
//     errors.push({msg_err:" please entr product name"});
//   }
//   if(errors.length >0){
//     res.render("wareh",{
//       errors,
//       prod_name,
//       prod_price,
//       prod_brand,
//       prod_weight,
//       prod_image,
//       date
//     });

//   }else{
//    // insert into database
//     create_warehouse.create({
//       prod_name,
//       prod_price,
//       prod_brand,
//       prod_weight,
//       prod_image,
//       date
//     }) // this will return a promise
//     .then(query_builder =>res.render('/wareh'))
//     .catch(err => console.log(err))
//   }

// });



// router.get('/login',(req,res) => {
//   res.render("login");
// })

// router.get('/product_dash',(req,res) => {
//   res.render('product_dash');
// })

// router.get('/prod_listing',(req,res) =>{
//  res.render('prod_listing');
// })

// // export the modules
// module.exports = router;