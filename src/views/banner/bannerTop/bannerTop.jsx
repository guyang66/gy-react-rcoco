import React from 'react';
import s2 from '../../../img/fruit/002_mangguo.png';

export default class BannerTop extends React.Component {
  render() {
    return (
      <div className="banner-top">
        <div className="main-container">
          <div className="banner-text">
            <div className="b-title">芒果</div>
            <div>
              <div className="b-desc">芒果为著名热带水果之一</div>
              <div className="b-desc">芒果是一种原产印度的漆树科常绿大乔木</div>
            </div>
          </div>
          <img className="banner-img" src={s2} alt="go young" />
        </div>
      </div>
    );
  }
}
