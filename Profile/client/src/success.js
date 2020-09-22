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
    super(props);

    this.state = {
      continue: props.appState.continue,
      state: props.appState.state
    };

    // This binding is necessary to make `this` work in the callback
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    DEBUG(event);
  }

  render() {
    if (this.state.continue) {
      var method = 'POST';
      var action = 'https://' + process.env.REACT_APP_AUTH0_DOMAIN + '/continue?' + encode({
        state: this.state.state
      });

      return(
        <div className="stepSuccess">
          <div style={{textAlign: 'center', fontSize: '20px', lineHeight: '1', paddingBottom: '20px'}}>
            <p>Thanks; you're done for now and can continue.</p>
            <form action={action} method={method} onSubmit={this.handleSubmit}>
              {Object.keys(this.state.continue).map(key => <input 
                type="hidden" 
                name={key} 
                value={this.state.continue[key]} />)}
              <input 
                style={{backgroundColor: "greenyellow", paddingTop: 9, paddingBottom: 9}}
                value="Continue"                 
                type="submit"  />
            </form>
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
