import {Layout} from "antd";
import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {Switch, withRouter} from "react-router-dom";

import Routes from "@app/router/Routes";
import HeaderMenu from "@components/Header/HeaderMenu";

import {CONSTANTS} from "@constants";

import * as app from "@app/store/ducks/app.duck";
import * as user from "@app/store/ducks/user.duck";
import Menu from "@components/Menu";

const { Footer, Content } = Layout;

function App({ isLoading, siderCollapsed, token, history, myInfo, ...props }) {
  const [isBroken, setBroken] = useState(false);
  const [isShowDrawer, setShowDrawer] = useState(false);

  useEffect(() => {}, []);

  useEffect(() => {
    if (token && token !== CONSTANTS.INITIAL) {
      props.requestUser(history);
    }
  }, [token]);

  function onBreakpoint(broken) {
    setBroken(broken);
    setShowDrawer(false);
  }

  function toggleCollapsed() {
    if (isBroken) {
      setShowDrawer(!isShowDrawer);
    } else {
      props.toggleSider(!siderCollapsed);
    }
  }

  return (
    <Layout>
      <Menu
        isBroken={isBroken}
        onBreakpoint={onBreakpoint}
        toggleCollapsed={toggleCollapsed}
        isShowDrawer={isShowDrawer}
        width={230}
      />
      <Layout className="site-layout">
        <HeaderMenu isBroken={isBroken} siderCollapsed={siderCollapsed} toggleCollapsed={toggleCollapsed} />
        <div id="content-container" className={`custom-scrollbar flex-column${!token ? " login" : ""}`}>
          <div id="content">
            <Content className="site-layout-background">
              <Switch>
                <Routes />
              </Switch>
            </Content>
          </div>
        </div>
      </Layout>
    </Layout>
  );
}

function mapStateToProps(store) {
  const { siderCollapsed, token } = store.app;
  const { myInfo } = store.user;
  return { siderCollapsed, token, myInfo };
}

export default connect(mapStateToProps, { ...app.actions, ...user.actions })(withRouter(App));

