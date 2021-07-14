import React from 'react';

import {
  Row, Col, Drawer, Button,
} from 'antd';
import { observer } from 'mobx-react';
import Nav from '../components/nav';

const menu = [
  {
    title: '首页',
    href: '/',
    isLink: true,
  },
  {
    title: '栏目',
    href: '/#course',
    isAnchor: true,
  },
  {
    title: '产品',
    isAnchor: true,
    href: '/#product',

  },
  {
    title: '关于我们',
    isAnchor: true,
    href: '/#about',
  },
  {
    title: '联系我们',
    isAnchor: true,
    href: '/#contact',
  },
];

@observer
export default class header extends React.Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
    this.state = {
      drawerShow: false,
    };
  }

  componentWillMount() {
    this.startScroll();
  }

  // prevent= function (event) {
  //   event.preventDefault();
  // }

  stopScroll = () => {
    document.body.style.overflow = 'hidden';
    // doucment.addEventListener('touchmove', prevent, {passive: false});
  }

  startScroll = () => {
    document.body.style.overflow = 'auto';
    // doucment.addEventListener('touchmove', prevent, {passive: false});
  }

  openDrawer = () => {
    this.setState({
      drawerShow: true,
    });
    this.stopScroll();
  }

  onClose = () => {
    this.setState({
      drawerShow: false,
    });
    this.startScroll();
  }

  renderH5NavView = () => {
    const { drawerShow } = this.state;
    return (
      <div className="h5-header">
        <Button className="h5-header-wrap" onClick={this.openDrawer}>
          查看更多
        </Button>
        <Drawer
          title="查看更多产品"
          placement="right"
          closable={false}
          onClose={this.onClose}
          zIndex={999}
          visible={drawerShow}
          getContainer={false}
          style={{ position: 'absolute', height: '100%', overflow: 'hidder' }}
        >
          <div className="drawer-cell-wrap">
            {menu.map((item, index) => (
              <div key={`h5-nav-item${index}`}><a href={item.href} onClick={this.onClose}>{item.title}</a></div>
            ))}
          </div>
        </Drawer>
      </div>
    );
  }

  renderPCNavView = () => (
    <header className="pc-header">
      <Row justify="center" align="middle" type="flex" className="header-container">
        <Col>
          <div className="logo-text">打造杭州舒适圈9</div>
        </Col>
        <Col>
          <Nav />
        </Col>
      </Row>
    </header>
  )

  render() {
    const { pageCol } = this.props;
    return pageCol === 'ss' ? this.renderH5NavView() : this.renderPCNavView();
  }
}
