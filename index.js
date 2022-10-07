const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
var app = express();    
var bodyParser = require('body-parser');   
const cors =require('cors');
var bcrypt =require("bcryptjs");

const jwt = require('jsonwebtoken');
const tokenSecret ="my-token-secret";
// const middleware =require('./middleware.js');

var morgan = require("morgan");  

 var multer =require('multer');
var db = require("./config.js");  
var mongoose = require('mongoose');  
global.__basedir = __dirname;
 var Schema = mongoose.Schema;  

 var usersSchema = new Schema({      
  full_name: { type: String   },    
  email: { type: String   },     
  status: { type: String   },     
  phone_no: { type: String   },     
  password: { type: String },      
},{ versionKey: false }); 

 var appointmentSchema = new Schema({      
  time: { type: String   },       
  date: { type: String   },     
  doc_id: { type: String },       
  pat_id: { type: String },       
  response: { type: String },
  createdAt: { type: String },       
},{ versionKey: false }); 

   
const fileWorker = require('./app/controllers/file.controller.js');
var upload = require('./app/config/multer.config.js');
//var notification = require('./firebaseNotification.js');userSchema

var modeluser = mongoose.model('users', usersSchema, 'users');  
var modelappointment = mongoose.model('appointment', appointmentSchema, 'appointment'); 

// var admin = require("firebase-admin");

// var serviceAccount = require("./homecare-d555c-firebase-adminsdk-fo9y6-2c54b82aef.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

//  async function sendNotificationEvent(){

// 	try{
// var payload = {notification : {title:'Fcm using flutter and node',
// body:'wea are fine now'},
// data:{click_action : "FLUTTER_NOTIFICATION_CLICK"}}
// console.log("data",payload);
// await admin.messaging().sendToTopic('Events',payload);
// }
// catch (error){
// console.log(error);
// }

// }


//express()
  app.use(cors({origin:'*'}));
  app.use(bodyParser.json({limit:'5mb'}));    
  app.use(bodyParser.urlencoded({extended:true, limit:'5mb'}));  
  app.use(express.static(path.join(__dirname, 'public')))
  app.set('views', path.join(__dirname, 'views'))
  app.set('view engine', 'ejs')

  function generateToken(user){
    return jwt.sign({data:user},tokenSecret, {expiresIn: '24h'})
  }

  app.get('/api/users', function (req, res) {
    let user=[
      {
        "id": 1,
        "name": "Leanne Graham",
        "username": "Bret",
        "email": "Sincere@april.biz",
        "address": {
          "street": "Kulas Light",
          "suite": "Apt. 556",
          "city": "Gwenborough",
          "zipcode": "92998-3874",
          "geo": {
            "lat": "-37.3159",
            "lng": "81.1496"
          }
        },
        "phone": "1-770-736-8031 x56442",
        "website": "hildegard.org",
        "company": {
          "name": "Romaguera-Crona",
          "catchPhrase": "Multi-layered client-server neural-net",
          "bs": "harness real-time e-markets"
        }
      },
      {
        "id": 2,
        "name": "Ervin Howell",
        "username": "Antonette",
        "email": "Shanna@melissa.tv",
        "address": {
          "street": "Victor Plains",
          "suite": "Suite 879",
          "city": "Wisokyburgh",
          "zipcode": "90566-7771",
          "geo": {
            "lat": "-43.9509",
            "lng": "-34.4618"
          }
        },
        "phone": "010-692-6593 x09125",
        "website": "anastasia.net",
        "company": {
          "name": "Deckow-Crist",
          "catchPhrase": "Proactive didactic contingency",
          "bs": "synergize scalable supply-chains"
        }
      }];
      res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
          res.setHeader('Content-Range', 5);
         // res.send({ data: categories, total: 5 });
    res.send({data:user})
  })

  //api for get users from database  
app.post("/api/userbyrole",function(req,res){   
  const {email}=req.body;
  modeluser.find({email},{password:0},function(err,data){
   //res.set('Access-Control-Allow-Origin','*');  
             if(err){  
                 res.send(err);  
             }  
             else if(data.length > 0){
              console.log("status", data);
              if(data[0].status == 'admin'){
                modeluser.find({},{password:0},function(err,data){
                  if(err){  
                      res.send(err);  
                  }  
                  else if(data.length > 0){
                  res.send({data});  
                  }
                  else{
                    res.send({data:"no user"});
                  } 
                })
              } else if(data[0].status == 'patient'){
                modeluser.find({status:"doctor"},{password:0},function(err,data){
                  if(err){  
                    res.send(err);  
                  }  
                  else if(data.length > 0){
                  res.send({data});  
                  }
                  else{
                    res.send({data:"no user"});
                  } 
                })
              }
              // res.send({data});  
             }
             else{
               res.send({data:"wrong email"});
             } 
         });  
 })

  //api for get users from database  
app.get("/api/user",function(req,res){   
  modeluser.find({},{password:0},function(err,data){
 
   //res.set('Access-Control-Allow-Origin','*');  
             if(err){  
                 res.send(err);  
             }  
             else if(data.length > 0){
              res.send({data});  
             }
             else{
               res.send({data:"no user"});
             } 
         });  
 }) 
 
 //api for get appointment from database  
 app.get("/api/appointment",function(req,res){   
   modelappointment.find({},function(err,data){
 
   //res.set('Access-Control-Allow-Origin','*');  
             if(err){  
                 res.send(err);  
             }  
             else if(data.length > 0){
              res.send({data});  
             }
             else{
               res.send({data:"no appiontment"});
             }  
         });  
 }) 
 
 
  //api for user login existing from database  modeluser
 app.post("/api/userlogin",async(req,res)=>{  
  res.set('Access-Control-Allow-Origin','*');  
  const {password,email}=req.body;
  // var encryedpassword = await bcrypt.hash(password,10);
  // Validate if user exist in our database
  const user = await modeluser.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
   

   // user
  //  res.status(200).send({data:user});
    res.status(200).send({data:user});
  }
 res.status(200).send({data:"no user"});
  
})


