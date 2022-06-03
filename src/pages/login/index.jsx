import React, {useEffect}from "react";
import {Form, Input, Button, Checkbox, message, notification} from 'antd';
import {LockTwoTone, UserOutlined, SmileOutlined} from '@ant-design/icons';
import {Redirect} from "react-router-dom";
import apiLogin from '@api/login'

import bg from '@assets/images/login_bg.png'
import logo from '@assets/images/logo-black.svg'
import DocumentTitle from "react-document-title";
import './index.styl'
import {inject, observer} from "mobx-react";

const Login = (props) => {

  const {token, setToken, setUser}  = props.appStore
  const handleUserInfo = (data) => {
    setUser(data.user)
    setToken(data.accessToken)
  }

  useEffect(()=>{
    checkMessage()
  },[])

  const messageView = () => {
    return (
      <div>
        <div className="color-orange">如果是开发环境mock模式，任意账号密码均可登录</div>
        <div> -------------------------------------------------------------</div>
        <div className="color-orange">如果是生产环境，用如下账号可登录:</div>
        <div className="color-red">1、账号：super，密码：1 （超级管理员，具有所有权限，请大家试用的时候请勿修改该账号密码）</div>
        <div className="color-main">2、账号：admin，密码：1 （管理员，具有绝大部分权限，没有超级管理员相关操作）</div>
        <div>3、账号：data，密码：1 （数据管理员，只有数据管理权限）</div>
        <div>4、账号：web，密码：1 （官网内容管理员，只有官网内容管理权限）</div>
        <div>5、账号：hr，密码：1 （招聘管理员，只有官网——招聘管理权限）</div>
        <div>6、账号：guest，密码：1 （游客，啥也没有，只能逛首页和个人信息页面）</div>
        <div className="color-red">务必在试用或者测试修改过账号/应用内容后修改回来，避免其他同学无法使用账号，或者系统内容错误bug</div>
        <div className="color-red">如果有其他权限账号密码不对，使用super超级管理员登录之后到用户管理中重置指定账号密码（重置后为1）</div>
      </div>
    )
  }
  const checkMessage = () => {
    const msg = sessionStorage.getItem('accountMessage')
    if(msg === 'Y'){
      // 不要重复出现
    } else {
      notification.open({
        message: '账号密码说明',
        duration: null,
        style: {
          width: 700,
        },
        description: messageView(),
        icon: <SmileOutlined style={{color: '#108ee9'}} />,
      });
      sessionStorage.setItem('accountMessage','Y')
    }
  }

  const onFinish = async (values) => {
    await apiLogin.login({
      username: values.username,
      password: values.password,
    }).then(data=>{
      message.success('登录成功！')
      handleUserInfo(data)
    })
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  // 如果已经登录，直接跳转到首页
  if (token) {
    return <Redirect to="/admin/" />;
  }

  return (
    <DocumentTitle title="用户登录">
      <div className="login-container FBV FBAC" style={{background: `url(${bg}) no-repeat 100%`, backgroundSize: '100% 100%'}}>
        <div className="logicell-title-container mar-b40">
          <div className="logo-wrap">
            <img src={logo} alt="" />
          </div>
          <div className="desc-wrap mar-t10">yy管理后台</div>
        </div>
        <div className="form-container mar-t40">
          <Form
            name="basic"
            initialValues={{remember: true}}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            size="large"
          >
            <Form.Item
              name="username"
            >
              <Input
                placeholder="用户名"
                prefix={(
                  <UserOutlined style={{color: '#1890ff'}} />
                )}
              />
            </Form.Item>

            <Form.Item
              name="password"
            >
              <Input.Password
                placeholder="请输入用"
                prefix={(
                  <LockTwoTone style={{color: '#1890ff'}} />
                )}
              />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>自动登录</Checkbox>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className="submit-button">
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </DocumentTitle>
  )
}

export default inject('appStore')(observer(Login))
