import {Component} from "react";
import {Provider} from "mobx-react"
import Header from '../header'
import Footer from '../footer'
export default class App extends Component {
  render() {
    const { children } = this.props
    return (
      <div className="frame">
        <Header />
        <div style={{width:'100%',height:'80px',backgroundColor:'red'}}></div>
        <Provider>
          {children}
        </Provider>
        <Footer />
      </div>
    )
  }
}
