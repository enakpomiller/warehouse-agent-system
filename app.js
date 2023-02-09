const express = require('express');
const exphbs = require('express-handlebars');
  //const router = require('./routes/agent.js')
const bodyPaser = require('body-parser');
const {Sequelize, QueryTypes, EmptyResultError} = require("sequelize");
const bcrypt = require("bcrypt");
const mysql = require('mysql');
const path = require('path');
const multer = require('multer');
const session = require('express-session');
const fs = require('fs');

const app = express(); 
// creating middle ware for handlebars
//  app.engine('handlebars', exphbs.engine({ defaultLayout: 'main'}));
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main'}));
app.set('view engine','handlebars');
// body parser
app.use(bodyPaser.urlencoded({ extended : false}))
// set static folder
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static("public"));
app.use("/uploads",express.static("uploads"));
// sesseion middle ware 
  app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }))

   //app.use('/agent',router); 
// setting basic routing
app.get('/', (req, res)=> res.render('index',{ layout:'landing'}));
// connecting to our route


const PORT = process.env.PORT || 4500;
app.listen(PORT, console.log(`app running at port ${PORT}`));


// linking to database via sequelize
const sequelize = new Sequelize('warehuse_system', 'root', '', {
  dialect: "mysql",
});
// test the connection
sequelize.authenticate().then(() => {
  console.log(' connection to database is successful');
}).catch((error) => console.log(error, ' sorry an eror'));

// desing product   table
const tbl_product = sequelize.define('tbl_product', {
  prod_name: Sequelize.STRING,
  prod_price: Sequelize.STRING,
  prod_brand: Sequelize.STRING,
  prod_weight: Sequelize.STRING,
  filename: Sequelize.STRING,
  path:Sequelize.STRING,
  category:Sequelize.STRING,
  date: Sequelize.STRING,
}, { tableName: "tbl_product" }
);
// executing the command to create table
tbl_product.sync();
// design customer table
const tbl_customer = sequelize.define('tbl_customer',{
  firstname:Sequelize.STRING,
  othernames:Sequelize.STRING,
  email:Sequelize.STRING,
  password:Sequelize.STRING,
  gender:Sequelize.STRING,
  address:Sequelize.STRING
},{ tablename:"tbl_customer"});
tbl_customer.sync();

// design agent table
const tbl_agent = sequelize.define('tbl_agent', {
  firstname: Sequelize.STRING,
  othernames: Sequelize.STRING,
  email: Sequelize.STRING,
  password: Sequelize.STRING,
  phone: Sequelize.STRING,
  address: Sequelize.STRING,
  category:Sequelize.STRING,
  date: Sequelize.STRING,
}, { tableName: "tbl_agent" }
);
// executing the command to create table
tbl_agent.sync();

// customer negotiating table
const tbl_cust_negotiate = sequelize.define('tbl_cust_negotiate', {
    prod_name: Sequelize.STRING,
    prod_price: Sequelize.STRING,
    prod_brand: Sequelize.STRING,
    cust_price: Sequelize.STRING,
    token: Sequelize.STRING,
    path:Sequelize.STRING 
},{tablename:"tbl_cust_negotiate"});
tbl_cust_negotiate.sync();

// customer negotiating response table
const tbl_cust_negotiate_respnse = sequelize.define('tbl_cust_negotiate_respnse', {
  prod_name: Sequelize.STRING,
  prod_price: Sequelize.STRING,
  prod_brand: Sequelize.STRING,
  cust_price: Sequelize.STRING,
  token: Sequelize.STRING,
  path:Sequelize.STRING,
  decision:Sequelize.STRING
},{tablename:"tbl_cust_negotiate_respnse"});
tbl_cust_negotiate_respnse.sync();

// ware house  login able
const tbl_admin = sequelize.define('tbl_admin', {
  username: Sequelize.STRING,
  password: Sequelize.STRING,
},{tablename:"tbl_admin"});
tbl_admin.sync();

// agent negotiating table
const tbl_agent_negotiate = sequelize.define('tbl_agent_negotiate', {
  prod_id: Sequelize.STRING,
  prod_name: Sequelize.STRING,
  prod_price: Sequelize.STRING,
  prod_brand: Sequelize.STRING,
  cust_price: Sequelize.STRING ,
  token:Sequelize.STRING,
  path:Sequelize.STRING 
},{tablename:"tbl_cust_negotiate"});
tbl_agent_negotiate.sync();

