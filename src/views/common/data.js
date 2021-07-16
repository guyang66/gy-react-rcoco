import image1 from '../components/goods-item/image/caomei.jpg';
import image2 from '../components/goods-item/image/juzi.jpg';
import image3 from '../components/goods-item/image/li.jpg';
import image4 from '../components/goods-item/image/liulian.jpg';
import image5 from '../components/goods-item/image/pipa.jpg';
import image6 from '../components/goods-item/image/renwu.jpg';
import image7 from '../components/goods-item/image/wandou.jpg';
import image8 from '../components/goods-item/image/xigua.jpg';
import image9 from '../components/goods-item/image/yumi.jpg';

const menu = [
  {
    title: '常见水果',
    href: '/#normal',
    isAnchor: true,
    key: 'normal',
    description: '日常常见的一些水果',
  },

  {
    title: '热带水果',
    isAnchor: true,
    href: '/#tropical',
    description: '生长在热带地区的水果',
    key: 'tropical',

  },
  {
    title: '盒装水果',
    isAnchor: true,
    href: '/#box',
    description: '盒子装好的水果，每盒是随机三拼',
    key: 'box',
  },
  {
    title: '坚果',
    isAnchor: true,
    href: '/#nut',
    description: '人人都爱吃的坚果，早上来一包',
    key: 'nut',
  },
];

const goods = {
  normal: [
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
  tropical: [
    {
      name: '亚索',
      desc: '孤儿。',
      img: image6,
      id: 6,
    },
  ],
  box: [
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
  nut: [
    {
      name: '玉米',
      desc: '玉米可以用来攻击僵尸，但是注意要放到土豆后面哟',
      img: image9,
      id: 9,
    },
  ],
};

module.exports.columnData = menu;
module.exports.goodsData = menu.map((item) => {
  const tmp = item;
  tmp.goods = goods[item.key];
  return tmp;
});
export default class datas {
}
