import React from 'react';
import qrcode from '../../img/qrcode.jpg';

export default class extends React.Component {
  render() {
    return (
      <div className="footer-main">
        <div className="footer-mess">
          <div className="title">联系我们</div>
          <div className="mess">所在地址：杭州市余杭区良渚文化村</div>
          <div className="mess">电话联系：12345678901</div>
          <div className="mess">联系邮箱：123467780@qq.com</div>
        </div>
        <div className="footer-code">
          <img src={qrcode} className="code-img" alt="go young" />
          <div className="code-text">扫一扫，联系我们</div>
        </div>
        <div className="footer-code mar-b20">
          <img src={qrcode} className="code-img" alt="go young" />
          <div className="code-text">感谢打赏~</div>
        </div>
      </div>
    );
  }
}
