import React from "react";
import {Layout} from 'antd'
import './index.styl'

const {Footer} = Layout;

const FooterComponent = () => {
  return (
    <Footer
      className="footer-container"
    >
      <div className="footer-wrap">
        <div className="copyright">yy科技</div>
        <div className="copyright">Copyright © 2022 yy科技出品</div>
      </div>
    </Footer>
  )
}

export default FooterComponent
