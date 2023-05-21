// client id 107474
//http://www.strava.com/oauth/authorize?client_id=107474&response_type=code&redirect_uri=http://localhost/exchange_token&approval_prompt=force&scope=read_all

const axios = require('axios');
const express = require('express');
const bodyParser = require("body-parser");
const path = require('path');

const app = express();
app.use(express.static('static'));

var tokentest;
var id; 
var firstname;
var lastname; 
var city;
var ytdruns;
var distanceruns;
var movingtimeruns;
var movingtimerides;
var ytdrides;
var distancerides;
var recentrundistances;
var recentruncount;
app.use(bodyParser.urlencoded({ extended: true }))
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/static/index.html'));
});


app.get('/auth', (req, res) => {
    res.redirect(`http://www.strava.com/oauth/authorize?client_id=107474&response_type=code&redirect_uri=http://localhost:3000/exchange_token&approval_prompt=force&scope=activity:read_all`, );
});
const obj ={};
app.get('/exchange_token', ({ query: { code } }, res) => {
    const body = {
        client_id: '107474',
        client_secret: 'a5e587e0312c2bead9fc98f7dffe79875a5189dc',
        code,
    };
    const opts = { headers: { accept: 'application/json' } };
    axios
        .post('https://www.strava.com/api/v3/oauth/token', body, opts)
        .then((_res) => _res.data.access_token)
        .then((token) => {
            console.log('My code:', token); 
            tokentest=token;   
            /*
            const activities_link = `https://www.strava.com/api/v3/athletes/22557403/stats/?access_token=${token}`
            fetch(activities_link)
              .then((res) => (res.json()))
            .then((res) => console.log(JSON.stringify(res)))
        */  
       axios.get(`https://www.strava.com/api/v3/athlete/?access_token=${tokentest}`)
            .then(response => {

                id = response.data.id
                firstname=  response.data.firstname
                lastname = response.data.lastname
                city=response.data.city
                console.log(id + firstname + lastname+ city)

                axios.get(`https://www.strava.com/api/v3/athletes/${id}/stats/?access_token=${tokentest}`)
                .then(response =>{
                    /*
var ytdruns;/
var distanceruns;
var movingtimeruns;
var ytdrides;/
var distancerides;
var recentrundistances;
var recentruncount;
*/
                    ytdruns= response.data.ytd_run_totals.count
                    distanceruns = response.data.ytd_run_totals.distance
                    movingtimeruns = response.data.ytd_run_totals.moving_time
                    distancerides = response.data.ytd_ride_totals.distance
                    ytdrides=response.data.ytd_ride_totals.count
                    movingtimerides = response.data.ytd_ride_totals.moving_time

                    recentrundistances = response.data.recent_run_totals.distance
                    recentruncount = response.data.recent_run_totals.count
                    console.log(ytdruns, distanceruns, movingtimeruns, distancerides, ytdrides,movingtimerides,recentrundistances,recentruncount)
                })
            })
  
        
            
       //   .then((res) => (res.json()))
       // .then((res) => console.log(JSON.stringify(res)))
         res.redirect(`/index2.html`);

       //     console.log(JSON.stringify(obj))
        }).catch((err) => res.status(500).json({ err: err.message }));
});

app.listen(3000)
console.log('3000 port')