//api for Register user data from database  
app.post("/api/registeruser",async(req,res)=>{   
  // res.set('Access-Control-Allow-Origin','*'); 
 
 const { full_name,email,status,phone_no,password } = req.body;
 
 // Validate if user exist in our database
 const olduser = await modeluser.findOne({ email });

   if (olduser) {
     return res.send({data:"User Already Exist"});
   }

  var encryedpassword = await bcrypt.hash(password,10).catch(error => {
    console.log("error: ",error);
  });
  // Create student in our database

  console.log("data: ",req.body);
   // Create student in our database
   var mod = new modeluser({
     full_name,
     email,
     status,
     phone_no, // sanitize: convert email to lowercase
     password: encryedpassword,
   });  
    
   // mod.save(function(err,data){  
   //     if(err){  
   //         res.send({data:err});                
   //     }  
   //     else{        
   //         res.send({data:"User has been Inserted..!!"});  
   //     }  
   // });  
   mod.save()
     .then(
     user => {
       res.status(200).send({data:user})
     })
     .catch(error => {
       res.status(400).send({data:error})
     })
})


  //api for reset student password from database  
 app.post("/api/resetstudentpass",async(req,res)=>{  
  res.set('Access-Control-Allow-Origin','*');  
  const {password,oldpassword,id_no}=req.body;
  var encryedpassword = await bcrypt.hash(password,10);
  // find user by id
  const student = await modelstudent.findOne({ id_no:id_no });
  if (student && (await bcrypt.compare(oldpassword, student.password))) {
     //update user password
    modelstudent.findByIdAndUpdate(id, { password:  encryedpassword,},   
      function(err) {  
       if (err) {  
       res.send(err);  
       return;  
       }  
       res.status(200).send({data:"Record has been Updated..!!"});  
       });  
  }
  else{
    res.status(400).send({data:"no student"});
  }
 
 })



  //api for doctor appointment  from database  
 app.post("/api/doctorappointment",function(req,res){  
  //res.set('Access-Control-Allow-Origin','*');  
  const {email}=req.body;
  console.log("data: ",req.body);
  modeluser.find({email},{password:0},function(err,data){
    //res.set('Access-Control-Allow-Origin','*');  
    if(err){  
        res.send(err);  
    }  
    else if(data.length > 0){
      if(data[0].status == 'admin'){
        modelappointment.aggregate([{$lookup: {from:"users",localField:"pat_id",foreignField:"id",as:"userDetails"}}],
          // modelappointment.find({doc_id},  
        function(err,data) {  
          if (err) {  
          res.send({data:"error"});  
          
          } 
          else if(data.length > 0){
          res.send({data});  
          }
          else{
            res.send({data:"no appointment"});
          }
          });  
      }
      else if(data[0].status == 'doctor'){
        modelappointment.aggregate([{$lookup: {from:"users",localField:"pat_id",foreignField:"id",as:"userDetails"}},{$match:{doc_id:data[0]._id}}],
          // modelappointment.find({doc_id},  
        function(err,data) {  
          if (err) {  
          res.send({data:"error"});  
          
          } 
          else if(data.length > 0){
          res.send({data});  
          }
          else{
            res.send({data:"no appointment"});
          }
          });  
      }
      else{
        modelappointment.aggregate([{$lookup: {from:"users",localField:"doc_id",foreignField:"id",as:"userDetails"}},{$match:{pat_id:data[0]._id}}],
          // modelappointment.find({doc_id},  
        function(err,data) {  
          if (err) {  
          res.send({data:"error"});  
          
          } 
          else if(data.length > 0){
          res.send({data});  
          }
          else{
            res.send({data:"no appointment"});
          }
          });  
      }
    }
  })
 }) 

 //api for patient appointment  from database  
 app.post("/api/patientappointment",function(req,res){  
  //res.set('Access-Control-Allow-Origin','*');  
  const {pat_id}=req.body;
  console.log("data: ",req.body);
  // modelappointment.find({pat_id}, 
  modelappointment.aggregate([{$lookup: {from:"users",localField:"doc_id",foreignField:"id",as:"userDetails"}},{$match:{pat_id}}], 
 function(err,data) {  
  if (err) {  
  res.send({data:"error"});  
  
  } 
  else if(data.length > 0){
   res.send({data});  
  }
  else{
    res.send({data:"no appointment"});
  }
  });  
 }) 


 
 app.post('/api/files/upload', upload.single("image"), fileWorker.uploadFile);
 
 app.get('/api/files/getall', fileWorker.listAllFiles);
 
 app.get('/api/files/:filename', fileWorker.readFiles);
 
 app.post('/api/photo',function(req,res){
   upload(req,res,function(err){
     if(err){
       return res.send("error uploading file");
     }
     res.send("file is uploaded");
   })
 })
  
   
 //api for Insert appointment from database  
 app.post("/api/saveappointment",function(req,res){   
   //res.set('Access-Control-Allow-Origin','*'); 
   console.log("data: ",req.body);
     var mod = new modelappointment(req.body);  
     
         mod.save(function(err,data){  
             if(err){  
                 res.send({data:err});                
             }  
             else{        
                  res.send({data:"Post has been Inserted..!!"});  
             }  
         });  
 }) 
 
  app.get('/', (req, res) => res.render('pages/index'))
  app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
