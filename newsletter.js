const express = require("express");
const bodyparser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res){
  const f_name = req.body.firstname;
  const l_name = req.body.lastname;
  const e_mail = req.body.email;

  var data = {
    members: [{
      email_address: e_mail,
      status: "subscribed",
      merge_fields: {
        FNAME: f_name,
        LNAME: l_name
      }
    }]
  };

  var jsonData = JSON.stringify(data);
  const url =   "https://us7.api.mailchimp.com/3.0/lists/e4404acfed"
  const options = {
    method: "POST",
    auth: "sing9014:e1fb1509bf59e2c630d1f4bc6d1ac1ff-us7"
  };

  const request = https.request(url, options, function(response){

    if (response.statusCode == 200)
    {
      res.sendFile(__dirname + "/success.html");
    }
    else
    {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function(data){
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

//Dynamic Port that heroku will choose.
app.listen(process.env.PORT || 3000, function(){
  console.log("Server is Up and Running on port: 3000");
});

//API Key
//e1fb1509bf59e2c630d1f4bc6d1ac1ff-us7

//Audience ID
//e4404acfed
