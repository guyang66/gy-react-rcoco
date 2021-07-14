import ReactDom from 'react-dom';
import React from 'react';
import './index.styl';
import { Route } from 'react-router-dom';
import Frame from './views/components/frame';

ReactDom.render(
  <Frame />,
  document.getElementById('app'),
);
