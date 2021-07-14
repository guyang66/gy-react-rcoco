import React from 'react';
import s1 from '../../../img/svg/s1.svg';

export default class BannerProduct extends React.Component {
  render() {
    return (
      <div className="banner-product">
        <div className="main-container">
          <div className="banner-text">
            <div className="b-title">智源</div>
            <div className="b-desc">全球最顶尖的特工组织</div>
          </div>
          <img src={s1} alt="go young" />
        </div>
      </div>
    );
  }
}
