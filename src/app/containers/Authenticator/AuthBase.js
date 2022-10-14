import React from "react";

import "./AuthBase.scss";

function AuthBase({ children }) {
  return (
    <div id="login">
      <div className="login-form">{children}</div>
    </div>
  );
}

export default AuthBase;

