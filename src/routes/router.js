import React from "react";
import {BrowserRouter, Route, Router, Switch, useHistory} from "react-router-dom";
import GoodsDetail from "../views/goodsDetail";
import Error from "../views/components/404/404";
import Home from "../views/home";

export default function Routers(){
  const history = useHistory()
  return (
    <Switch>
      <Route path={'/goodsDetail'} children={<GoodsDetail history={history}/>}>
      </Route>
      {/*<Route path={'/404'} children={<Error history={history}/>}>*/}
      {/*</Route>*/}
      <Route path={'/'} history={history} children={<Home history={history}/>}>
      </Route>
    </Switch>
  )
}
