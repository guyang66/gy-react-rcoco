import React, {Component} from "react";
import {Button} from "antd";
import { Link } from 'react-router-dom'
import GoodsItem from "../components/goods-item";

import BannerProduct from "../banner/bannerProduct";
import BannerTop from "../banner/bannerTop";
import BannerRose from '../banner/bannerRose'

import { Carousel } from 'antd'
export default class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {history} = this.props
    const contentStyle = {
      height: '160px',
      color: '#fff',
      lineHeight: '160px',
      textAlign: 'center',
      background: '#364d79',
    };
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
