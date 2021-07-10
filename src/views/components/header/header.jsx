import React from 'react'
const {Fragment} = React

import Nav from '../../components/nav/nav'
import {Row, Col} from 'antd'

export default class header extends React.Component {
  render() {
    return (
      <Fragment>
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
      </Fragment>
    )
  }
}