// Admin nreply  table
const tbl_admin_reply = sequelize.define('tbl_admin_reply', {
  prod_id: Sequelize.STRING,
  prod_name: Sequelize.STRING,
  prod_price: Sequelize.STRING,
  prod_brand: Sequelize.STRING,
  cust_price: Sequelize.STRING ,
  token:Sequelize.STRING, 
  path:Sequelize.STRING,
  accept: Sequelize.STRING,
  reject:Sequelize.STRING
},{tablename:"tbl_admin_reply"});
 tbl_admin_reply.sync();




app.get('/agent/wareh',(req,res) => {
  //res.send(" ware house min");
   res.render("wareh");
});

// Start file upload using multer
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const dir = "uploads/";
    !fs.existsSync(dir) && fs.mkdirSync(dir);
    callback(null, "uploads/");
  },
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    let ext = file.originalname.lastIndexOf(".");
    ext = file.originalname.substr(ext + 1);
    callback(null, `${file.fieldname}-${uniqueSuffix}.${ext}`);
  },
});

const upload = multer({ storage });

app.post('/agent/wareh',upload.single("filename"),(req,res) => {
  try{
    const {prod_name,prod_price,prod_brand,prod_weight,filename,path,category,date} = req.body;
     if(prod_name=="" || prod_price=="" || prod_brand=="" || prod_weight=="" || filename=="" || category=="" || date==""){
      res.render("wareh",{msg_err:" please fill the entries"});
    }else{ 
      console.log(req.file.path);
      const SaveUser = tbl_product.build({
        prod_name,
        prod_price,
        prod_brand,
        prod_weight,
        filename:req.file.filename,
        path:req.file.path,
        category:category,
        date:date
       })
    
        SaveUser.save();
        res.render("wareh",{msg_create:" Product Created Successfully"});
    }

  }catch(err){
   console.log({message:err})  
  }

})

// create agent account
app.get('/agent/agent_reg',(req,res) => {
   res.render("agent_reg");
}) 

app.post('/agent/agent_reg',async(req,res) =>{
  
   try{
     const {firstname,othernames,email,password,phone,address,category,date} = req.body;
     const fetchware = await tbl_product.findOne({where:{category:category}});
     if(firstname =="" || othernames=="" || email=="" || password=="" || phone=="" || category=="" || date==""){
      res.render("agent_reg",{msg_err:" please fill all feilds"});
    }else{
      const CreateAgent = tbl_agent.build({
              firstname:firstname,
              othernames:othernames,
              email:email,
              password:password,
              phone:phone,
              address:address,
              category:category,
              date:date
            })
            CreateAgent.save();
            res.render("login",{agent_created:" Accounted Created successfully! please login"});
    }            
  }catch(err){
      console.log(err);
  }

}); 

// create customer 
app.get('/agent/cust_reg',(req,res) => {
   res.render('cust_reg');
})

app.post('/agent/cust_reg',async(req,res) => {
  // if(firstname=="" || othernames=="" || email=="" || password=="" || gender=="" || address==""){
  //   res.render("cust_reg",{form_err:" please fill all entries"});
  //  }
  const {firstname,othernames,email,password,gender,address} = req.body;
  const CheckUser = await tbl_customer.findOne({ where: { email: email } })
    if(CheckUser){
     res.render("cust_reg",{cust_exist:" That user already exist"});
    } 
     else if(firstname=="" || othernames=="" || email=="" || password=="" || gender=="" || address==""){
      res.render("cust_reg",{form_err:" please fill all entries"});
    }
    
    else{
      const CreateCustomer = tbl_customer.build({
      firstname:firstname,
      othernames:othernames,
      email:email,
      password:password, 
      gender:gender,
      address:address
      })
      CreateCustomer.save();
      res.render("cust_login",{cust_created:" Accounted Created successfully! please login"});
    }
})

