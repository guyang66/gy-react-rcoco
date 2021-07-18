import im5 from '../../img/fruit/005_taozi.png';
import im4 from '../../img/fruit/004_shiliu.png';
import im3 from '../../img/fruit/003_shanzu.png';
import im6 from '../../img/fruit/006_pingguo.png';
import im7 from '../../img/fruit/007_xiangjiao.png';
import im8 from '../../img/fruit/008_mihoutao.png';
import im9 from '../../img/fruit/009_mihoutao.png';
import im10 from '../../img/fruit/010_niuyouguo.png';
import im11 from '../../img/fruit/011_shalou.png';
import im12 from '../../img/fruit/012_shizi.png';
import im13 from '../../img/fruit/013_huangli.png';
import im14 from '../../img/fruit/014_huangyingtao.png';
import im15 from '../../img/fruit/015_huolongguo.png';
import im16 from '../../img/fruit/016_jinju.png';
import im17 from '../../img/fruit/017_xiangli.png';
import im18 from '../../img/fruit/018_lizi.png';
import im19 from '../../img/fruit/019_piba.png';
import im20 from '../../img/fruit/020_piba.png';
import im21 from '../../img/fruit/021_putao.png';
import im22 from '../../img/fruit/022_putao.png';
import im23 from '../../img/fruit/023_qingmei.png';
import im24 from '../../img/fruit/024_qingju.png';
import im25 from '../../img/fruit/025_qingpingguo.png';
import im26 from '../../img/fruit/026_qingzhao.png';
import im27 from '../../img/fruit/027_wuhuaguo.png';
import im28 from '../../img/fruit/028_li.png';
import im29 from '../../img/fruit/029_hamigua.png';
import im30 from '../../img/fruit/030_lingmeng.png';
import im31 from '../../img/fruit/031_lizhi.png';
import im32 from '../../img/fruit/032_yangjiaomi.png';
import im33 from '../../img/fruit/033_shuiputao.png';

// 蔬菜

import shucai1 from '../../img/vegetables/001_shucai_huluobo.png';
import shucai2 from '../../img/vegetables/002_shucai_lajiao.png';
import shucai3 from '../../img/vegetables/003_shucai_dachong.png';
import shucai4 from '../../img/vegetables/004_shucai_huanggua.png';
import shucai5 from '../../img/vegetables/005_shucai_xiaomijiao.png';
import shucai6 from '../../img/vegetables/006_shucai_xiaomijiao.png';
import shucai7 from '../../img/vegetables/007_shucai_shanyao.png';
import shucai8 from '../../img/vegetables/008_rou_zhurou.png';
import shucai9 from '../../img/vegetables/009_shucai_langua.png';
import shucai10 from '../../img/vegetables/010_shucai_ganze.png';
import shucai11 from '../../img/vegetables/011_shucai_qianzi.png';
import shucai12 from '../../img/vegetables/012_shucai_jicai.png';
import shucai13 from '../../img/vegetables/013_shucai_jincai.png';
import shucai14 from '../../img/vegetables/014_shucai_caihua.png';
import shucai15 from '../../img/vegetables/015_shucai_dachong.png';
import shucai16 from '../../img/vegetables/016_shucai_huluobo.png';
import shucai17 from '../../img/vegetables/017_shucai_kugua.png';
import shucai18 from '../../img/vegetables/018_shucai_kuagua.png';
import shucai19 from '../../img/vegetables/019_shucai_tudou.png';
import shucai20 from '../../img/vegetables/020_shucai_wandou.png';
import shucai21 from '../../img/vegetables/021_shucai_dabaicai.png';
import shucai22 from '../../img/vegetables/022_shucai_baicai.png';
import shucai23 from '../../img/vegetables/023_shucai_ziganlan.png';
import shucai24 from '../../img/vegetables/024_shucai_xianggu.png';
import shucai25 from '../../img/vegetables/025_shucai_jiucai.png';
import shucai26 from '../../img/vegetables/026_shucai_bailuobo.png';
import shucai27 from '../../img/vegetables/027_shucai_jicai.png';
import shucai28 from '../../img/vegetables/028_shucai_ou.png';
import shucai29 from '../../img/vegetables/029_shucai_lushun.png';
import shucai30 from '../../img/vegetables/030_shucai_yutou.png';
import shucai31 from '../../img/vegetables/031_shucai_yumi.png';
import shucai32 from '../../img/vegetables/032_shucai_sigua.png';
import shucai33 from '../../img/vegetables/033_shucai_xihulu.png';
import shucai34 from '../../img/vegetables/034_shucai_xiancai.png';
import shucai35 from '../../img/vegetables/035_shucai_xiangchun.png';
import shucai36 from '../../img/vegetables/036_shucai_xiaotudou.png';
import shucai37 from '../../img/vegetables/037_shucai_yangchong.png';
import shucai38 from '../../img/vegetables/038_shucai_xihongshi.png';
import shucai39 from '../../img/vegetables/039_shucai_zushun.png';
import shucai40 from '../../img/vegetables/040_shucai_zicaitai.png';
import shucai41 from '../../img/vegetables/041_shucai_zishu.png';

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
    title: '其他',
    isAnchor: true,
    href: '/#ohters',
    description: '人人都爱吃的坚果，早上来一包',
    key: 'others',
  },
];

