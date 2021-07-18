import React from 'react';

import { goodsData } from '../../common/data';

export default class GoodsItem extends React.Component {
  constructor(props) {
    super(props);
  }

  jumpPage = () => {
    const { history } = this.props;
    history.replace('/goodsDetail');
  }

  render() {
    console.log(goodsData);
    return (
      <div className="goods-item-content">
        {
          goodsData.map((item, index) => (
            <div className="goods-item-cell" key={`course${index}`}>
              <h1 id={item.key} className="cate-title">{item.title}</h1>
              <div className="cate-desc">{item.description}</div>
              <div className="goods-wrap">
                {
                  item.goods.map((value, count) => (
                    <div className="goods-cell-one" key={`goods-${count}`}>
                      <img src={value.img} onClick={() => this.jumpPage()} alt="go young" />
                      <div className="goods-name">
                        {value.name}
                      </div>
                      <p className="goods-desc">
                        {value.desc}
                      </p>
                    </div>
                  ))
                }
              </div>
            </div>
          ))
        }
      </div>
    );
  }
}
