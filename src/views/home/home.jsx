import React, { Component } from "react";
import { Button, Carousel } from "antd";
import { Link } from 'react-router-dom'
import GoodsItem from "../components/goods-item";

import BannerProduct from "../banner/bannerProduct";
import BannerTop from "../banner/bannerTop";
import BannerRose from '../banner/bannerRose'

export default class Home extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { history, pageCol } = this.props
    console.log(history)
    return (
      <div className="home-main">
        <div className="carouse-wrap">
          <Carousel autoplay effect="fade" autoplaySpeed={8 * 1000}>
            <BannerProduct />
            <BannerTop />
            <BannerRose />
          </Carousel>
        </div>
        <Link to={'/goodsDetail'}>
          <Button className="btn-jump" type="primary" size="large"></Button>
        </Link>
        <GoodsItem history={history}/>
      </div>
    )
  }
}
