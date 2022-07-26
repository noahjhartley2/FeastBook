const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { json } = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const  objectId = require('mongodb').ObjectId;
const path = require('node:path');
const bcrypt =require('bcrypt');
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');
var crypto = require ('crypto')
require('dotenv').config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const url = process.env.MONGODB_URI;

const { Verify } = require('crypto');
// const cryptoRandomString = require('crypto-random-string');

var corsOptions = {
  // origin: 'http://localhost:19006'
  origin: '*'
}

const validEmail = (email) => {
  return String(email)
  .toLowerCase()
  .match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

//function used to validate the JWT token
function validateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    res.status(401).json({error: 'Unauthorized'});
    return;
  }

  jwt.verify(token, process.env.JWT_KEY, (err, user) => {
    if (err) {
      res.status(401).json({error: 'Forbidden'});
      return;
    }

    req.user = user;
    next();
  });
}

const client = new MongoClient(url);
client.connect();

const port = process.env.PORT || 5000;
const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json());

const buildPath = path.normalize(path.join(__dirname, './web-build'));
app.use(express.static(buildPath));

const rootRouter = express.Router();
/* 
* all your other routes go here
*/


// app.get("/", async (req, res, next)=>
// {
//     const db = client.db("FeastBook");
//     console.log("/ working")
//     res.send("hello")
//     let data = db.collection('Users')
// })

app.get("/api/users", async (req, res, next)=>
{
    const db = client.db("FeastBook");
   
    db.collection('Users').find({}).toArray((err, results) =>
    {
      if (err) throw err

      console.log("users displayed")
      res.json(results)
    })
})

app.get("/api/posts", validateToken,async (req, res, next)=>
{
    const db = client.db("FeastBook");
    const confirmation = req.user;
    console.log(confirmation.login);
   
    db.collection('Posts').find({}).sort({date: -1}).toArray((err, results) =>
    {
      if (err) throw err

      console.log("posts displayed")
      let posts = {results: results, error: err};
      res.json(posts)
    })
})

app.post('/api/login', async (req, res, next) => 
{
  // incoming: login, password
  // outgoing: id, firstName, lastName, error

  let error = 'Invalid login';

  const {login, password } = req.body;

  const db = client.db("FeastBook");

  const results = await db.collection('Users').find({login:{$regex: '^' + login + '$', $options: 'i'}}).toArray();

  let id = -1;
  let firstName = '';
  let lastName = '';

  if (results.length > 0)
  {
    if (results[0].verified === true)
    {
      //must compare password to hash password
      bcrypt.compare(password, results[0].password, (err, result)=> 
      {
        if(err) 
        {
            res.status(401).json({
                message: 'Authenication Failed'
            })
        }
        //jwt
        if(result)
        {
          const token = jwt.sign(
            {login: login},
            process.env.JWT_KEY,
            {expiresIn: "2h"}
          );
          // res.json({token: token})
    
          if( results.length > 0)
          {
            id = results[0]._id;
            firstName = results[0].firstname;
            lastName = results[0].lastname;
            error = '';
          }

          let ret = { id:id, login: results[0].login, firstname:firstName, lastname:lastName, token: token, error: error};
          res.status(200).json(ret);
        }
        else
        {
          let ret = { id:id, firstname:firstName, lastname:lastName, error: error};
          res.status(200).json(ret);
        }
      })
    }
    else
    {
      res.status(400).json({error: "Not verified check email"})
    }
  }
  else
  {
    let ret = { id:id, firstname:firstName, lastname:lastName, error: error};
    res.status(200).json(ret);
  }


});

