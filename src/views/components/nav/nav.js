import React from 'react';
import './nav.styl';

export default class Nav extends React.Component {
  scrollToAnchor = (key, href) => {

    console.log(key)
    const state = {
      behavior: 'smooth', // smooth动画滚动
      block: 'start', // 滚动到锚点顶部还是底部
    };
    if (key) {
      const anchorElement = document.getElementById(key);
      if (anchorElement) {
        anchorElement.scrollIntoView(state);
      } else {
        window.location.href = href
      }
      return
    }
    window.location.href = '/'
  }

  // 注意onclick不要直接绑定函数，这样页面加载自动执行，执行之后的返回值会直接赋给onclick属性，所以要使用bind，或者加一层闭包。
  render() {
    const { menu } = this.props;
    return (
      <div className="nav-main">
        {
          menu.map((item, index) => (
            <span className="nav-item" key={`nav-bar-${index}`}>
              <div href={item.href} onClick={() => { this.scrollToAnchor(item.key, item.href); }} className="nav-title">
                {item.title}
              </div>

            </span>
          ))
        }
      </div>
    );
  }
}
