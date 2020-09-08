import React, { Component } from 'react';
import LoadingOverlay from 'react-loading-overlay';
import './App.css';

const DEBUG = process.env.REACT_APP_DEBUG ? console.log : function () {};

/* The . */ 
class AccountLink extends Component {
  constructor(props) {
// Removed in production build (https://create-react-app.dev/docs/adding-custom-environment-variables/)    
//if (process.env.NODE_ENV !== 'production') {
//}
    //
    props.context.appState = props.context.appState || {};
    props.context.appState.link = props.context.appState.link || {};
    props.context.appState.continue = true;
    super(props);

    this.state = {
      executing: props.context.appState.link.executing,
      executed: props.context.appState.link.executed,
      error: props.context.appState.link.error
    };

    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    var that=this;
    that.setState({
      executing: true,
      executed: false,
      error: null
    });
    that.props.context.appState.link = {
      executing: false,
      executed: true,
      error: null
    };
    that.props.auth0Client.loginWithRedirect({
      connection: that.props.context.policy.link.connection,
      audience: process.env.REACT_APP_PROFILE_AUDIENCE,
      appState: that.props.context.appState,
      scope: 'profile:account link:account',
      prompt: 'login'
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
    /* In the rendering returned (below), use is made of the Next button which forms part of Stepzilla; see 'render()'
       in App.js for further details.
    */
    if (this.state.executing) {
      return(
        <div className="stepLink" style={{textAlign: 'center'}}>
          <LoadingOverlay active={true} spinner>
            <div style={{
              textAlign: 'center', 
              fontSize: '20px', 
              paddingTop: '20px',
              paddingBottom: '20px'}}>
              <p>Account Linking in progress.</p>
            </div>
          </LoadingOverlay>        
        </div>               
      );
    }
    else
    if (this.state.executed) {
      if (this.state.error) {
        return(
          <div className="stepLink">
            <div style={{textAlign: 'center', fontSize: '20px', lineHeight: '1', paddingBottom: '20px'}}>
              <p>An error occured whilst attempting to perform Account Linking. </p>
              <p>Please authenticate your existing account in order to try again.</p>
              <p>Alternatively click 'Next' if you want to skip and keep your user profiles seperate (not recommended).</p>
              <button style={{backgroundColor: "greenyellow", paddingTop: 9, paddingBottom: 9}} onClick={this.handleClick}>
                Re-Authenticate
              </button>            
            </div>
          </div>               
        );
      } else {
        return(
          <div className="stepLink">
            <div style={{textAlign: 'center', fontSize: '20px', lineHeight: '1', paddingBottom: '20px'}}>
              <p>To provide you with a single user profile, execution of account linking has been scheduled. </p>
              <p>Thank you. Click Next to continue.</p>
            </div>
          </div>               
        );
      }
    } else {
      return(
        <div className="stepLink">
          <div style={{textAlign: 'center', fontSize: '20px', lineHeight: '1', paddingBottom: '20px'}}>
            <p>It looks like an account for you already exists.</p>
            <p>Please authenticate your existing account in order to link to a single user profile.</p>
            <p>Alternative click 'Next' if you want to keep your user profiles seperate (not recommended).</p>
            <button style={{backgroundColor: "greenyellow", paddingTop: 9, paddingBottom: 9}} onClick={this.handleClick}>
              Re-Authenticate
            </button>            
          </div>
        </div>               
      );
    }
  }

  isValidated() {
    this.props.context.appState.link = this.state;
    //  Update the following if you want to mandate account linking
    return(
      this.state.executing?false:
      this.state.executed?true:
        true);
  }
}

export default AccountLink;
