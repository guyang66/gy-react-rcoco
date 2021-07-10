import React from "react"
import './nav.styl'
import {Link} from "react-router-dom";

const menu = [
  {
    title: '首页',
    href: '/',
    isLink: true
  },
  {
    title: '栏目',
    href: '/#course',
    isAnchor: true
  },
  {
    title: '产品',
    isAnchor: true,
    href: '/#product',

  },
  {
    title: '关于我们',
    isAnchor: true,
    href: '/#about',
  },
  {
    title: '联系我们',
    isAnchor: true,
    href: '/#contact',
  },
]

export default class Nav extends React.Component {
  render() {
    return (
      <div className="nav-main">
        {
          menu.map((item, index) => (
            <span className="nav-item" key={'nav-bar' + index}>
              {
                item.isLink ? (
                  <Link to={item.href}>
                    {item.title}
                  </Link>
                ) : (
                  <a href={item.href}>
                    {item.title}
                  </a>
                )
              }

            </span>
          ))
        }
      </div>
    )
  }
}
