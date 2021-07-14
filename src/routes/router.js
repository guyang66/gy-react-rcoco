import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import GoodsDetail from '../views/goodsDetail';
import Home from '../views/home';

export default function Routers() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/goodsDetail" component={GoodsDetail} />
        <Route path="/" component={Home} />
      </Switch>
    </BrowserRouter>
  );
}
