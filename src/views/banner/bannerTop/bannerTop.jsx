import React from 'react';
import s2 from '../../../img/svg/s2.svg';

export default class BannerTop extends React.Component {
  render() {
    return (
      <div className="banner-top">
        <div className="main-container">
          <div className="banner-text">
            <div className="b-title">火鸟</div>
            <div className="b-desc">一站式打通任督二脉</div>
            <div className="b-desc">简简单单打通全链路</div>
          </div>
          <img src={s2} alt="go young" />
        </div>
      </div>
    );
  }
}
