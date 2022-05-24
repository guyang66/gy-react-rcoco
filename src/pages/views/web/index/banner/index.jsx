import React, {useState, useEffect} from "react";
import "./index.styl";
import apiWeb from '@api/web'
import {message, Table, Button, Modal, Input, Upload, Select, Switch} from 'antd';
import {LoadingOutlined, MenuFoldOutlined, MenuUnfoldOutlined, PlusOutlined} from "@ant-design/icons";
import helper from '@helper'
import utils from '@utils'

const {Column} = Table;
const {Option} = Select;
const IndexBanner = () => {

  // 图片上传配置
  const uploadConfig = {
    header: {
      authorization: helper.getToken(),
    },
    name: 'indexBanners',
    url: '/admin/api/uploadV2/auth',
    body: {
      name: 'indexBanners',
      // 用时间戳作为文件夹名字就可以保证不会同名覆盖
      dir: 'index/banner/' + utils.getDateDir(new Date()),
      overwrite: 'Y',
    },
  }

  const [list, setList] = useState([])   // table 数据源
  const [bannerAction, setBannerAction] = useState([]) // banner action列表
  const [tableLoading, setTableLoading] = useState(true) // table是否数据加载中
  const [uploadLoading, setUploadLoading] = useState(false) // 是否在上传中

  const [itemExpand, setItemExpand] = useState(false) // (跳转链接)列是否展开
  const [checkItem, setCheckItem] = useState({})     // 当前操作的行数据源（新增或修改）
  const [sortNumber, setSortNumber] = useState(1)       // 当前排序操作的序号绑定值
  const [sortVisible, setSortVisible] = useState(false) // 排序弹窗是否显示
  const [editVisible, setEditVisible] = useState(false) // 编辑弹窗是否显示
  const [deleteVisible, setDeleteVisible] = useState(false) // 删除弹窗是否展示
  const [isNew, setIsNew] = useState(false)  // 是否是新增banner，编辑和更新是同一个UI
  const [editNewDesc, setEditNewDesc] = useState(false) // 是否是新增desc，如果是就array push，如果不是新增，则需要更新对应的index值
  const [newDesc, setNewDesc] = useState('')  // 新增的desc绑定值

  const getList = () => {
    setTableLoading(true)
    setList([])
    apiWeb.getIndexBanners().then(data=>{
      if(!data){
        return
      }
      // 数据库存的是JSON字符串，需要转一下
      let listTmp = JSON.parse(data)
      listTmp = listTmp.sort((v1,v2)=>{
        if(v1.order < v2.order ){
          return 1
        }
        return -1

      })
      setList(listTmp)
      setTableLoading(false)
    })
  }

  const getActions = () => {
    apiWeb.getBannerActions({_id: 1}).then(data=>{
      if(!data || data.length < 1){
        return
      }
      setBannerAction(data)
    })
  }

  useEffect(()=>{
    getList()
    getActions()
  },[])

  const saveInfo = (content)=> {
    apiWeb.updateIndexBanners({content}).then(()=>{
      message.success('修改成功！')
      getList()
      setCheckItem({})
      setSortNumber(null)
      setSortVisible(false)
      setEditVisible(false)
      setIsNew(false)
      setDeleteVisible(false)
    })
  }

  const updateBanner = (count, status) => {
    const tmp = []
    list.forEach((item, index)=>{
      if(index === count){
        item.status = status
        tmp.push(item)
      } else {
        tmp.push(item)
      }
    })
    const content = JSON.stringify(tmp)
    saveInfo(content)
  }

  const updateSortNumber = () => {
    const tmp = []
    list.forEach(item=>{
      if(item.key === checkItem.key){
        item.order = (sortNumber - 0)
        tmp.push(item)
      } else {
        tmp.push(item)
      }
    })

    const content = JSON.stringify(tmp)
    saveInfo(content)
  }

  const beforeUpload = (file) => {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('上传的资源大小不能超过2MB!');
    }
    return isLt2M
  }

  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setUploadLoading(true)
      return;
    }
    if (info.file.status === 'done') {
      if(info.file && info.file.response){
        setUploadLoading(false)
        const result = info.file.response
        if(result.success){
          message.success('上传成功！')
          setCheckItem({...checkItem, backgroundImg: result.data})
        } else {
          message.error(`上传失败：${  result.errorMessage}`)
        }
      }
    }
  }

  const uploadButton = (
    <div>
      {uploadLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{marginTop: 8}}>上传图片</div>
    </div>
  );

  const getUploadBody = () => {
    return {
      name: uploadConfig.body.name,
      overwrite: uploadConfig.body.overwrite,
      dir: uploadConfig.body.dir,
    }
  }

  const confirmPre = () => {
    if(!checkItem.title || checkItem.title === ''){
      message.warning('标题不能为空！')
      return
    }

    if(!checkItem.desc || checkItem.desc.length < 1){
      message.warning('描述文案不能为空')
      return
    }

    if(!checkItem.backgroundImg || checkItem.backgroundImg === ''){
      message.warning('banner背景图片不能为空！')
      return
    }

    if(!checkItem.key || checkItem.key === ''){
      message.warning('banner的key不能为空！')
      return
    }

    if(checkItem.button){
      if(!checkItem.btnText || checkItem.btnText === ''){
        message.warning('按钮文案不能为空！')
        return
      }
      if((!checkItem.href || checkItem.href === '') && (checkItem.action === 'link')){
        message.warning('按钮跳转链接不能为空！')
        return
      }
    }

    const newItem = {
      order: checkItem.order,
      status: checkItem.status,
      title: checkItem.title,
      backgroundImg: checkItem.backgroundImg,
      key: checkItem.key,
      alt: checkItem.alt || '',
      desc: checkItem.desc || [],
      button: !!checkItem.button,
      btnText: checkItem.btnText || '',
      href: checkItem.href || '',
      nofollow: !!checkItem.nofollow,
      target: checkItem.target,
      action: checkItem.action || 'link',
      type: (!checkItem.type || checkItem.type === '') ? 'black' : checkItem.type,
    }

    let tmp = []
    if(isNew){
      tmp = [...list, newItem]
    } else {
      list.forEach((item)=>{
        if(item.order === checkItem.order){
          tmp.push(newItem)
        } else {
          tmp.push(item)
        }
      })
    }
    const content = JSON.stringify(tmp)
    saveInfo(content)
  }

  const deleteItem = () => {
    const tmp = []
    list.forEach((item)=>{
      if(item.key !== checkItem.key){
        tmp.push(item)
      }
    })
    const content = JSON.stringify(tmp)
    saveInfo(content)
  }

  return (
    <div className="index-banner-container">
      <div className="module-view-wrap">
        <div className="FBH">
          <Button
            className="btn-success mar-t20 mar-l20"
            onClick={()=>{
              setCheckItem({
                order: 1,
                status: 1,
                alt: 'yy科技',
                type: 'black',
                desc: [],
                button: false,
                action: 'link',
              })
              setEditVisible(true)
              setIsNew(true)
            }}
          >
            新增banner
          </Button>
        </div>
        <div className="color-orange mar-20">todo: 官网首页如果流量大的话，一般需要缓存数据，不然每一个人来访问都需要查询一次数据库，我们直接把数据缓存起来，修改了之后就刷掉缓存，减少首屏渲染时间和服务器压力</div>
        <div className="table-wrap">
          <Table
            bordered
            rowKey={(record) => record.key}
            dataSource={list}
            loading={tableLoading}
            scroll={{x: '100%'}}
            pagination={false}
          >
            <Column
              title="序号"
              width={60}
              align="center"
              render={(status, value,index)=>{
                return (
                  <span>{index + 1}</span>
                )
              }}
            />
            <Column title="标题" dataIndex="title" key="title" width={200} align="center" />
            <Column
              title="文案"
              width={200}
              align="center"
              render={(status)=>{
                return (
                  status.desc.map((item,index)=>{
                    return (
                      <div key={`desc${ index}`}>
                        {index+1}
                        .
                        {item}
                      </div>
                    )
                  })
                )
              }}
            />
            <Column
              title="背景图"
              width={200}
              align="center"
              render={status=>{
                return (
                  <img className="banner-img" src={utils.getFixUrl(status.backgroundImg)} alt="" />
                )
              }}
            />
            <Column
              title="按钮"
              width={80}
              align="center"
              render={(status)=>{
                return (
                  <>
                    {
                      status.button ? (
                        <div style={status.action === 'link' ? {color: '#2368ef'} : {color: '#444444'}}>{status.btnText}</div>
                      ) : <div style={{color: 'red'}}>无按钮</div>
                    }
                  </>
                )
              }}
            />
            <Column
              width={120}
              align="center"
              title={()=>{
                return (
                  <span>
                    跳转链接
                    {
                      itemExpand ? (
                        <MenuFoldOutlined
                          onClick={()=>{setItemExpand(false)}}
                          style={{marginLeft: '4px', color: 'orange', cursor: 'pointer'}}
                        />
                      ) : (
                        <MenuUnfoldOutlined
                          onClick={()=>{setItemExpand(true)}}
                          style={{marginLeft: '4px', color: 'orange', cursor: 'pointer'}}
                        />
                      )
                    }
                  </span>
                )
              }}
              render={(status)=>{
                return (
                  <>
                    {
                      itemExpand ? <a href={utils.getFixUrl(status.href)} target="_blank" >{utils.getFixUrl(status.href)}</a> : (
                        <span>
                          {`${status.href.slice(0,12)  }...`}
                        </span>
                      )
                    }
                  </>
                )
              }}
            />
            <Column title="排序号" dataIndex="order" key="order" width={80} align="center" />
            <Column
              title="状态"
              width={80}
              align="center"
              render={(status)=>{
                return (
                  <>
                    {
                      status.status === 1 ? <span className="color-success">已上线</span> : <span className="color-red">已下线</span>
                    }
                  </>
                )
              }}
            />
            <Column
              title="操作"
              width={200}
              fixed="right"
              align="center"
              render={(text, status, index)=>{
                return (
                  <div>
                    <Button
                      className="btn-primary mar-10"
                      onClick={()=>{
                        setCheckItem(status)
                        setEditVisible(true)
                      }}
                    >
                      编辑
                    </Button>
                    {
                      status.status === 1 ? (
                        <Button
                          className="btn-danger mar-10"
                          onClick={()=>{
                            // 这里setCheckItem 不生效，异步执行，不能立刻拿到改变的值
                            updateBanner(index, 0)
                          }}
                        >
                          下线
                        </Button>
                      ) : (
                        <Button
                          className="btn-success mar-10"
                          onClick={()=>{
                            updateBanner(index, 1)
                          }}
                        >
                          上线
                        </Button>
                      )
                    }
                    <Button
                      className="btn-warning mar-10"
                      onClick={()=>{
                        setCheckItem(status)
                        setSortNumber(status.order)
                        setSortVisible(true)
                      }}
                    >
                      排序
                    </Button>

                    <Button
                      className="btn-delete mar-10"
                      onClick={()=>{
                        setCheckItem(status)
                        setDeleteVisible(true)
                      }}
                    >
                      删除
                    </Button>
                  </div>
                )}}
            />
          </Table>
        </div>

        <Modal
          title="编辑banner"
          centered
          className="modal-view-wrap index-banner-module"
          maskClosable={false}
          maskStyle={{
            backgroundColor: 'rgba(0,0,0,0.1)',
          }}
          visible={editVisible}
          onOk={confirmPre}
          okText="保存"
          cancelText="取消"
          onCancel={() => {
            setEditVisible(false)
            setCheckItem({})
            setIsNew(false)
          }}
          width={1000}
        >
          <div className="item-cell FBH FBAC">
            <div className="item-title">标题：</div>
            <Input
              className="w-400"
              value={checkItem.title}
              onChange={e =>{ setCheckItem(
                {...checkItem, title: e.target.value}
              )}}
            />
          </div>
          <div className="item-cell FBH">
            <div className="item-title">文案：</div>
            {
              checkItem.desc && (
                <div className="FBV cell-right">
                  {
                    checkItem.desc.map((item,index)=>{
                      return (
                        <div className="item-desc FBH FBAC" key={`description${  index}`}>
                          <span className="desc">
                            {index+1}
                            .
                            {item}
                          </span>
                          <Button
                            className="btn-delete mar-l20"
                            size="small"
                            onClick={()=>{
                              const tmp = [...checkItem.desc]
                              tmp.splice(index, 1)
                              setCheckItem({...checkItem, desc: tmp})
                            }}
                          >
                            删除
                          </Button>
                        </div>
                      )
                    })
                  }
                  <div className="FBH FBAC" style={{height:'100%'}}>
                    {
                      editNewDesc ? <Input
                        className="w-600"
                        value={newDesc}
                        onBlur={()=>{
                          setEditNewDesc(false)
                          setNewDesc('')
                          setCheckItem({...checkItem, desc: [...checkItem.desc, newDesc]})
                        }}
                        onPressEnter={()=>{
                          setEditNewDesc(false)
                          setNewDesc('')
                          setCheckItem({...checkItem, desc: [...checkItem.desc, newDesc]})}}
                        onChange={(e)=>{
                          setNewDesc(e.target.value)
                        }}
                      /> : (
                        <Button
                          className="btn-success mar-b10 mar-t10"
                          size="small"
                          onClick={()=>{
                            setEditNewDesc(true)
                          }}
                        >
                          增加文案
                        </Button>
                      )
                    }
                  </div>
                </div>
              )
            }
          </div>

          <div className="item-cell FBH mar-b20 mar-t10">
            <div className="item-title haha">主图：</div>
            <div>
              <div className="FBH">
                {
                  checkItem.backgroundImg ? <img src={utils.getFixUrl(checkItem.backgroundImg)} className="banner-upload-img" alt="" /> : <div className="empty-img">暂无主图</div>
                }
                <Upload
                  name={uploadConfig.name}
                  listType="picture-card"
                  className="img-uploader mar-l10"
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                  headers={uploadConfig.header}
                  onChange={handleChange}
                  data={getUploadBody}
                  action={uploadConfig.url}
                >
                  { uploadButton }
                </Upload>
              </div>
              <div className="remark-text color-orange">注：banner标准尺寸为PC端1920 X 535px</div>
              <div className="remark-text color-orange">图片命名规范：务必不含中文，且命名请务必和其他文件名字重合</div>
            </div>
          </div>

          <div className="item-cell FBH FBAC">
            <div className="item-title">图片alt：</div>
            <Input
              className="w-200"
              value={checkItem.alt}
              onChange={e =>{ setCheckItem(
                {...checkItem, alt: e.target.value}
              )}}
            />
            <div className="color-orange">（图片的alt属性，图片加载失败时显示的文案，seo相关）</div>
          </div>

          <div className="item-cell FBH FBAC">
            <div className="item-title">key：</div>
            <Input
              className="w-200"
              value={checkItem.key}
              onChange={e =>{ setCheckItem(
                {...checkItem, key: e.target.value}
              )}}
            />
            <div className="color-orange mar-l10">key是唯一标记，请和其他banner的保持key不同</div>
          </div>

          <div className="item-cell FBH FBAC">
            <div className="item-title">是否有按钮：</div>
            <Switch
              checked={checkItem.button}
              className="mar-l10"
              onChange={e =>{ setCheckItem(
                {...checkItem, button: e}
              )}}
            />
          </div>
          {
            checkItem.button ? (
              <div className="item-cell FBH FBAC mar-l100">
                <div className="item-title">按钮动作：</div>
                <Select
                  className="normal-select"
                  onChange={e=>{
                    setCheckItem({...checkItem, action: e})
                  }}
                  value={checkItem.action}
                >
                  {
                    bannerAction.map(item=>{
                      return (
                        <Option value={item.key} key={item.key}>{item.name}</Option>
                      )
                    })
                  }
                </Select>
              </div>
            ) : null
          }
          {
            checkItem.button ? (
              <div className="item-cell FBH FBAC mar-l100">
                <div className="item-title">按钮文案：</div>

                <Input
                  className="w-200"
                  value={checkItem.btnText}
                  placeholder="请输入按钮文案"
                  onChange={e =>{ setCheckItem(
                    {...checkItem, btnText: e.target.value}
                  )}}
                />
              </div>
            ) : null
          }
          {
            checkItem.button && checkItem.action === 'link' ? (
              <div className="item-cell FBH mar-l100">
                <div className="item-title">跳转链接：</div>
                <div className="FBV">
                  <Input
                    className="w-600"
                    value={checkItem.href}
                    placeholder="请输入跳转链接"
                    onChange={e =>{ setCheckItem(
                      {...checkItem, href: e.target.value}
                    )}}
                  />
                  {/* eslint-disable-next-line react/no-unescaped-entities */}
                  <div className="color-orange" style={{height: '30px', lineHeight: '30px'}}>务必给到埋点key，from表示从哪个页面跳转到表单的，action表示点击的哪个按钮触发的。</div>
                </div>
              </div>
            ) : null
          }
          {
            checkItem.button && checkItem.action === 'link' ? (
              <div className="item-cell FBH FBAC mar-l100">
                <div className="item-title">是否添加nofollow：</div>
                <Switch
                  checked={checkItem.nofollow}
                  className="mar-l10"
                  onChange={e =>{ setCheckItem(
                    {...checkItem, nofollow: e}
                  )}}
                />
                <div className="color-orange">（添加表示爬虫不爬取该链接，除去友链交换外，一般外部链接需要添加，seo相关）</div>
              </div>
            ) : null
          }
          {
            checkItem.button && checkItem.action === 'link' ? (
              <div className="item-cell FBH FBAC mar-l100">
                <div className="item-title">是否新窗口打开：</div>
                <Switch
                  checked={checkItem.target === '_blank'}
                  className="mar-l10"
                  onChange={e =>{ setCheckItem(
                    {...checkItem, target: e ? '_blank' : '_self'}
                  )}}
                />
                <div className="color-orange">（设置开启，则会在新的浏览器打开该链接，站内链接一般可不开启，站外链接开启)</div>
              </div>
            ) : null
          }
          <div className="item-cell FBH FBAC">
            <div className="item-title">主题：</div>
            <Select
              className="select-view"
              onChange={e=>{
                setCheckItem({...checkItem, type: e})
              }}
              value={checkItem.type}
            >
              <Option value="default" key="default">默认</Option>
              <Option value="black" key="black">黑色</Option>
            </Select>
            <div className="color-orange">（black主题用于深色背景图，此时导航栏颜色为黑色，文案为白色；white主题则和black主题相反）</div>
          </div>
        </Modal>

        <Modal
          visible={sortVisible}
          centered
          width={300}
          title="排序（序号越大，越靠前）"
          okText="保存"
          cancelText="取消"
          className="sort-module-view-wrap"
          onOk={()=>{
            updateSortNumber()
          }}
          onCancel={()=>{
            setSortNumber(null)
            setSortVisible(false)
            setCheckItem({})
          }}
        >
          <div className="FBH FBAC FBJC">
            <Input
              type="number"
              className="sort-input"
              onChange={(e)=>{
                setSortNumber(e.target.value)
              }}
              value={sortNumber}
            />
          </div>
        </Modal>

        <Modal
          visible={deleteVisible}
          className="sample-view-modal"
          width={400}
          cancelText="取消"
          okText="确定"
          title="确定要删除吗（不可恢复）？"
          onOk={()=>{
            deleteItem()
          }}
          onCancel={()=>{
            setDeleteVisible(false)
            setCheckItem({})
          }}
        />
      </div>
    </div>
  )
}

export default IndexBanner
