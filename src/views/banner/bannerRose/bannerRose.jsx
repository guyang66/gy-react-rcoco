import React from "react";
import s2 from '../../../img/donggua.png'

export default class BannerTop extends React.Component {
  render() {
    return (
      <div className="banner-rose">
        <div className="main-container">
          <div className="banner-text">
            <div className="b-title">冬瓜</div>
            <div>
              <div className="b-desc">淡紫、淡蓝、浅粉红、浅灰等等。马卡龙色系自带少女气息</div>
              <div className="b-desc">马卡龙色系不止可以运用在食物上，建筑物这样配色也是出奇的好看</div>
            </div>
          </div>
          <img src={s2} className="banner-img"/>
        </div>
      </div>
    )
  }
}
