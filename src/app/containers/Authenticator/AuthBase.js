import React from 'react';

import './AuthBase.scss';

import LOGO_VERTICAL from '@assets/images/logo/THINKLABS-LOGO.svg';

function AuthBase({ children }) {

  return <div id="login">
    <div className="login-form">
      <div style={{ textAlign: 'center' }}>
        <img alt="" src={LOGO_VERTICAL}/>
      </div>
      {children}
    </div>
  </div>;
}

export default (AuthBase);
