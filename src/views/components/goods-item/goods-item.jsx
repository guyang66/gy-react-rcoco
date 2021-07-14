import React from 'react';
import image1 from './image/caomei.jpg';
import image2 from './image/juzi.jpg';
import image3 from './image/li.jpg';
import image4 from './image/liulian.jpg';
import image5 from './image/pipa.jpg';
import image6 from './image/renwu.jpg';
import image7 from './image/wandou.jpg';
import image8 from './image/xigua.jpg';
import image9 from './image/yumi.jpg';

const data = [
  {
    title: '栏目',
    key: 'course',
    description: '简简单单，青青安安',
    goods: [
      {
        name: '草莓',
        desc: '这是一种水果',
        img: image1,
        id: 1,
      },
      {
        name: '橘子',
        desc: '脱下红黄衣,七八个兄弟,紧紧抱一起,酸甜各有味,大家都喜欢。黄橙橙的坛子,盛满水晶饺子,吃掉水晶饺子,吐出粒粒珠子;黄黄大肚子,圆圆玲珑个。肚里宝宝多,好吃又营养',
        img: image2,
        id: 2,
      },
      {
        name: '梨',
        desc: '梨，通常品种是一种落叶乔木或灌木，极少数品种为常绿，属于被子植物门双子叶植物纲蔷薇科苹果亚科。叶片多呈卵形，大小因品种不同而各异。花为白色，或略带黄色、粉红色，有五瓣。果实形状有圆形的，也有基部较细尾部较粗的，即俗称的“梨形”；不同品种的果皮颜色大相径庭，有黄色、绿色、黄中带绿、绿中带黄、黄褐色、绿褐色、红褐色、褐色，个别品种亦有紫红色；野生梨的果径较小，在1到4厘米之间，而人工培植的品种果径可达8厘米，长度可达18厘米',
        img: image3,
        id: 3,
      },
      {
        name: '榴莲',
        desc: '榴莲是热带著名水果之一，原产马来西亚。东南亚一些国家种植较多， 其中以泰国最多。中国广东﹑海南也有种植。榴莲在泰国最负有盛名，被誉为“水果之王”。它的气味浓烈、爱之者赞其香，厌之者怨其',
        img: image4,
        id: 5,
      },
      {
        name: '批把',
        desc: '有个附会传说，中国古代明朝的时期，航海舰队到达今东南亚，品尝当地特产果实时，郑和对这种水果大为赞赏，然而果实只能一年一熟，故命名留恋，后人取其谐音，称作榴莲',
        img: image5,
        id: 5,
      },
    ],
  },
  {
    title: '产品',
    description: '简简单单，青青安安',
    key: 'product',
    goods: [
      {
        name: '亚索',
        desc: '孤儿。',
        img: image6,
        id: 6,
      },
    ],
  },
  {
    title: '关于我们',
    description: '美是一种诗情画意的美',
    key: 'about',
    goods: [
      {
        name: '豌豆',
        desc: '可以用来放屁',
        img: image7,
        id: 7,
      },
      {
        name: '西瓜',
        desc: '开学季吃完的西瓜皮不要扔，裹上鸡蛋液，粘上面包糠，下锅炸至金黄酥脆控油捞出，老人小孩都爱吃，隔壁小孩都馋哭了',
        img: image8,
        id: 8,
      },
    ],
  },
  {
    title: '联系我们',
    description: '简简单单，青青安安',
    key: 'contact',
    goods: [
      {
        name: '玉米',
        desc: '玉米可以用来攻击僵尸，但是注意要放到土豆后面哟',
        img: image9,
        id: 9,
      },
    ],
  },
];

export default class GoodsItem extends React.Component {
  constructor(props) {
    super(props);
  }

  jumpPage = () => {
    const { history } = this.props;
    history.replace('/goodsDetail');
  }

  render() {
    return (
      <div className="goods-item-content">
        {
          data.map((item, index) => (
            <div className="goods-item-cell" key={`course${index}`}>
              <h1 id={item.key} className="cate-title">{item.title}</h1>
              <div className="cate-desc">{item.description}</div>
              <div className="goods-wrap">
                {
                  item.goods.map((value, count) => (
                    <div className="goods-cell-one" key={`goods-${count}`}>
                      <img src={value.img} onClick={this.jumpPage} alt="go young" />
                      <div className="goods-name">
                        {value.name}
                      </div>
                      <p className="goods-desc">
                        {value.desc}
                      </p>
                    </div>
                  ))
                }
              </div>
            </div>
          ))
        }
      </div>
    );
  }
}
