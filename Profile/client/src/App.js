import React, { Component } from 'react';
import StepZilla from 'react-stepzilla';        // https://www.npmjs.com/package/react-stepzilla
import Success from './success';
import Failure from './failure';
import AccountLink from './link';
import './App.css';
const DEBUG = process.env.REACT_APP_DEBUG ? console.log : function () {};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      steps: []
    };
  }

  /* Use dynamic loading as descrinbed in https://www.robinwieruch.de/react-fetching-data/
  */
  componentDidMount() {
    var steps=[];
    var that=this;
    that.props.auth0Client.handleRedirectCallback().then(({appState}) => {
      DEBUG("appState=", appState);
      steps = [{
        name: "Finish", 
        component: <Success auth0Client={that.props.auth0Client} appState={that.props.appState} />}];

      // Get logged in user profile
      that.props.auth0Client.getUser().then(user => {
        var policy = user[process.env.REACT_APP_PROFILE_AUDIENCE+"/policy"];

        policy = (policy) ? JSON.parse(policy) : {};

        /*  Account Link?
        */
        if ((
          policy &&
          policy.link) ||
          that.props.appState.link) {
          steps.unshift({
            name: 'Account Link', 
            component: <AccountLink 
              auth0Client={that.props.auth0Client} 
              appState={that.props.appState} 
              policy={policy} />});
        }

        that.setState({'steps': steps});    
      }).catch((error) => {
        DEBUG(error);
        steps = [{
          name: "Finish", 
          component: <Failure error={error}/>}];
        that.setState({'steps': steps});                      
      });
    }).catch((error) => {
      DEBUG(error);
      switch(error.error){
        case 'access_denied':
        case 'invalid_request':
          steps = [{
            name: "Finish", 
            component: <Failure error={error}/>}];
          that.setState({'steps': steps});                      
          break;

        case 'login_required':
        case 'consent_required':
        default:
          that.props.auth0Client.loginWithRedirect({
            appState: that.props.appState
          })
          .catch(error => {
            DEBUG(error);
            steps = [{
              name: "Finish", 
              component: <Failure error={error}/>}];
            that.setState({'steps': steps});                      
          });
          break;
      }
    });
  }  

  render() {
    /* Render using Stepzilla (https://www.npmjs.com/package/react-stepzilla). Navigation for all pages is shown, however
       CSS is used (see App.css) to remove and/or align buttons for the various pages. For more information regarding this
       technique, see: https://github.com/newbreedofgeek/react-stepzilla/issues/28
     */
    if (
      this.state.steps &&
      this.state.steps.length) {
      return(
        <div>
          <div className='step-progress'>
            <StepZilla steps={this.state.steps} showNavigation={true} showSteps={true}/>
          </div>        
        </div>                
      );
    } 
    else 
    // Nothing yet to display.  
    return null;
  }
}

export default App;

