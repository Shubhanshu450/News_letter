const express = require('express');
const bodyParser = require('body-parser');
//we use bodyParser so that we can get the values from other pagers.
const request = require('request');
const https = require('https');

const app = express();

app.use(bodyParser.urlencoded({
  extened: true
}));

app.use(express.static("public"));
/*here we use public folder because we get our bootstrap style sheet from remote location
 but our custom style sheet is local and our page is static so in order
to use server or local host: 3000 we need to use static and public is just a folder name it could be any.*/

app.get("/", function(req, res) {
  res.sendfile(__dirname + "/sign_up-page.html");
});

app.post("/", function(req, res) {
  const first = req.body.fisrtname;
  const last = req.body.lastname;
  const email = req.body.email;

  // mailchamp server interraction here we get the member of mailchamp those we use in our letter sign up.
  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: first,
        LNAME: last
      }
    }]
  };

  const jasonData = JSON.stringify(data);
  // here we are converting java date in flat pack jason and .stringify is used to turn that json data in strings.

  const url = "https://us10.api.mailchimp.com/3.0/lists/721257a1f2";

  const options = {
    method: "POST",
    auth: "Shubhanshu:8ca60774e1f75ab02e0b7ca3da287b70-us10"
  }

  const request = https.request(url, options, function(response) {
    if (response.statusCode === 200) {
      res.sendfile(__dirname + "/success-page.html");
    } else {
      res.sendfile(__dirname + "/fail-page.html")
    }
    response.on("data", function(data) {
      console.log(JSON.parse(data));
    })
  })
  request.write(jasonData);
  request.end();

});

app.post("/fail-page", function(req, res) {
  res.redirect("/")
})


//below here process.env.PORT  is used to deploy our app in heroku and this is defined by HEROKU.
app.listen(process.env.PORT || 3000, function() {

  console.log("I'm listing Shubhanshu...");

});









/*IMPORTANT: AFTER MAKING ALL THIS WE NEED TO HEROKU TO GET OUR NEWSLETTER ONLINE. */
//for other stuffs read secrets file