const goods = {
  normal: [
    {
      name: '山竹',
      desc: '原产马鲁古，亚洲和非洲热带地区广泛栽培',
      img: im3,
      id: 1001,
    },
    {
      name: '石榴',
      desc: '性味甘、酸涩、温，具有杀虫、收敛、涩肠、止痢等功效。石榴果实营养丰富，维生素C含量比苹果、梨要高出一二倍',
      img: im4,
      id: 1002,
    },
    {
      name: '水密桃',
      desc: '属于球形可食用水果类，水蜜桃有美肤、清胃、润肺、祛痰等功效。它的蛋白质含量比苹果、葡萄高一倍，比梨子高七倍，铁的含量比苹果多三倍，比梨子多五倍，富含多种维生素，其中维生素C最高',
      img: im5,
      id: 1003,
    },
    {
      name: '（红心）苹果',
      desc: '蔷薇科苹果亚科苹果属植物，其树为落叶乔木。苹果营养价值很高，富含矿物质和维生素',
      img: im6,
      id: 1004,
    },
    {
      name: '香蕉',
      desc: '比较常见的水果',
      img: im7,
      id: 1005,
    },
    {
      name: '奇异果',
      desc: '果形一般为椭圆状，早期外观呈黄褐色，成熟后呈红褐色，表皮覆盖浓密绒毛',
      img: im8,
      id: 1006,
    },
    {
      name: '猕猴桃',
      desc: '猕猴桃的质地柔软，口感酸甜。味道被描述为草莓、香蕉、菠萝三者的混合',
      img: im9,
      id: 1007,
    },
    {
      name: '牛油果',
      desc: '鳄梨（学名：Persea americana Mill. ）是樟科鳄梨属植物，常绿乔木，耐阴植物。高约10米，树皮灰绿色，纵裂。叶互生，长椭圆形、椭圆形、卵形或倒卵形，先端极尖，基部楔形、极尖至近圆形，革质，上面绿色，下面通常稍苍白色',
      img: im10,
      id: 1008,
    },
  ],
  tropical: [
    {
      name: '山楂',
      desc: '核质硬，果肉薄，味微酸涩。果可生吃或作果脯果糕，干制后可入药',
      img: im11,
      id: 1009,
    },
  ],
  box: [
    {
      name: '枇杷（黄）',
      desc: '花期10-12月，果期5-6月',
      img: im20,
      id: 1018,
    },
    {
      name: '梨',
      desc: '通常品种是一种落叶乔木或灌木，极少数品种为常绿，属于被子植物门双子叶植物纲蔷薇科苹果亚科',
      img: im13,
      id: 1011,
    },
    {
      name: '黄樱桃',
      desc: '樱桃在中国久经栽培，品种颇多，供食用，也可酿樱桃酒。枝、叶、根、花也可供药用',
      img: im14,
      id: 1012,
    },
    {
      name: '火龙果',
      desc: '分布中美洲至南美洲北部，世界各地广泛栽培，藉气根攀援于树干、岩石或墙上，海拔3-300米',
      img: im15,
      id: 1013,
    },
    {
      name: '金桔',
      desc: '金桔属芸香科（Rutaceae） 柑橘亚科金柑属金弹种的一个优良品种',
      img: im16,
      id: 1014,
    },
    {
      name: '香梨',
      desc: '香梨具有多种功效，其中包括能保护心脏，减轻疲劳，增强心肌活力，降低血压',
      img: im17,
      id: 1015,
    },
    {
      name: '李子',
      desc: '李树枝广展，红褐色而光滑，叶自春至秋呈红色，花小，白或粉红色，是良好的观叶园林植物',
      img: im18,
      id: 1016,
    },
    {
      name: '枇杷',
      desc: '果味甘酸，供生食、蜜饯和酿酒用；叶晒干去毛，可供药用，有化痰止咳，和胃降气之效。木材红棕色，可作木梳、手杖、农具柄等用',
      img: im19,
      id: 1017,
    },
    {
      name: '柿子',
      desc: '柿科柿属植物',
      img: im12,
      id: 1010,
    },
    {
      name: '提子',
      desc: '提子具有果脆个大、甜酸适口、极耐贮运、品质佳等优点，虽然价格不菲，但在市场上以其 “贵族身份”而备受青睐。提子皮和提子籽内含抗氧化物质，对于心脑血管疾病具预防作用',
      img: im21,
      id: 1019,
    },
    {
      name: '葡萄',
      desc: '葡萄（学名：Vitis vinifera L.）为葡萄科葡萄属木质藤本植物',
      img: im22,
      id: 1020,
    },
    {
      name: '青李',
      desc: '青李、来禽、樱桃、日给藤子皆囊盛为佳，函封多不生',
      img: im23,
      id: 1021,
    },
    {
      name: '青桔',
      desc: '青桔就是青涩的桔子，代表桔子成长的过程。在对果树的诸多赞美文字里，桔子备受关注，但很少有人去关注生涩的果实',
      img: im24,
      id: 1022,
    },
    {
      name: '青苹果',
      desc: '品种数以百计，分为酒用品种、烹调品种、鲜食品种3大类。3类品种的大小、颜色、香味、光滑度（可能还有脆性、风味）等特点均有差别',
      img: im25,
      id: 1023,
    },
    {
      name: '青枣',
      desc: '青枣由于其果形优美而具苹果、梨、枣的风味，台湾青枣也享有"热带小苹果"的美誉',
      img: im26,
      id: 1024,
    },
    {
      name: '无花果',
      desc: '无花果（学名：Ficus carica Linn.）是桑科、榕属植物。落叶灌木或小乔木；高达10米，多分枝；树皮灰褐色',
      img: im27,
      id: 1025,
    },
    {
      name: '梨（红）',
      desc: '根系发达，垂直根深可达2-3m以上，水平根分布较广，约为冠幅2倍左右',
      img: im28,
      id: 1026,
    },
    {
      name: '哈密瓜',
      desc: '哈密产出的瓜',
      img: im29,
      id: 1027,
    },
    {
      name: '柠檬',
      desc: '为双子叶植物纲芸香科柑橘属植物，柠檬又称柠果、洋柠檬、益母果等',
      img: im30,
      id: 1028,
    },
    {
      name: '荔枝',
      desc: '一骑红尘妃子笑，无人知是荔枝来',
      img: im31,
      id: 1029,
    },
    {
      name: '羊角蜜',
      desc: '羊角蜜甜瓜，是一种水果。果实长锥形，一端大，一端稍细而尖，细长如羊角，故名羊角蜜',
      img: im32,
      id: 1030,
    },
    {
      name: '阳光玫瑰葡萄',
      desc: '阳光玫瑰葡萄丰产、稳产, 大粒, 抗病, 耐贮性好, 栽培简单。果穗圆锥形, 穗重600g左右, 大穗可达1.8 kg左右, 平均果粒重8~12g',
      img: im33,
      id: 1031,
    },
  ],
  others: [
    {
      name: '红萝卜',
      desc: '俗称半头红，可用来做泡菜，味道极佳',
      img: shucai1,
      id: 1101,
    },
    {
      name: '青椒',
      desc: '为木兰纲、茄科、辣椒属一年或有限多年生草本植物。茎近无毛或微生柔毛，分枝稍之字形折曲',
      img: shucai2,
      id: 1102,
    },
    {
      name: '蒜苗',
      desc: '蒜苗，又叫青蒜（不见光时为蒜黄）。品质好的蒜苗应该鲜嫩，株高在35厘米左右，叶色鲜绿，不黄不烂，毛根白色不枯萎，而且辣味较浓',
      img: shucai3,
      id: 1103,
    },
    {
      name: '黄瓜',
      desc: '茎、枝伸长，有棱沟，被白色的糙硬毛。卷须细。叶柄稍粗糙，有糙硬毛；叶片宽卵状心形，膜质',
      img: shucai4,
      id: 1104,
    },
    {
      name: '红椒',
      desc: '一年生或有限多年生植物；高40-80厘米。茎近无毛或微生柔毛，分枝稍之字形折曲。叶互生，枝顶端节不伸长而成双生或簇生状，矩圆状卵形',
      img: shucai5,
      id: 1105,
    },
    {
      name: '朝天椒',
      desc: '植物体多二歧分枝。叶长4-7厘米，卵形。花常单生于二分叉间，花梗直立，花稍俯垂，花冠白色或带紫色。果梗及果实均直立，果实较小，圆锥状，长约1.5 (-3)厘米，成熟后红色或紫色，味极辣',
      img: shucai6,
      id: 1106,
    },
    {
      name: '山药',
      desc: '薯蓣（学名：Dioscorea oppositifolia L.）是薯蓣科薯蓣属植物，缠绕草质藤本。块茎长圆柱形，垂直生长。茎通常带紫红色，右旋，无毛。单叶，在茎下部的互生，中部以上的对生',
      img: shucai7,
      id: 1107,
    },
    {
      name: '牛肉',
      desc: '这是混在蔬菜里的肉肉，大家都爱吃',
      img: shucai8,
      id: 1108,
    },
    {
      name: '南瓜',
      desc: '万圣节专用蔬菜',
      img: shucai9,
      id: 1109,
    },
    {
      name: '苦瓜（青）',
      desc: '比一般的苦瓜味道淡一点',
      img: shucai18,
      id: 1118,
    },
    {
      name: '茄子',
      desc: '可供蔬食。根、茎、叶入药，为收敛剂，有利尿之效，叶也可以作麻醉剂。种子为消肿药，也用为刺激剂，但容易引起胃弱及便秘，果生食可解食菌中毒',
      img: shucai11,
      id: 1111,
    },
    {
      name: '姜',
      desc: '根茎供药用，鲜品或干品可作烹调配料或制成酱菜、糖姜。茎、叶、根茎均可提取芳香油，用于食品、饮料及化妆品香料中',
      img: shucai12,
      id: 1112,
    },
    {
      name: '芹菜',
      desc: '芹菜，属伞形科植物，品种繁多，在我国有着悠久的种植历史和大范围的种植面积，是中国人常吃的蔬菜之一，其富含蛋白质',
      img: shucai13,
      id: 1113,
    },
    {
      name: '白花菜',
      desc: '即菜花',
      img: shucai14,
      id: 1114,
    },
    {
      name: '大葱',
      desc: '葱种下一变种，区别于分葱（小葱）变种与红葱（楼葱）变种',
      img: shucai15,
      id: 1115,
    },
    {
      name: '胡萝卜',
      desc: '胡萝卜（学名：Daucus carota var. sativa Hoffm.）是伞形科、胡萝卜属野胡萝卜的变种，一年生或二年生草本植物。根粗壮，长圆锥形，呈橙红色或黄色',
      img: shucai16,
      id: 1116,
    },
    {
      name: '苦瓜',
      desc: '一年生攀援状柔弱草本，多分枝；茎、枝被柔毛。卷须纤细，长达20厘米，具微柔毛，不分歧',
      img: shucai17,
      id: 1117,
    },
    {
      name: '甘蔗',
      desc: '甘蔗适合栽种于土壤肥沃、阳光充足、冬夏温差大的地方',
      img: shucai10,
      id: 1110,
    },
    {
      name: '土豆',
      desc: '马铃薯、洋芋',
      img: shucai19,
      id: 1119,
    },
    {
      name: '豌豆',
      desc: '豆科一年生攀援草本，高0.5-2米。全株绿色，光滑无毛，被粉霜。叶具小叶4-6片，托叶心形，下缘具细牙齿',
      img: shucai20,
      id: 1120,
    },
    {
      name: '娃娃菜',
      desc: '娃娃菜是一种袖珍型小株白菜，属十字花科芸薹属白菜亚种，为半耐寒性蔬菜',
      img: shucai21,
      id: 1121,
    },
    {
      name: '小白菜',
      desc: '小白菜，是一年生草本植物。浅根系，主根圆锥形，须根发达，再生力强，苗期生长缓慢',
      img: shucai22,
      id: 1122,
    },
    {
      name: '紫甘蓝',
      desc: '紫甘蓝又称红甘蓝、赤甘蓝，俗称紫包菜，十字花科、芸苔属甘蓝种中的一个变种',
      img: shucai23,
      id: 1123,
    },
    {
      name: '香菇',
      desc: '香菇肉质肥厚细嫩',
      img: shucai24,
      id: 1124,
    },
    {
      name: '韭菜',
      desc: '容易被割',
      img: shucai25,
      id: 1125,
    },
    {
      name: '白萝卜',
      desc: '根茎类蔬菜，十字花科萝卜属植物。种植有千年历史，在饮食和中医食疗领域都有广泛应用',
      img: shucai26,
      id: 1126,
    },
    {
      name: '荠菜',
      desc: '荠生长在山坡、田边及路旁，野生，偶有栽培。中国各省区均有分布，全世界温带地区广泛分布',
      img: shucai27,
      id: 1127,
    },
    {
      name: '藕',
      desc: '属莲科植物。藕微甜而脆，可生食也可煮食，是常用餐菜之一。藕也是药用价值相当高的植物，它的根叶、花须果实皆是宝，都可滋补入药。用藕制成粉，能消食止泻，开胃清热，滋补养性',
      img: shucai28,
      id: 1128,
    },
    {
      name: '芦笋',
      desc: '未出土的呈白色称为白笋， 出土后呈绿色称为绿笋。即使生产地域不同，但不管是哪款芦笋品种，只要照到阳光就会变成绿芦笋，埋在土中或遮蔽阳光，就会让芦笋色泽偏白',
      img: shucai29,
      id: 1129,
    },
    {
      name: '毛芋头',
      desc: '芋头属天南星科多年生宿根性草本植物，常作一年生作物栽培。芋头最早产于中国、马来西亚以及印度半岛等炎热潮湿的沼泽地带，在全球各地广为栽培',
      img: shucai30,
      id: 1130,
    },
    {
      name: '玉米',
      desc: '截至2020年10月，现货玉米的均价最高超过2600元/吨，创下了近4年以来的新高。玉米淀粉价格上涨到2900元每吨左右，上涨幅度超过30%',
      img: shucai31,
      id: 1131,
    },
    {
      name: '丝瓜',
      desc: '果为夏季蔬菜，成熟时里面的网状纤维称丝瓜络，可代替海绵用作洗刷灶具及家具；还可供药用，有清凉、利尿、活血、通经、解毒之效',
      img: shucai32,
      id: 1132,
    },
    {
      name: '西葫芦',
      desc: '清热利尿、消肿散结的功效。果实作蔬菜',
      img: shucai33,
      id: 1133,
    },
    {
      name: '苋菜',
      desc: '苋菜又名青香苋、 红苋菜、红菜、米苋等，为苋科以嫩茎叶供食用的一年生草本植物',
      img: shucai34,
      id: 1134,
    },
    {
      name: '香椿',
      desc: '蒸蛋专用',
      img: shucai35,
      id: 1135,
    },
    {
      name: '小土豆',
      desc: '一年生草本植物，块茎可供食用，是全球第四大重要的粮食作物，仅次于小麦、稻谷和玉米',
      img: shucai36,
      id: 1136,
    },
    {
      name: '洋葱',
      desc: '洋葱（学名：Allium cepa L.）是百合科、葱属多年生草本植物',
      img: shucai37,
      id: 1137,
    },
    {
      name: '西红柿',
      desc: '番茄原产南美洲，中国南北方广泛栽培。番茄的果实营养丰富，具特殊风味。可以生食、煮食、加工番茄酱、汁或整果罐藏',
      img: shucai38,
      id: 1138,
    },
    {
      name: '竹笋',
      desc: '竹笋是江南美食之材，过去甚至有“居不可无竹，食不可无笋”之说。虽然所有竹都有竹笋生成，但并非所有竹笋都能称为烹饪之品',
      img: shucai39,
      id: 1139,
    },
    {
      name: '紫菜苔',
      desc: '是十字花科芸苔属植物，二年生草本，高30-90厘米；茎短缩，其上着生数片基叶。叶卵形或椭圆形，叶色绿或紫绿，波状叶缘，叶基部深裂或有少数裂片',
      img: shucai40,
      id: 1140,
    },
    {
      name: '红薯',
      desc: '蒸熟即可食用',
      img: shucai41,
      id: 1141,
    },
  ],
};

module.exports.columnData = menu;
module.exports.goodsData = menu.map((item) => {
  const tmp = item;
  tmp.goods = goods[item.key] ? goods[item.key] : [];
  return tmp;
});