app.post('/api/register', async (req, res, next) => 
{
  // incoming: firstName, lastName, login, password, email
  // outgoing: id, firstName, lastName, login, password, error

  let error = '';
  let bool = true;
  let verified = false

  const { firstName, lastName, login, password, email} = req.body;

  const db = client.db("FeastBook");

  const numUsers = await db.collection('Users').find({login:{$regex: '^' + login + '$', $options: 'i'}}).toArray();
  
  if(!validEmail(email)) {
    res.status(400).json({error: 'Invalid Email'})
    return
  }
  const numEmails = await db.collection('Users').find({email:{$regex: '^' + email + '$', $options: 'i'}}).toArray();
  console.log(numEmails)

  let emailToken = crypto.randomBytes(32).toString('hex');

  try
  {
    if(numUsers.length <= 0 && numEmails.length <=0)
    {
      // email verification 
      //password hashing
      bcrypt.genSalt(10, (err,salt)=> 
      {
        bcrypt.hash(password,salt,(err, hash) => 
        {
          if(err)
          {
            res.status(500).json({
                error: err
            });
          }
          else
          {
            // email verification 
            db.collection('Users').insertOne({firstname: firstName, lastname: lastName, login:login, password: hash, email: email, emailToken: emailToken, verified: false, token: null})
            console.log("user added");
            bool = true;

            const message = 
            {
              to: email,
              from: {
                  name: 'Chris @ FeastBook',
                  email:'cvmathew18@gmail.com', 
                  },
              subject: 'Verify Your FeastBook account',
              text:` 
                    Hello, thank you for registering. 
                    Please use this link to verify your account. 
                    https://${req.headers.host}/api/verify-email?token=${emailToken}
                    `,
              html: `
                    <h1>Hello,</h1>
                    <p>Thanks for registering on our site.</p>
                    <p>Please use this link to verify your account.</p>
                    <a href="https://${req.headers.host}/api/verify-email?token=${emailToken}">Verify your account</a>
              `
            };

            try
            {
              sgMail.send(message);
              console.log('Success. Check Your Email to Finish Registration.')
              // res.redirect('/');
            }
            catch(e)
            {
              console.log(error);
              console.log('error', 'Something has gone wrong.');
              // res.redirect('/');
            }
          }
        })
      });
    }
    else
    {
      console.log("User already exists/ email already being used")
      bool = false;
      error = "user already exist / email already being used"
    }
  }
  catch(e)
  {
    error = e.toString();
    bool = false;
  }
  
  let ret = { added:bool, firstName:firstName, lastName:lastName, login:login, email: email, verification: verified, error: error};
  res.status(200).json(ret);
});

app.get('/api/verify-email', async (req, res, next) => {

  const db = client.db("FeastBook");
  console.log("verify email api")
  try {
    const user = await db.collection("Users").find({emailToken: req.query.token}).toArray();
    if (user.length < 0) {
      req.flash('Invalid token');
      res.redirect('/');
    }
    console.log(user);

    db.collection('Users').updateOne({_id: objectId(user[0]._id)}, {$set: {verified: true, emailToken: null}}, function(err, result)
    {
      if (err) 
      {
        throw err;
      }
    })
    console.log("verified updated");
    res.redirect('/');
  }
  catch (error) {
    console.log(error);
    console.log("something went wrong")
    res.redirect('/');
  }
});

app.post('/api/forgotpassword', async (req, res, next) => {

  const {email} = req.body;

  if(!validEmail(email)) {
    res.status(400).json({error: 'Invalid Email'})
    return
  }

  const db = client.db("FeastBook");
  const results = await db.collection('Users').find({email}).toArray();

  if (results.length <= 0)
  {
    res.status(400).json({error: "user does not exist"})
  }

  if (results.length > 0)
  {
    try 
    {
      if (results[0].verified === true)
      {
        let emailToken = crypto.randomBytes(3).toString('hex');

        db.collection('Users').updateOne({_id: objectId(results[0]._id)}, {$set: {emailToken: emailToken}}, function(err, result)
        {
          if (err) 
          {
            throw err;
          }
        })

        const message = {
          to: results[0].email,
          from: {
              name: 'Chris @ FeastBook',
              email:'cvmathew18@gmail.com', 
              },
          subject: 'Reset your Password',
          text:` 
                Hello, your password must be reset 
                Please use this code to reset your password. 
                ${emailToken}
                `,
          html: `
                <h1>Hello,</h1>
                <p>Your password must be reset.</p>
                <p>Please use this code to reset your password.</p>
                <p>${emailToken}</p>
          `
        };

        try
        {
          await sgMail.send(message);
          console.log('Success. Check Your Email to change password')
          res.status(200).json({error: "", sent: true})
        }
        catch(e)
        {
          console.log(error);
          console.log("something has gone wrong")
        }

      }
      else
      {
        res.status(400).json({error: "please verify"})
      }
    }
    catch
    {
      res.status(500).json({error: "Internal server error"})
    }

  }
  else
  {
    res.status(400).json({error: 'Email does not exist'})
  }

});

