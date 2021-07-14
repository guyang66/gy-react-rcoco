import React, { Component } from 'react';
import { observer, Provider } from 'mobx-react';
import Header from '../header';
import Footer from '../footer';
import Store from './store';
import Routers from '../../routes/router';

const store = new Store();

@observer
export default class App extends Component {
  componentWillMount() {
    this.handleResize(window);
  }

  componentDidMount() {
    // window.addEventListener('scroll', e => this.handleScroll(e))
    this.initScreenObserver();
  }

  handleScroll = (e) => {
    console.log(e);
  }

  initScreenObserver = () => {
    window.addEventListener('resize', (e) => this.handleResize(e));
  }

  handleResize = (e) => {
    const width = (e.target && e.target.innerWidth) || e.clientWidth || e.innerWidth;
    console.log(`width${width}`);

    if (width <= 700) {
      store.changeCol('ss');
      return;
    }
    // if (width < 768) {
    //   store.changeCol('xs')
    //   return;
    // }
    // if (width < 992) {
    //   store.changeCol('sm')
    //   return;
    // }
    // if (width < 1200) {
    //   store.changeCol('md')
    //   return;
    // }
    store.changeCol('lg');
  }

  render() {
    return (
      <div className="frame">
        <Header pageCol={store.pageCol} />
        {store.pageCol === 'ss' ? null : <div style={{ width: '100%', height: '80px' }} />}
        <Provider store={store}>
          {/* {children} */}
          <Routers />
        </Provider>
        <Footer />
      </div>
    );
  }
}
