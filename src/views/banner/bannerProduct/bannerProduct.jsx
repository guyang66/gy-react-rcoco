import React from 'react';
import s1 from '../../../img/fruit/005_taozi.png';

export default class BannerProduct extends React.Component {
  render() {
    return (
      <div className="banner-product">
        <div className="main-container">
          <div className="banner-text">
            <div className="b-title">桃子</div>
            <div className="b-desc">是一种果实作为水果的落叶小乔木，花可以观赏，果实多汁，可以生食或制桃脯、罐头等，核仁也可以食用。果肉有白色和黄色的，桃有多种品种，一般果皮有毛，“油桃”的果皮光滑；“蟠桃”果实是扁盘状；“碧桃”是观赏花用桃树，有多种形式的花瓣</div>
          </div>
          <img className="banner-img" src={s1} alt="go young" />
        </div>
      </div>
    );
  }
}
