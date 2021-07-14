import React from 'react'
const {Fragment} = React

import Nav from '../nav'
import {Row, Col ,Button, Drawer} from 'antd'

export default class header extends React.Component {
  state = {
    drawerShow : false
  }

  openDrawer = () => {
    this.setState({
      drawerShow: true,
    })
  }

  onClose = () => {
    this.setState({
      drawerShow: false,
    })
  }

  render() {
    return (
      // <Fragment>
      //   <header className="pc-header">
      //     <Row justify="center" align="middle" type="flex" className="header-container">
      //       <Col>
      //         <div className="logo-text">打造杭州舒适圈9</div>
      //       </Col>
      //       <Col>
      //         <Nav />
      //       </Col>
      //     </Row>
      //   </header>
      // </Fragment>

      <Fragment>
        <div className="h5-header" onClick={this.openDrawer}>
          导航
        </div>
        <Drawer
          title="Basic Drawer"
          placement="right"
          closable={false}
          onClose={this.onClose}
          visible={this.state.drawerShow}
          getContainer={false}
          style={{ position: 'absolute' }}
        >
          <p>Some contents...</p>
        </Drawer>
      </Fragment>


    )
  }
}
