import React, {useState, useEffect} from "react";
import "./index.styl";
import apiNews from '@api/news'
import apiConfig from '@api/config'
import helper from '@helper'
import utils from '@utils'

import {message, Table, Button, Modal, Input, Upload, Select, Radio} from 'antd';
import {
  LoadingOutlined,
  PlusOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";

const {TextArea} = Input;
const {Column} = Table;
const {Option} = Select;

const ViewModule = () => {

  // 图片上传配置
  const uploadConfig = {
    header: {
      authorization: helper.getToken(),
    },
    name: 'indexNews',
    url: '/admin/api/uploadV2/auth',
    body: {
      name: 'indexNews',
      dir: 'index/news/cover/' +  utils.getDateDir(new Date()),
      overwrite: 'Y',
    },
  }

  const [list, setList] = useState([])  // table 数据源
  const [tableLoading, setTableLoading] = useState(true) // table是否数据加载中
  const [uploadLoading, setUploadLoading] = useState(false) // 图片是否在上传中
  const [selectLoading, setSelectLoading] = useState(true) // 下拉框是否加载中...

  const [editVisible, setEditVisible] = useState(false) // 编辑弹窗显示
  const [confirmVisible, setConfirmVisible] = useState(false) // 二次确认弹窗显示
  const [sortVisible, setSortVisible] = useState(false) // 排序弹窗显示

  const [editType, setEditType] = useState('customize')  // 编辑模式 1：system，从系统新闻列表导入作为模板；2：customize，自定义
  const [checkItem, setCheckItem] = useState({})        // 当前操作的行数据源
  const [systemItem, setSystemItem] = useState({})      // 系统文章新闻选中绑定值
  const [articles, setArticles] = useState([])          // 系统文章新闻
  const [articlesMap, setArticlesMap] = useState({})    // 系统文章新闻map表，方便查找
  const [itemExpand, setItemExpand] = useState(false)   // (跳转链接)列是否展开
  const [handleIndex, setHandleIndex] = useState(null)  // 当前正在操作的行（下标）
  const [sortNumber, setSortNumber] = useState(null)    //  排序的序号绑定值

  const isEditSystem = editType === 'system'
  const getList = () => {
    setTableLoading(true)
    apiNews.getIndexNews().then(data=>{
      if(!data){
        return
      }
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

  const getArticle = () => {
    apiNews.getOnlineNews().then(data=>{
      setArticles(data)
      // 初始化文章map
      if(data && data.length > 0){
        const tmp = {}
        data.forEach(item=>{
          tmp[item._id] = item
        })
        setArticlesMap(tmp)
      }
      setSelectLoading(false)
    })
  }

  useEffect(()=>{
    getList()
    getArticle()
  },[])

  const handleModal = (state, type, index) => {
    setHandleIndex(index)
    if(type === 'edit'){
      setCheckItem(state)
      setEditVisible(true)
    } else if(type === 'sort'){
      setCheckItem(state)
      setEditType('customize')
      setSortNumber(state.order)
      setSortVisible(true)
    }
  }

  const uploadButton = (
    <div>
      {uploadLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{marginTop: 8}}>上传图片</div>
    </div>
  );

  const selectChoose = e => {
    const target = articlesMap[e]
    if(target){
      setSystemItem({
        status: target.status,
        title: target.title,
        summary: target.summary,
        date: target.date,
        cover: target.cover,
        order: target.order,
        href: `/about/news/detail/${target.id}`,
      })
    }
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
          if(isEditSystem){
            setSystemItem({...systemItem, cover: result.data})
          } else {
            setCheckItem({...checkItem, cover: result.data})
          }
        } else {
          message.error(`上传失败：${  result.errorMessage}`)
        }
      }
    }
  }

  const confirmPre = () => {
    const target = isEditSystem ? systemItem : checkItem
    if(!target.title || target.title === ''){
      message.warning('标题不能为空！')
      return
    }
    if(!target.cover || target.cover === ''){
      message.warning('占位图不能为空！')
      return
    }
    if(!target.summary || target.summary === ''){
      message.warning('摘要不能为空！')
      return
    }
    if(!target.date || target.date === ''){
      message.warning('展示日期不能为空！')
      return
    }
    if(!target.href || target.href === ''){
      message.warning('链接不能为空！')
      return
    }
    setConfirmVisible(true)
  }

  const saveInfo = (key) => {
    setConfirmVisible(false)
    const target = isEditSystem ? systemItem : checkItem
    const tmp = []
    list.forEach((item,index)=>{
      if(handleIndex === index) {
        const obj = key === 'item' ? {
          summary: target.summary,
          title: target.title,
          href: target.href,
          date: target.date,
          cover: target.cover,
          order: target.order,
          status: target.status,
        } : {...item, order: sortNumber}
        tmp.push(obj)
      } else {
        // 其他的不用变
        tmp.push(JSON.parse(JSON.stringify(item)))
      }
    })
    apiNews.updateIndexNews({
      content: JSON.stringify(tmp),
    }).then(()=>{
      // 把状态清空
      setEditVisible(false)
      setSortVisible(false)
      setCheckItem({})
      setSystemItem({})
      setEditType('customize')
      setHandleIndex(null)
      setSortNumber(null)
      getList()
      message.success('保存成功！');
    })
  }

  const refresh = () => {
    apiConfig.refreshCache({key: 'page_index_news'}).then(()=>{
      message.success('刷新成功！')
    })
  }

  return (
    <div className="index-news-container">
      <div className="module-view-wrap">
        <div className="FBH">
          <Button
            className="btn-danger mar-t20 mar-l20"
            onClick={()=>{
              refresh()
            }}
          >
            清除官网首页新闻缓存
          </Button>
        </div>
        <div className="table-wrap">
          <Table
            bordered
            size="small"
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
              title="主图"
              width={150}
              align="center"
              render={status=>{
                return (
                  <img className="cover-img" src={utils.getFixUrl(status.cover)} alt="主图" />
                )
              }}
            />
            <Column title="摘要" dataIndex="summary" key="summary" width={300} align="center" />
            <Column title="时间" dataIndex="date" key="date" width={150} align="center" />
            <Column
              width={200}
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
                      itemExpand ? <a href={utils.getFixUrl(status.href)} target="_blank" rel="noreferrer">{utils.getFixUrl(status.href)}</a> : (
                        <span>
                          {status.href.slice(0,12)}
                          ...
                        </span>
                      )
                    }
                  </>
                )
              }}
            />
            <Column title="排序号" dataIndex="order" key="order" width={80} align="center" />
            <Column
              title="操作"
              width={200}
              fixed="right"
              align="center"
              render={(state, data, index)=> {
                return (
                  <div>
                    <Button className="btn-primary mar-5" onClick={()=>{handleModal(state, 'edit', index)}}>编辑</Button>
                    <Button className="btn-warning mar-5" onClick={()=>{handleModal(state, 'sort', index)}}>排序</Button>
                  </div>
                ) }}
            />
          </Table>
        </div>
      </div>

      <Modal
        title="编辑新闻"
        centered
        className="modal-view-wrap"
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
          setEditType('customize')
        }}
        width={1000}
      >
        <div className="item-cell FBH FBAC">
          <Radio.Group
            value={editType}
            buttonStyle="solid"
            onChange={e=>{setEditType(e.target.value)}}
          >
            <Radio.Button value="customize">自定义导入</Radio.Button>
            <Radio.Button value="system">从文章列表导入</Radio.Button>
          </Radio.Group>
        </div>
        <div className="item-cell FBH FBAC">
          <div className="item-title">标题：</div>
          {
            isEditSystem ? <Input
              className="input-input"
              value={systemItem.title}
              key="sys-title"
              onChange={e =>{ setSystemItem(
                {...systemItem, title: e.target.value}
              )}}
            /> : (
              checkItem.title ? <Input
                className="input-input"
                key="cus-title"
                onChange={e =>{ setCheckItem(
                  {...checkItem, title: e.target.value}
                )}}
                value={checkItem.title}
              /> : null
            )
          }
        </div>

        <div className="item-cell FBH">
          <div className="item-title">主图：</div>
          <div>
            <div className="FBH">
              {
                isEditSystem ? (
                  systemItem.cover ? <img src={utils.getFixUrl(systemItem.cover)} className="cover-img" alt="" /> : <div className="empty-img">暂无主图</div>
                ) : (
                  checkItem.cover ? <img src={utils.getFixUrl(checkItem.cover)} className="cover-img" alt="" /> : <div className="empty-img">暂无主图</div>
                )
              }
              <Upload
                name={uploadConfig.name}
                listType="picture-card"
                className="img-uploader mar-l20"
                showUploadList={false}
                beforeUpload={beforeUpload}
                headers={uploadConfig.header}
                onChange={handleChange}
                data={uploadConfig.body}
                action={uploadConfig.url}
              >
                { uploadButton }
              </Upload>
            </div>
            <div className="remark-text">注：图片标准尺寸为450 x 450px，请上传尽量符合标准的图片，避免图片被拉伸（图片命名规范：务必不含有中文）</div>
          </div>
        </div>

        <div className="item-cell h-100 FBH">
          <div className="item-title">摘要：</div>
          {
            isEditSystem ? (
              <TextArea
                className="input-input"
                value={systemItem.summary}
                key="sys-summary"
                onChange={e =>{ setSystemItem({...systemItem, summary: e.target.value}
                )}}
              />
            ) : (
              checkItem.summary ? <TextArea
                className="input-input"
                key="cus-summray"
                onChange={e =>{ setCheckItem({...checkItem, summary: e.target.value}
                )}}
                value={checkItem.summary}
              /> : null
            )
          }
        </div>
        <div className="item-cell FBH FBAC">
          <div className="item-title">时间：</div>
          {
            isEditSystem ? (
              <Input
                className="input-input"
                value={systemItem.date}
                key="sys-datetime"
                onChange={e =>{ setSystemItem(
                  {...systemItem, date: e.target.value}
                )}}
              />
            ) : (
              checkItem.date ? <Input
                className="input-input"
                key="cus-datetime"
                onChange={e =>{ setCheckItem(
                  {...checkItem, date: e.target.value}
                )}}
                value={checkItem.date}
              /> : null
            )
          }
        </div>
        <div className="item-cell FBH FBAC">
          <div className="item-title">链接：</div>
          {
            isEditSystem ? (
              <Input disabled className="input-input" key="sys-href" value={systemItem.href} />
            ) : (
              checkItem.href ? <Input
                key="cus-href"
                className="input-input"
                onChange={e =>{ setCheckItem(
                  {...checkItem, href: e.target.value}
                )}}
                value={checkItem.href}
              /> : null
            )
          }
        </div>
        {
          isEditSystem ? (
            <div className="item-cell FBH FBAC">
              <div className="item-title">选择已有文章：</div>
              <Select
                showSearch
                style={{width: 400}}
                placeholder="请选择一片文章导入"
                optionFilterProp="children"
                onSelect={selectChoose}
                loading={selectLoading}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {
                  articles.map( item=>{
                    return (
                      <Option value={item._id} key={item._id}>{item.title}</Option>
                    )
                  })
                }
              </Select>
            </div>
          ) : null
        }
      </Modal>

      <Modal
        visible={confirmVisible}
        centered
        className="sample-view-modal"
        width={400}
        okText="保存"
        title="确定要提交保存的修改吗？"
        cancelText="取消"
        onOk={()=>{saveInfo('item')}}
        onCancel={()=>setConfirmVisible(false)}
      />

      <Modal
        visible={sortVisible}
        centered
        width={300}
        className="sort-module-view-wrap"
        title="排序（序号越大，越靠前）"
        okText="保存"
        cancelText="取消"
        onOk={saveInfo}
        onCancel={()=>{
          setSortVisible(false)
          setSortNumber(null)
          setCheckItem({})
        }}
      >
        <div className="FBH FBAC FBJC">
          <Input
            type="number"
            className="sort-input"
            onChange={e =>{ setSortNumber(e.target.value - 0)}}
            value={sortNumber}
          />
        </div>
      </Modal>
    </div>
  )
}

export default ViewModule
