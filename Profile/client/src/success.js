import React, { Component } from 'react';
import { encode } from 'querystring';         // https://nodejs.org/api/querystring.html
const DEBUG = process.env.REACT_APP_DEBUG ? console.log : function () {};

/* The . */ 
class Success extends Component {
  constructor(props) {
// Removed in production build (https://create-react-app.dev/docs/adding-custom-environment-variables/)    
//if (process.env.NODE_ENV !== 'production') {
//}
    //
    props.context.appState = props.context.appState || {};
    super(props);

    this.state = {
      continue: props.context.appState.continue
    };

    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    var that=this;
    that.props.context.auth0Client.getTokenSilently({
      audience: process.env.REACT_APP_PROFILE_AUDIENCE,
      appState: that.props.context.appState,
      scope: 'profile:account',
    })
    .then((token) => {
      window.location.href = "https://" + process.env.REACT_APP_AUTH0_DOMAIN + "/continue?" + encode({
        state: that.props.context.appState.state,
        companion: token
      })
    })
    .catch(error => {
      DEBUG(error);
      that.setState({
        executing: false,
        executed: true,
        error: error
      });
    });
  }

  render() {
    if (this.state.continue) {
      return(
        <div className="stepSuccess">
          <div style={{textAlign: 'center', fontSize: '20px', lineHeight: '1', paddingBottom: '20px'}}>
            <p>Thanks; you're done for now and can continue.</p>
            <button style={{backgroundColor: "greenyellow", paddingTop: 9, paddingBottom: 9}} onClick={this.handleClick}>
              Continue
            </button>            
          </div>
        </div>                
      );
    } else {
      return(
        <div className="stepSuccess">
          <div style={{textAlign: 'center', fontSize: '20px', lineHeight: '1', paddingBottom: '20px'}}>
            <p>You're all done for now.</p>
            <p>Thanks.</p>
          </div>
        </div>                
      );
    }
  }
}

export default Success;
