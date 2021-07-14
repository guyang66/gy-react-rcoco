import { observable, action } from 'mobx';

export default class Store {
  // ss: screen <= 500px
  // xs: 768px >  screen >= 500px
  // sm: 992px > screen >= 768px
  // md: 1200px > screen >= 992px
  // lg: screen >= 1200px
  @observable pageCol = 'lg'

  @action changeCol(size) {
    this.pageCol = size;
  }
}