//customer login
app.get('/agent/cust_login',(req,res) => {
  res.render("cust_login");
})
app.post('/agent/cust_login',async(req,res,next) => {
  try{
    const {email,password,category} = req.body;
    const CheckUser = await tbl_customer.findOne({where:{email:email,password:password}});
    if(CheckUser && category=="listing"){
       const getall = await tbl_product.findAll();
       req.session.loggedin = true;
       const userid = req.session.id = CheckUser.id;
       res.render("prod_listing",{getall,userid});
    }else if(CheckUser && category=="feedback"){
       const userID = CheckUser.id;
       const GetCust = await tbl_cust_negotiate_respnse.findAll({where:{token:userID}});
       res.render("feedback",{GetCust});
     
    }else{
      res.render("cust_login",{cust_ogin_error:" Incorrect Login Credentials "});
    }
  }catch(err){
   console.log(err);
  }
})
 // change password
 app.get("/agent/changepass",(req,res) =>{
    res.render("changepass");
 })

 // changepasswor logic 
 app.post("/agent/changepass",async (req,res) =>{
  try{
     const {email,password,newpassword} = req.body;
     const checkemail = await tbl_customer.findOne({where:{email:req.body.email}});
     if(checkemail){
        if(password == newpassword){
           const changepassword = await tbl_customer.update({password:newpassword},{where:{email:email}});
           if(changepassword){
            res.render("changepass",{changepass:" password changed successfully"});
          }
        }else{
          res.render("changepass",{passmismatch:" password mismatch "});
        }
    }else{
     res.send(" does not exist");
    }
  }catch(error){
   console.log(error);
  }


})


// agent login 
  app.get('/agent/login',(req,res) => {
    res.render("login");
  })

app.post('/agent/login',async(req,res) => {
    try{
      const {email,password} = req.body;
      const CheckUser = await tbl_agent.findOne({where:{email:email,password:password}});
       //const names = CheckUser.firstname+" "+CheckUser.othernames;
        // const getall = await tbl_product.findOne({where:{email:email}});
       if(CheckUser){
          req.session.loggedin = true;
          const session = req.session.email = email ;
          const set = await tbl_agent.findOne({where:{email:email}});
          const identify = set.category;
          const getall = await tbl_product.findAll({where:{category:identify}});
         if(getall){
          res.render("product_dash",{getall,session});
        }else{
           console.log(" cannot get data");
        }
       ;
      
      }
      else{
        res.render("login",{agentlogin_error:" Incorrect Login Credentials "});
      }
    }catch(err){
     console.log(err);
    }
})

app.get('/agent/prod_listing',async(req,res) => {
   try{
    const getall = await tbl_product.findAll();
      req.session.loggedin = true;
      if(req.session.loggedin){
      res.render("prod_listing",{getall});
     }else{
     res.send(" please login first ");
    }
   
  }catch(err){
   console.log(err);
  }
 
})

app.get('/agent/negotiate/:id',async (req,res) => {
  try{
    const id = req.params.id;
    req.session.loggedin = true;
    if(req.session.loggedin){
      const getall = await tbl_product.findAll({where:{id:id}});
      if(getall){
        res.render("negotiate",{getall});
      }else{
       res.send(" cannot get data");
      }
     
    }else{
     console.log(" you must login first");
    }
 
  }catch(err){
   console.log(err)
  }
    
})


app.post('/agent/negotiate/:id',async(req,res) => {
   try{
    const {prod_name,prod_price,prod_brand,cust_price,token,path} = req.body;
    const checkuser = await tbl_customer.findOne({where:{id:req.body.token}})
 if(checkuser){ 
    if((prod_name)){
      const negotiate = await tbl_cust_negotiate.build({
        prod_name: prod_name,
        prod_price: prod_price,
        prod_brand: prod_brand,
        cust_price: cust_price,
        token:token,
        path:path   
      });
      negotiate.save();
       res.render("user_form",{cust_neg_flash:" Negotiation Has Been Sent Successfully, Agent will Respond to you shortly"});
    }else{
      res.render("negotiate");
    }
  }else{
    res.render("user_form",{token_err:" Wrong Token "});
  }

  }catch(err){
   console.log(err)
  }
})


app.get('/agent/agent_nego',async(req,res) => { 
   try{
      const getclientmsg = await tbl_cust_negotiate.findAll();
      if(getclientmsg){
       res.render("agent_nego",{getclientmsg});
      }else{
       console.log(" No Message From Client ");
      }

  }catch(err){
    console.log(err);
  }
   
})


