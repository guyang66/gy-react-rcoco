import React from 'react';
import s2 from '../../../img/fruit/001_donggua.png';

export default class BannerTop extends React.Component {
  render() {
    return (
      <div className="banner-rose">
        <div className="main-container">
          <div className="banner-text">
            <div className="b-title">冬瓜</div>
            <div>
              <div className="b-desc">淡葫芦科冬瓜属一年生蔓生或架生草本植物</div>
              <div className="b-desc">茎被黄褐色硬毛及长柔毛，有棱沟，叶柄粗壮，被粗硬毛和长柔毛，雌雄同株，花单生，果实长圆柱状或近球状，大型，有硬毛和白霜，种子卵形</div>
            </div>
          </div>
          <img src={s2} className="banner-img" alt="go young" />
        </div>
      </div>
    );
  }
}
