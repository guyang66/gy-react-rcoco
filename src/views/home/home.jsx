import React, { Component } from 'react';
import { Button, Carousel } from 'antd';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import GoodsItem from '../components/goods-item';

import BannerProduct from '../banner/bannerProduct';
import BannerTop from '../banner/bannerTop';
import BannerRose from '../banner/bannerRose';

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
        <Link to="/goodsDetail">
          <Button className="btn-jump" type="primary" size="large">
            查看番茄
          </Button>
        </Link>
        <GoodsItem history={history} />
      </div>
    );
  }
}
