import React, { Component } from 'react';
import { Carousel } from 'antd';
import { inject, observer } from 'mobx-react';
import GoodsItem from '../components/goods-item';

import BannerProduct from '../banner/bannerProduct';
import BannerTop from '../banner/bannerTop';
import BannerRose from '../banner/bannerRose';

import lm from '../../img/svg/fruit/blueberrys.svg';
import pt from '../../img/svg/fruit/grape.svg';
import xg from '../../img/svg/fruit/watermelon.svg';
import clz from '../../img/svg/fruit/cherrys.svg';

const productPoints = [
  {
    key: '1',
    name: '西瓜',
    desc: '西瓜为夏季之水果，果肉味甜，能降温去暑；种子含油，可作消遣食品；果皮药用，有清热、利尿、降血压之效',
    img: xg,
  },
  {
    key: '2',
    name: '蓝莓',
    desc: '蓝莓果实中含有丰富的营养成分，尤其富含花青素，它不仅具有良好的营养保健作用，还具有防止脑神经老化、强心、抗癌、软化血管、增强人体免疫等功能',
    img: lm,
  },
  {
    key: '3',
    name: '车厘子',
    desc: '其果实虽小如珍珠，但色泽红艳光洁，玲珑如玛瑙宝石一般，味道甘甜其中带有一丝酸味，既可鲜食，又可腌制或作为其他菜肴食品的点缀',
    img: clz,
  },
  {
    key: '4',
    name: '葡萄',
    desc: '葡萄为著名水果，生食或制葡萄干，并酿酒，酿酒后的酒脚可提酒石酸，根和藤药用能止呕、安胎',
    img: pt,
  },
];

@inject('store')
@observer
export default class Home extends Component {
  render() {
    const { history } = this.props;
    return (
      <div className="home-main">
        <div className="carouse-wrap">
          <Carousel autoplay effect="fade" autoplaySpeed={8 * 1000}>
            <BannerProduct />
            <BannerRose />
            <BannerTop />
          </Carousel>
        </div>

        <div className="product-point-title">水果特点</div>
        <div className="product-point-wrap">
          {
            productPoints.map((item) => (
              <div className="point-cell" key={item.key}>
                <img className="point-icon" src={item.img} alt="go young" />
                <div className="point-text">{item.name}</div>
                <div className="point-desc">{item.desc}</div>
              </div>
            ))
          }
        </div>
        <GoodsItem history={history} />
      </div>
    );
  }
}