app.post('/api/resetpassword', async (req, res, next) => {
  let error = '';
  const db = client.db("FeastBook");
  
  try 
  {
    const {otp, newPassword1, newPassword2} = req.body;
    const user = await db.collection('Users').find({emailToken: otp}).toArray();
    console.log(user)

    if (user.length > 0)
    {
      console.log("in the first if statement");
      if (newPassword1 === newPassword2)
      {
        console.log("passwords match");

        bcrypt.genSalt(10, (err,salt)=> 
        {
          bcrypt.hash(newPassword1,salt,(err, hash) => 
          {
            if(err)
            {
              res.status(500).json({
                  error: err
              });
            }
            else
            {
              db.collection('Users').updateOne({_id: objectId(user[0]._id)}, {$set: {password: hash}}, function(err, result)
              {
                if (err) 
                {
                  throw err;
                }
              })
        
              updated = true;
              console.log("password changes");
              res.status(200).json({error: "", updated: updated})
              // might need to remove 
              // res.redirect('/');
            }
          })
        })
      }
      else
      {
        updated = false;
        error = 'passwords do not match'
        res.status(400).json({error: error, update: updated})
        // might need to remove
        // res.redirect('/');
      }
    }
    else
    {
      error = 'invalid token';
      return res.status(400).json({error: error});
    }

    db.collection('Users').updateOne({_id: objectId(user[0]._id)}, {$set: {emailToken: null}}, function(err, result)
    {
      if (err) 
      {
        throw err;
      }
    })
  }
  catch (error)
  {
    // res.sendStatus(500).json({message: "Server error"})
    console.log("catch error")
  }
});

app.delete('/api/deleteuser', async (req, res, next) => 
{

  // deletes the current user being used and all of their posts

  let error = '';
  let deleted = false
  const { id } = req.body;

  const db = client.db("FeastBook");


  const result = await db.collection('Users').deleteOne({_id: objectId(id)})
  deleted = true;

  if (result.deletedCount > 0)
  {
    console.log("User deleted")
  }

  res.status(200).send(result);
  // let ret = { id:id, deleted: deleted, error:''};
  // res.status(200).json(ret);
});

app.post('/api/searchuser', async (req, res, next) => 
{
  // incoming: userId, search
  // outgoing: results[], error

  let error = '';

  const {search } = req.body;

  let _search = search.trim();
  
  const db = client.db("FeastBook");
  const results = await db.collection('Users').find({login:{$regex: '^'+_search+'.*', $options: 'ir'}}).toArray();
  
  let _ret = [];
  for( var i=0; i<results.length; i++ )
  {
    let temp = 
    {
      login: results[i].login,
      id: results[i]._id
    }
    _ret.push(temp);
  }
  
  let ret = {results:_ret, error:error};
  res.status(200).json(ret);
});

app.post('/api/updateuser', async (req, res, next) => 
{

  // deletes the current user being used and all of their posts

  let error = '';
  let deleted = false
  const db = client.db("FeastBook");

  const { id, firstName, lastName} = req.body;

  let oldfirstName = '';
  let oldlastName = '';


  const old = await db.collection('Users').find({_id: objectId(id)}).toArray();

  db.collection('Users').updateOne({_id: objectId(id)}, {$set: {firstname: firstName, lastname: lastName}}, function(err, result)
  {
    if (err) 
    {
      throw err;
    }
  })
  
  if(old.length > 0 )
  {
    oldfirstName = old[0].firstname;
    oldlastName = old[0].lastname;
  }
  
  let ret = {id: id, oldfirstname: oldfirstName, oldlastname: oldlastName, firstame: firstName, lastname: lastName, error:error};
  res.status(200).json(ret);
});

