import React, {useState, useEffect} from "react";
import "./index.styl";
import apiResource from '@api/resource'
import {message, Table, Button, Modal, Input, Upload, Switch} from 'antd';
import {
  LoadingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MinusCircleOutlined, PlusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import utils from '@utils'
import helper from '@helper'

const {Column} = Table;
const {TextArea} = Input;

const IndexModule = () => {

  // 图片上传配置
  const uploadConfig = {
    header: {
      authorization: helper.getToken(),
    },
    name: 'resourceColumn',
    url: '/admin/api/uploadV2/auth',
    body: {
      name: 'resourceColumn',
      // 用时间戳作为文件夹名字就可以保证不会同名覆盖
      dir: 'resource/column/cover/' + utils.getDateDir(new Date()),
      overwrite: 'Y',
    },
  }

  const [list, setList] = useState([])  // table 数据源
  const [tableLoading, setTableLoading] = useState(true) // table是否数据加载中
  const [uploadLoading, setUploadLoading] = useState(false) // 是否在上传中
  const [editVisible, setEditVisible] = useState(false) // 编辑弹窗显示
  const [checkItem, setCheckItem] = useState({})        // 当前操作的行数据源
  const [itemExpand, setItemExpand] = useState(false) // (跳转链接)列是否展开

  const [handleId, setHandleId] = useState(null)
  const [sortNumber, setSortNumber] = useState(null)    //  排序的序号绑定值
  const [sortVisible, setSortVisible] = useState(false) // 排序弹窗显示
  const [addItem, setAddItem] = useState('') // 当前是给那个栏目新添项目
  const [editItem, setEditItem] = useState('')

  const getList = () => {
    setTableLoading(true)
    apiResource.getColumnList().then(data=>{
      if(!data){
        return
      }

      setList(data)
      setTableLoading(false)
    })
  }

  useEffect(()=>{
    getList()
  },[])

  const handleModal = (state) => {
    const target = state.target === '_blank'
    const nofollow = !!state.nofollow
    setCheckItem({...state, tag: state.tag || [], target, nofollow})
    setEditVisible(true)
  }

  const confirmPre = () => {
    if(!checkItem.title || checkItem.title === ''){
      message.warning('标题不能为空！')
      return
    }

    if(!checkItem.desc || checkItem.desc === ''){
      message.warning('描述不能为空！')
      return
    }

    if(!checkItem.cover || checkItem.cover === ''){
      message.warning('描述不能为空！')
      return
    }

    const content = {
      title: checkItem.title,
      desc: checkItem.desc || '',
      cover: checkItem.cover,
      tag: checkItem.tag,
      href: checkItem.href,
      nofollow: !!checkItem.nofollow,
      order: checkItem.order,
    }
    if(checkItem.target){
      content.target = '_blank'
    }

    updateItem(checkItem._id, content)
  }
  const updateItem = (id, content) => {
    apiResource.updateColumn({id, content}).then(()=>{
      message.success('修改成功！')
      getList()
      setCheckItem({})
      setEditVisible(false)
      setSortNumber(null)
      setSortVisible(false)
      setHandleId(null)
    })
  }

  const updateSort = () => {
    const id = handleId
    const order = sortNumber - 0
    const content = {order}
    updateItem(id, content)
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
          setCheckItem({...checkItem, cover: result.data})
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

  const handleAddItem = () => {
    if(addItem !== ''){
      message.warning('请先确认正在编辑中的内容！')
      return
    }
    setAddItem('tag')
  }

  const handleDeleteItem = (index) => {
    const target = checkItem.tag
    if(index < 0){
      return
    }
    if(!target){
      return;
    }
    if(index >= target.length){
      return
    }
    target.splice(index, 1)
    setCheckItem({...checkItem, tag: target})
  }

  const addItemConfirm = () => {
    const target = checkItem.tag
    if(!editItem || editItem === ''){
      message.warning('内容不能为空！')
      return
    }
    target.push(editItem)
    setCheckItem({...checkItem, tag: target})
    setEditItem('')
    setAddItem('')
  }

  return (
    <div className="resource-column-container">
      <div className="module-view-wrap">
        <div className="table-wrap">
          <Table
            bordered
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
            <Column title="标题" dataIndex="title" key="title" width={120} align="center" />
            <Column title="描述" dataIndex="desc" key="desc" width={280} align="center" />
            <Column
              title="封面图"
              width={200}
              align="center"
              render={status=>{
                return (
                  <img className="thumb-img" src={utils.getFixUrl(status.cover)} alt="" />
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
                      itemExpand ? <a href={utils.getFixUrl(status.href)} target="_blank" rel="noreferrer">{utils.getFixUrl(status.href)}</a> : (
                        <span>
                          {`${status.href.slice(0,12)  }...`}
                        </span>
                      )
                    }
                  </>
                )
              }}
            />
            <Column
              title="标签"
              width={100}
              align="center"
              render={(status)=>{
                return (
                  (status.tag || []).map((item,index)=>{
                    return (
                      <span>
                        {item}
                        {index < status.tag.length - 1 ? ',' : ''}
                      </span>
                    )
                  })
                )
              }}
            />
            <Column title="排序" dataIndex="order" key="order" width={80} align="center" />
            <Column
              title="操作"
              width={200}
              fixed="right"
              align="center"
              render={(state)=> {
                return (
                  <div>
                    <Button className="btn-primary mar-10" onClick={()=>{handleModal(state)}}>编辑</Button>
                    <Button
                      className="btn-tag mar-10"
                      onClick={
                        ()=>{
                          setHandleId(state._id)
                          setSortNumber(state.order)
                          setSortVisible(true)
                        }
                      }
                    >
                      排序
                    </Button>
                  </div>
                ) }}
            />
          </Table>
        </div>
      </div>

      <Modal
        title="编辑"
        centered
        className="modal-view-wrap resource-column-modal"
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
        }}
        width={800}
      >
        <div>
          <div className="item-cell FBH FBAC">
            <div className="item-title">标题：</div>
            <Input
              placeholder="请输入标题"
              value={checkItem.title}
              onChange={e=>{
                setCheckItem({...checkItem, title: e.target.value})
              }}
            />
          </div>
          <div className="item-cell FBH">
            <div className="item-title-top">描述：</div>
            <TextArea
              className="textarea-input"
              value={checkItem.desc}
              onChange={e =>{
                setCheckItem({...checkItem, desc: e.target.value})
              }}
            />
          </div>
          <div className="item-cell FBH mar-b10 mar-t10">
            <div className="item-title-top">封面：</div>
            <div>
              <div className="FBH">
                {
                  checkItem.cover ? <img src={utils.getFixUrl(checkItem.cover)} className="cover-upload-img" alt="" /> : <div className="empty-img">暂无主图</div>
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
            </div>
          </div>
          <div className="item-cell FBH">
            <div className="item-title-top">标签：</div>
            <div className="FBV">
              {
                (checkItem.tag || []).map((item, index)=>{
                  return (
                    <div className="FBH" key={'tag' + index}>
                      <p className="column-tag">
                        {item}
                      </p>
                      <div className="delete-wrap">
                        <MinusCircleOutlined
                          className="delete-btn"
                          onClick={()=>{
                            handleDeleteItem(index)
                          }}
                        />
                      </div>
                    </div>
                  )
                })
              }
              {
                addItem ? (
                  <div className="FBH mar-b20">
                    <Input
                      value={editItem}
                      onChange={(e)=>{
                        setEditItem(e.target.value)
                      }}
                      style={{minWidth: '150px'}}
                    />
                    <Button
                      className="btn-warning mar-r20 mar-l20"
                      onClick={()=>{
                        addItemConfirm('tag')
                      }}
                    >
                      确认
                    </Button>
                    <Button
                      className="btn-info mar-r20"
                      onClick={()=>{
                        setAddItem('')
                        setEditItem('')
                      }}
                    >
                      取消
                    </Button>
                  </div>
                ) : (
                  <Button
                    className="btn-success mar-b20"
                    style={{width: '100px'}}
                    size="middle"
                    onClick={()=>{handleAddItem()}}
                    icon={<PlusCircleOutlined style={{fontSize: '12px'}} />}
                  >
                    添加选项
                  </Button>
                )
              }
            </div>
          </div>
          <div className="item-cell FBH FBAC">
            <div className="item-title" style={{minWidth: '65px'}}>跳转链接：</div>
            <Input
              placeholder="请输入跳转链接"
              value={checkItem.href}
              onChange={e=>{
                setCheckItem({...checkItem, href: e.target.value})
              }}
            />
          </div>
          <div className="FBH FBAC item-cell">
            <div className="item-title">是否新窗口打开：</div>
            <Switch
              checked={checkItem.target}
              className="mar-l10"
              onChange={e =>{ setCheckItem(
                {...checkItem, target: e}
              )}}
            />
          </div>
          <div className="FBH FBAC item-cell">
            <div className="item-title">添加nofollow：</div>
            <Switch
              checked={checkItem.nofollow}
              className="mar-l10"
              onChange={e =>{ setCheckItem(
                {...checkItem, nofollow: e}
              )}}
            />
          </div>
        </div>
      </Modal>

      <Modal
        visible={sortVisible}
        centered
        width={300}
        className="sort-module-view-wrap"
        title="排序（序号越大，越靠前）"
        okText="保存"
        cancelText="取消"
        onOk={updateSort}
        onCancel={()=>{
          setSortVisible(false)
          setSortNumber(null)
          setHandleId(null)
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

export default IndexModule
