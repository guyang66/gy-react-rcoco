import ReactDom from 'react-dom';
import './index.styl'
import Frame from './views/components/frame'
import { BrowserRouter } from 'react-router-dom'
import Routers from './routes/router'
ReactDom.render(
    <BrowserRouter>
      <Frame>
        <Routers />
      </Frame>
    </BrowserRouter>,
    document.getElementById('app')
)
