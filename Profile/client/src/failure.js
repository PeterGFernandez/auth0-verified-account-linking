import React, { Component } from 'react';

/* The . */ 
class Failure extends Component {
  render() {
    return(
      <div className="stepFailure">
        <div style={{textAlign: 'center', fontSize: '20px', lineHeight: '1', paddingBottom: '20px'}}>
          <p style={{color: 'red'}}>Sadly an error has occured</p>

          <p>Please close your browser and try again.</p>
        </div>
      </div>                
    );
  }
}

export default Failure;
