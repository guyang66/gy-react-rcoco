import React from "react";
import {Menu, Dropdown, Modal, Layout, Avatar} from "antd";
import {CaretDownOutlined} from '@ant-design/icons'
import {Link} from "react-router-dom";
import Hamburger from "@components/hamburger";
import BreadCrumb from "@components/bread-crumb";
import './index.styl'
import defaultIcon from '@assets/images/avator/default.png'

import {inject, observer} from "mobx-react";

const {Header} = Layout;

const HeaderLayout = (props) => {

  const {sidebarCollapsed, fixedHeader, appStore} = props;
  const {user, currentRole, logout, setMenus, setRouteMap} = appStore

  const handleLogout = () => {
    Modal.confirm({
      title: "注销",
      content: "确定要退出系统吗?",
      okText: "确定",
      cancelText: "取消",
      onOk: () => {
        setMenus([])
        setRouteMap([])
        logout()
      },
    });
  };
  const onClick = ({key}) => {
    switch (key) {
      case "logout":
        handleLogout();
        break;
      default:
        break;
    }
  };
  const menuView = (
    <Menu onClick={onClick}>
      <Menu.Item key="dashboard">
        <Link to="/admin/">首页</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout">注销</Menu.Item>
    </Menu>
  )

  const computedStyle = () => {
    let styles;
    if (fixedHeader) {
      if (sidebarCollapsed) {
        styles = {
          width: "calc(100% - 80px)",
        };
      } else {
        styles = {
          width: "calc(100% - 200px)",
        };
      }
    } else {
      styles = {
        width: "100%",
      };
    }
    return styles;
  };

  return (
    <>
      <Header
        style={computedStyle()}
        className="header-container"
      >
        <Hamburger />
        <BreadCrumb />
        <div className="right-menu FBH">
          {
            user.name ? (
              <>
                <div className="username">
                  {user.name}
                  （
                  {user.defaultRoleName || currentRole}
                  ）
                </div>
                <div className="dropdown-wrap">
                  <Dropdown overlay={menuView}>
                    <div>
                      <Avatar shape="square" size="medium" src={user.avatar ? user.avatar : defaultIcon} />
                      <CaretDownOutlined className="icon-down" style={{color: "rgba(0, 0, 0, .3)"}} />
                    </div>
                  </Dropdown>
                </div>
              </>
            ) : null
          }
        </div>
      </Header>
    </>
  )
}

export default inject('appStore')(observer(HeaderLayout))
