import React from 'react';
import { Button, Col, Form, Input, Row } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { isAndroid, isIOS } from 'react-device-detect';

import AuthBase from '@containers/Authenticator/AuthBase';

import { RULES } from '@constants';
import { API } from '@api';

import * as app from '@app/store/ducks/app.duck';

function Login({ history, isLoading, ...props }) {

  function handleLogin(value) {
    props.login(value, history);
  }

  return <AuthBase>
    <Form size="large" layout="vertical" onFinish={handleLogin}>
      <Form.Item label="Tài khoản" name="username" rules={[RULES.REQUIRED]}>
        <Input placeholder="Tài khoản" disabled={isLoading}/>
      </Form.Item>
      <Form.Item label="Mật khẩu" name="password" rules={[RULES.REQUIRED]}>
        <Input.Password placeholder="********" disabled={isLoading}/>
      </Form.Item>

      {isIOS && <Col>
        <Link to={API.IOS_APP} target="_blank" download>Cài đặt iOS</Link>
      </Col>}
      {isAndroid && <Col>
        <Link to={API.ANDROID_APP} target="_blank" download>Cài đặt Android</Link>
      </Col>}

      <Row className="pt-2">
        <Button type="primary" htmlType="submit" loading={isLoading}>Đăng nhập</Button>
      </Row>
    </Form>
  </AuthBase>;
}

function mapStateToProps(store) {
  const { isLoading } = store.app;
  return { isLoading };
}

export default (connect(mapStateToProps, app.actions)(Login));