app.post('/api/updatepassword', async (req, res, next) => 
{

  // updates password while in account

  let error = '';
  let deleted = false
  const db = client.db("FeastBook");

  const { id, currentPassword, newPassword1, newPassword2} = req.body;

  let oldPassword = currentPassword;
  let newpassword = newPassword1;
  let updated = false;

  const old = await db.collection('Users').find({_id: objectId(id)}).toArray();

  if(old.length > 0 )
  {
    if (old[0].password === oldPassword)
    {
      if (newPassword1 === newPassword2)
      {
        db.collection('Users').updateOne({_id: objectId(id)}, {$set: {password: newPassword1}}, function(err, result)
        {
          if (err) 
          {
            throw err;
          }
        })
  
        updated = true;
      }
      else
      {
        updated = false;
        error = 'passwords do not match'
      }
    }
    else
    {
      updated = false;
      error = 'current password incorrect'
    }
  }

  let ret = {id: id, updated: updated, error:error};
  res.status(200).json(ret);
});

app.post('/api/userposts', validateToken, async (req, res, next) => 
{
  // incoming: userId, 
  // return list of their posts
  const confirmation = req.user;
  console.log(confirmation.login);

  let error = 'No posts found';

  const {id} = req.body;

  let id_ = id.trim();
  const db = client.db("FeastBook");
  const results = await db.collection('Posts').find({userid: id_ }).sort({date: -1}).toArray();
  
  let _ret = [];
  for( var i=0; i<results.length; i++ )
  {
    let temp = 
    {
      _id: results[i]._id,
      name: results[i].name,
      photo: results[i].photo,
      likes: results[i].likes,
      ingredients: results[i].ingredients,
      directions: results[i].directions,
      date: results[i].date
    }
    _ret.push(temp);
  }

  if (_ret.length >= 1)
  {
    error = ''
  }
  
  let ret = {results:_ret, error:error};
  res.status(200).json(ret);
});

app.post('/api/createpost', validateToken, async (req, res, next) => 
{
  // incoming: photo, ingredients, directions
  // outgoing: posted or not posted

  const confirmation = req.user;
  console.log(confirmation.login);

  let error = '';
  let bool = true;
  let likes = 0;

  const {userid, name, photo, ingredients, directions} = req.body;

  const db = client.db("FeastBook");
  const user = await db.collection('Users').find({_id: objectId(userid)}).toArray();
  console.log(user[0].login)

  if (user.length > 0)
  {

    db.collection('Posts').insertOne({userid: userid, login: user[0].login, name: name, photo: photo, likes: 0, ingredients:ingredients, directions:directions, favorited: [], date: new Date()})
    console.log("post added");
    bool = true;
  }
  else
  {
    error = 'user does not exist';
    bool = false;
  }
  
  let ret = { added:bool, error: error};
  res.status(200).json(ret);

  // if (user[0].login === confirmation.login)
  // {
  // }
  // else
  // {
  //   let ret = { added:false, error: "unauthorized"};
  //   res.status(200).json(ret);
  // }

});

app.delete('/api/deletepost', validateToken, async (req, res, next) => 
{

  // deletes the current post with the post id

  const confirmation = req.user;
  console.log(confirmation.login);

  let deleted = false
  const {id, postid} = req.body;
  const db = client.db("FeastBook");
  const user = await db.collection('Posts').find({_id: objectId(postid)}).toArray()
  
  if (user.length > 0)
  {
    if (id === user[0].userid)
    {
      const result = await db.collection('Posts').deleteOne({_id: objectId(postid)})
      deleted = true;
      if (result.deletedCount > 0)
      {
        console.log("post deleted");
        res.status(200).send(result);
      }
    }
    else
    {
      console.log("post not deleted id does not match userid");
      let error = 
      {
        error: "id does not match userid",
        deleted: false
    }
      res.status(200).send(error);
    }
  }
  else
  {
    let error = 
    {
      error: "post not in userid",
      deleted: false
    }
    res.status(200).send(error);
  }

  // res.status(200).send(result);
  // let ret = { id:id, deleted: deleted, error:''};
  // res.status(200).json(ret);
});

