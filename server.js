const express = require('express');
const axios = require('axios');
const cors = require('cors'); // import cors module
const app = express();

app.use(cors()); // use cors middleware
const client_id = '124800';
const client_secret = '271918a51fa4962cd54a4d4dc71f03426e02fe7e';
const redirect_uri = 'http://localhost:3000/exchange_token';
const scope = 'read,activity:read';

app.get('/', (req, res) => {
    const url = `http://www.strava.com/oauth/authorize?client_id=${client_id}&response_type=code&redirect_uri=${redirect_uri}&approval_prompt=force&scope=${scope}`;
    res.redirect(url);
});

app.get('/exchange_token', async (req, res) => {
    const code = req.query.code;
    const url = 'https://www.strava.com/oauth/token';
    const payload = {
        client_id: client_id,
        client_secret: client_secret,
        code: code,
        grant_type: 'authorization_code'
    };
    const response = await axios.post(url, payload);
    const access_token = response.data.access_token;
    res.redirect(`/activities?token=${access_token}`);
});

app.get('/activities', async (req, res) => {
    const token = req.query.token;
    const url = 'https://www.strava.com/api/v3/athlete/activities';
    const response = await axios.get(url, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const activities = response.data;
    const mapData = activities.map(activity => activity.map);
    res.send(mapData);
});

app.listen(3000, () => console.log('Server started on port 3000'));
