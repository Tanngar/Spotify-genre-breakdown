require('dotenv').config({path: '../.env'});

const express = require('express');
const morgan = require('morgan');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const request = require('request');
const port = process.env.PORT || 3001;


const app = express();

app.use(express.static(__dirname + '../../../frontend'))
	.use(morgan('dev'))
	.use(cookieParser())
	.use(cors());

const generateRandomString = length => {
	let text = '';
	let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (let i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
};

const stateKey = 'spotify_auth_state';
let accessToken;
let refreshToken;

app.get('/login', (req, res) => {
	let state = generateRandomString(16);
	res.cookie(stateKey, state);

	let scope = `user-read-private
               user-read-email
               user-library-read
               playlist-read-collaborative
               playlist-read-private`;

	res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
    	response_type: 'code',
    	client_id: process.env.SPOTIFY_CLIENT_ID,
    	scope: scope,
    	redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
    	state: state
    }));
});

app.get('/callback', (req, res) => {
	let authOptions;
	let code = req.query.code || null;
	let state = req.query.state || null;
	let storedState = req.cookies ? req.cookies[stateKey] : null;


  if (state === null || state !== storedState) {
		res.redirect(process.env.FRONTEND_URI + '/login' +
      querystring.stringify({
        error: 'state_mismatch'
      })
		);
	} else {
		res.clearCookie(stateKey);

		authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'))
      },
      json: true
    };
  }

  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {

      accessToken = body.access_token,
      // refreshToken = body.refresh_token;

      res.redirect(process.env.FRONTEND_URI + '/account');
    }
  });
});

app.get('/liked-songs', (req, res) => {
  let result = {
    name: 'Liked Songs',
    numOfTracks: ''
  };

  let options = {
    url: 'https://api.spotify.com/v1/me/tracks',
    headers: { 'Authorization': 'Bearer ' + accessToken },
    json: true
  };

  request.get(options, (error, response, body) => {
    result.numOfTracks = body.total;

    res.send(result);
  });
});

app.get('/playlists', (req, res) => {
  let result = [];

  let options = {
    url: 'https://api.spotify.com/v1/me/playlists',
    headers: { 'Authorization': 'Bearer ' + accessToken },
    json: true
  };

  request.get(options, (error, response, body) => {
    console.log(body.items);
    for(let item of body.items) {
      result.push({
        id: item.id,
        name: item.name,
        numOfTracks: item.tracks.total
      });
    }

    res.send(result);
  });
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
});