app.post('/api/likepost', validateToken, async (req, res, next) => 
{
  // incoming: photo, ingredients, directions
  // outgoing: liked true or false
  const confirmation = req.user;
  console.log(confirmation.login);

  let error = '';
  let bool = true;

  const {userid, postid} = req.body;

  const db = client.db("FeastBook");
  const user = await db.collection('Users').find({_id: objectId(userid)}).toArray();
  const post = await db.collection('Posts').find({_id: objectId(postid)}).toArray();

  if (user.length > 0 && post.length > 0)
  {
    db.collection('Posts').updateOne({_id: objectId(postid)}, {$inc: {likes: 1 } }, function(err, result)
    {
      if (err) 
      {
        throw err;
      }
      console.log("post liked");      
    })

    db.collection('Posts').updateOne({_id: objectId(postid)}, {$push: {favorited: {id: userid}} }, function(err, result)
    {
      if (err) 
      {
        throw err;
      }
      console.log("user added to favorited array");      
    })

    // db.collection('Favorites').insertOne({postid: post[0]._id, userid: userid, name: post[0].name, photo: '', likes: post[0].likes, 
    //   ingredients: post[0].ingredients, directions: post[0].directions, date: post[0].date, posterid: post[0].userid})
    bool = true;
  }
  else
  {
    error = 'User or post does not exist';
    bool = false;
  }

  
  let ret = { liked:bool, error: error};
  res.status(200).json(ret);
});

app.post('/api/dislikepost', validateToken, async (req, res, next) => 
{
  // incoming: photo, ingredients, directions
  // outgoing: posted or not posted
  const confirmation = req.user;
  console.log(confirmation.login);

  let error = '';
  let bool = true;

  const {userid, postid} = req.body;

  const db = client.db("FeastBook");
  const user = await db.collection('Users').find({_id: objectId(userid)}).toArray();
  const post = await db.collection('Posts').find({_id: objectId(postid)}).toArray();

  if (user.length > 0 && post.length > 0)
  {
    db.collection('Posts').updateOne({_id: objectId(postid)}, {$inc: {likes: -1 } }, function(err, result)
    {
      if (err) 
      {
        throw err;
      }
      console.log("post disliked");      
    })

    db.collection('Posts').updateOne({_id: objectId(postid)}, {$pull: {favorited: {id: userid}} }, function(err, result)
    {
      if (err) 
      {
        throw err;
      }
      console.log("user removed from favorited array");      
    })

    bool = true;
  }
  else
  {
    error = 'User or post does not exist';
    bool = false;
  }

  
  let ret = { disliked:bool, error: error};
  res.status(200).json(ret);
});

app.post("/api/getfavorite", validateToken, async (req, res, next)=>
{
  const confirmation = req.user;
  console.log(confirmation.login);

  const {userid} = req.body;
  let error = " ";
  const db = client.db("FeastBook");
  const results = await db.collection('Posts').find({favorited: {$elemMatch: {id: userid}}}).sort({date: -1}).toArray();
  console.log(results);

  let posts = {results: results, error: error};
  res.status(200).json(posts)
});

app.post("/api/getuserinfo", async (req, res, next)=>
{
  const {userid} = req.body;
  let error = " ";
  const db = client.db("FeastBook");
  const results = await db.collection('Users').find({_id: objectId(userid)}).toArray();
  console.log(results);

  let posts = {results: results, error: error};
  res.status(200).json(posts)
});

rootRouter.get('(/*)?', async (req, res, next) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});
app.use(rootRouter);

app.listen(port); 