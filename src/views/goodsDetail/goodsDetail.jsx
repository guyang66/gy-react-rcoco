import React from 'react';
import { Button } from 'antd';
import img1 from '../../img/fanqie.jpg';

export default class GoodsDetail extends React.Component {
  constructor(props) {
    super(props);
  }

  jumpPage = () => {
    const { history } = this.props;
    history.replace({
      pathname: '/',
    });
  }

  render() {
    return (
      <div className="goods-main">
        <div className="goods-img">
          <img src={img1} alt="go young" />
        </div>
        <div className="goods-desc">
          番茄起源中心是南美洲的安第斯山地带。在秘鲁、厄瓜多尔、
          玻利维亚等地，至今仍有大面积野生种的分布。番茄属分为有色番茄亚种和绿色番茄亚种。
          前者果实成熟时有多种颜色，后者果实成熟时为绿色。番茄属由普通栽培种番茄及与栽培种番茄有密切关系的几个种组成，
          大体上又分为普通番茄和秘鲁番茄两个复合体种群。普通番茄群中包括：普通番茄、细叶番茄、奇士曼尼番茄、小花番茄和奇美留斯凯番茄、
          多毛番茄；秘鲁番茄群中包括智利番茄和秘鲁番茄。
        </div>
      </div>
    );
  }
}
