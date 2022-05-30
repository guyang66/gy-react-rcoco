import {inject, observer} from "mobx-react";
import "./index.styl"
import notFount from "@assets/images/error-page/404.png"
import {Button} from "antd";

const NotFount = () => {
  return (
    <div className="not-fount-container FBV FBAC">
      <img className="icon-img" src={notFount} alt="" />
      <div className="text">404，页面不见了，可能被大风刮走了~</div>
      <a href="/">
        <Button className="btn-primary back-btn mar-t20 mar-b40">返回首页</Button>
      </a>
    </div>
  )
}

export default inject('appStore')(observer(NotFount))