app.post('/agent/agent_nego',async(req,res) => {
  try{
   const {prod_id,prod_name,prod_price,prod_brand,cust_price,token,path} = req.body;
   if((prod_name)){
     const AgentNegotiate = await tbl_agent_negotiate.build({
       prod_id:prod_id,
       prod_name: prod_name,
       prod_price: prod_price,
       prod_brand: prod_brand,
       cust_price: cust_price,
       token:token,
       path:path
     });
     AgentNegotiate.save();
      res.render("agent_form",{agent_neg_flash:" Message Sent to ware house  Successfully  "});
   }else{
     res.render("agent_nego");
   }
 }catch(err){
  console.log(err)
 }
}) 


//admin login
app.get('/agent/admin_login',(req,res) => {
  res.render("admin_login");
})

app.post('/agent/admin_login',async(req,res) => {
  try{
    const {username,password} = req.body;
    const CheckUser = await tbl_admin.findOne({where:{username:username,password:password}});
     //const names = CheckUser.firstname+" "+CheckUser.othernames;
      // const getall = await tbl_product.findOne({where:{email:email}});
    if(CheckUser){
        req.session.loggedin = true;
        const session = req.session.username = username ;
        const getall = await tbl_product.findAll();
       if(getall){
        res.render("admin_dashboard",{getall,session});
      }else{
         console.log(" cannot get data");
      }
    
    }
    else{
      res.render("admin_login",{adminlogin_error:" Incorrect Login Credentials "});
    }
  }catch(err){
   console.log(err);
  }
}) 

//admin negotiation board
app.get('/agent/admin_nego',async (req,res) => {
  try{
    const getfull = await tbl_agent_negotiate.findAll();
    if(getfull){
     res.render("admin_nego",{getfull});
    }else{
     console.log(" No Message From Client ");
    }
 }catch(err){
   console.log(err);
 }

})

app.post('/agent/admin_nego',async(req,res) => {
  try{
    const {prod_id,prod_name,prod_price,prod_brand,cust_price,token,path,accept,reject} = req.body;
    
        const InsertAdmin = await tbl_admin_reply.build({
          prod_id:prod_id,
          prod_name: prod_name,
          prod_price: prod_price,
          prod_brand: prod_brand,
          cust_price: cust_price,
          token:token,  
          path:path,
          accept:accept,
          reject:reject
          

        });
        InsertAdmin.save();
        res.render("admin_form",{admin_sent:" Response sent to Agent"});

  }catch(err){
   console.log(err)
  }
}) 

// ware house response
app.get('/agent/wh_resp',async(req,res) => {
   const getwarehouse = await tbl_admin_reply.findAll();
    if(getwarehouse){
      console.log(getwarehouse);
      res.render("wh_resp",{getwarehouse});
    }else{
     console.log(" cannot get data");
    }
 
})  

app.post('/agent/to_customer',async(req,res) => {
  try{
   const {prod_id,prod_name,prod_price,prod_brand,cust_price,token,path,decision} = req.body;
   if((prod_name)){
     const GetCusResponse = await tbl_cust_negotiate_respnse.build({
       prod_id:prod_id,
       prod_name: prod_name,
       prod_price: prod_price,
       prod_brand: prod_brand,
       cust_price: cust_price,
       token:token,
       path:path,
       decision:decision
     });
     console.log(GetCusResponse);
     GetCusResponse.save();
      res.render("agent_form",{agent_neg_flash:" Message Sent to customer  Successfully  "});
   }else{
     res.render("agent_nego");
   }
 }catch(err){
  console.log(err)
 }
}) 

// delete 
app.get("/agent/admin_delete/:id",async (req,res) =>{
   try{
    const DelRec = await tbl_agent_negotiate.destroy({where:{id:req.params.id}});
    if(DelRec){
      res.render("admin_form",{delrec:" Record deleted successfully "});
    }else{
     console.log(" cannot delete ");
    }
  }catch(error){
   console.log(error);
  }

});

app.get("/agent/more",async (req,res) => {
  try{
    const getclientmsg = await tbl_cust_negotiate.findAll();
    if(getclientmsg){
     res.render("more",{getclientmsg});
    }else{
     console.log(" No Message From Client ");
    }

}catch(err){
  console.log(err);
}

})

// delete agent record
app.get("/agent/deleterec/:id",async (req,res) => {
    const dele_agent = await tbl_cust_negotiate.destroy({where:{id:req.params.id}})
    if(dele_agent){
      res.render("admin_form",{del_agent:" Agent Record Deleted "})
    }else{
       res.send(" cannot delete ");
    }
});