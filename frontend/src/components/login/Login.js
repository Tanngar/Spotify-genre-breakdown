import React, { Component } from 'react';

// const frontendUri = 'http://localhost:3000';
const backendUri = 'http://localhost:3001';

export class Login extends Component {
	render() {
    return (
      <React.Fragment>
        <div id="login">
          <button onClick={()=> window.location = backendUri + '/login'}>Log in with Spotify</button>
        </div>
      </React.Fragment>
    );
  }
}

export default Login;
