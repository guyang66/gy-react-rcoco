import React from 'react';
import './nav.styl';

export default class Nav extends React.Component {
  render() {
    const { menu } = this.props;
    return (
      <div className="nav-main">
        {
          menu.map((item, index) => (
            <span className="nav-item" key={`nav-bar-${index}`}>
              <a href={item.href}>
                {item.title}
              </a>

            </span>
          ))
        }
      </div>
    );
  }
}
