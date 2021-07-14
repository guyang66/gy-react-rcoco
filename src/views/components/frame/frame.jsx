import {Component} from 'react'
import {Provider} from 'mobx-react'
import Header from '../header'
import Footer from '../footer'
import Store from './store'
import Routers from '../../../routes/router'

const store = new Store()

export default class App extends Component {
  componentWillMount() {
    this.handleResize(document.body)
  }

  componentDidMount() {
    // window.addEventListener('scroll', e => this.handleScroll(e))
    this.initScreenObserver()
  }
  handleScroll = (e) => {
    console.log(e)
  }

  initScreenObserver = () => {
    window.addEventListener('resize', e => this.handleResize(e))
  }

  handleResize = (e) => {
    const width = (e.target && e.target.innerWidth) || e.clientWidth
    if (width < 500) {
      store.changeCol('ss')
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
    store.changeCol('lg')
  }

  render() {
    const { children } = this.props
    return (
      <div className="frame">
        <Header />
        {/*<div style={{width:'100%', height:'80px'}}></div>*/}
        <Provider {...store} ss={1}>
          {/*{children}*/}
          <Routers />
        </Provider>
        <Footer />
      </div>
    )
  }
}
