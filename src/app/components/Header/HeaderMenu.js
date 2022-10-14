import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Dropdown, Layout, Menu } from 'antd';
import Notifications from './Notifications';

import { URL } from '@url';
import { API } from '@api';

import './Header.less';
import USER from '@assets/images/icon/user.svg';
import ARROW_LEFT from '@assets/images/icon/arrow-left.svg';
import ARROW_RIGHT from '@assets/images/icon/arrow-right.svg';
import * as app from '@app/store/ducks/app.duck';
import * as user from '@app/store/ducks/user.duck';

function HeaderMenu({ token, history, myInfo, isBroken, siderCollapsed, ...props }) {
  if (!token) return null;

  const { pathname } = history.location;
  const { toggleCollapsed } = props;
  const menu = (
    <Menu selectedKeys={pathname}>
      {/* <Menu.Item key={URL.MY_INFO}>
        <Link to={URL.MY_INFO}>Thông tin cá nhân</Link>
      </Menu.Item> */}
      <Menu.Item onClick={() => props.clearToken()}>Đăng xuất</Menu.Item>
    </Menu>
  );

  return (
    <Layout.Header
      className="site-layout-background position-relative"
      size="small"
      style={{ padding: 0, position: "sticky", top: 0, left: 0, right: 0, zIndex: 2, background: "#fff" }}
    >
      <span className="toggle-menu">
        <img src={siderCollapsed ? ARROW_RIGHT : ARROW_LEFT} alt="" onClick={toggleCollapsed} />
      </span>
      <span className="toggle-drawer-menu">
        <img src={ARROW_RIGHT} alt="" onClick={toggleCollapsed} />
      </span>

      <div className="application-name position-center">
        <strong>
          <div className="application-name__text">HỆ THỐNG AI NHẬN DẠNG HÀNH VI BẠO LỰC</div>
        </strong>
      </div>
      <div className="pull-right" style={{ height: '100%', display: 'flex' }}>
        <Dropdown overlay={menu} trigger={['click']} placement="bottomRight" arrow>
          <div className="my-info-container">
            <div className="my-info__avatar">
              <img src={USER} alt=""/>
              <span className="my-info__full-name">{myInfo.username}</span>
            </div>
          </div>
        </Dropdown>
      </div>
    </Layout.Header>
  );
}

function mapStateToProps(store) {
  const { siderCollapsed, isBroken, token } = store.app;
  const { myInfo } = store.user;
  return { siderCollapsed, isBroken, token, myInfo };
}

export default connect(mapStateToProps, { ...app.actions, ...user.actions })(withRouter(HeaderMenu));

