import React, {useState, useEffect, useRef} from "react";
import "./index.styl";
import apiCase from '@api/case'
import {message, Table, Button, Modal, Input, Tag, Select, Pagination, Upload, Switch} from 'antd';
import {LoadingOutlined, MenuFoldOutlined, MenuUnfoldOutlined, PlusOutlined, SearchOutlined} from "@ant-design/icons";
import utils from '@utils'
import helper from '@helper'

const {Column} = Table;
const {Option} = Select
const {TextArea} = Input;

// todo: module名字
const IndexModule = () => {

  // 图片上传配置
  const uploadConfig = {
    header: {
      authorization: helper.getToken(),
    },
    name: 'caseLogo',
    url: '/admin/api/uploadV2/auth',
    body: {
      name: 'caseLogo',
      dir: 'case/logo/' + utils.getDateDir(new Date()),
      overwrite: 'Y',
    },
  }
  const [list, setList] = useState([])  // table 数据源
  const [total, setTotal] = useState([])  // table 数据源

  const [tableLoading, setTableLoading] = useState(true) // table是否数据加载中
  const [searchStatus, setSearchStatus] = useState(2)
  const [itemExpand, setItemExpand] = useState(false) // (跳转链接)列是否展开

  const [editVisible, setEditVisible] = useState(false) // 编辑弹窗显示
  const [checkItem, setCheckItem] = useState({})        // 当前操作的行数据源

  const [isAdd, setIsAdd] = useState(false)
  const [deleteVisible, setDeleteVisible] = useState(false)
  const [isAddVisible, setIsAddVisible] = useState(false)

  const [sortVisible, setSortVisible] = useState(false) // 排序弹窗显示
  const [sortNumber, setSortNumber] = useState(null)    //  排序的序号绑定值
  const [orderSort, setOrderSort] = useState(null)

  const [uploadLoading, setUploadLoading] = useState(false) // 是否在上传中

  const [pageParams, setPageParams] = useState({
    page: 1,
    pageSize: 10,
    done: false,
  })

  const searchRef = useRef()

  const getList = () => {
    const search = searchRef.current.state.value
    const p = {
      searchKey: search,
      page: pageParams.page,
      pageSize: pageParams.pageSize,
    }
    if(searchStatus - 0 !== 2) {
      p.status = searchStatus
    }
    if(search && search !== ''){
      p.searchKey = search
    }

    if(orderSort && orderSort !== ''){
      p.orderSort = orderSort
    }

    setTableLoading(true)
    apiCase.getCaseList(p).then(data=>{
      if(!data){
        return
      }
      setList(data.list)
      setTotal(data.total)
      setTableLoading(false)
    })
  }

  useEffect(()=>{
    getList()
  },[pageParams, orderSort])

  const handleModal = (state) => {
    const keyString = state.key ? state.key.toString() : ''
    const target = state.target === '_blank'
    const nofollow = !!state.target
    setIsAdd(false)
    setCheckItem({...state, key: keyString, target, nofollow})
    setEditVisible(true)
  }

  const confirmPre = (isNew) => {
    const target = checkItem
    if(!target.title || target.title === ''){
      message.warning('标题不能为空！')
      return
    }
    if(!target.desc || target.desc === ''){
      message.warning('描述不能为空！')
      return
    }

    if(!target.icon || target.icon === ''){
      message.warning('图片不能为空！')
      return
    }

    if(!target.href || target.href === ''){
      message.warning('描述不能为空！')
      return
    }

    const content = {
      title: target.title,
      desc: target.desc,
      key: target.key ? target.key.split(',') : '',
      icon: target.icon,
      href: target.href,
      nofollow: !!target.nofollow,
    }
    if(target.target){
      content.target = '_blank'
    }
    if(isNew){
      saveInfo(content)
      return;
    }
    updateItem(checkItem._id, content)
  }

  const updateStatus = (id, status) => {
    updateItem(id,{status})
  }

  const updateItem = (id, content) => {
    apiCase.updateCase({id, content}).then(()=>{
      message.success('修改成功！')
      getList()
      setCheckItem({})
      setEditVisible(false)
      setSortNumber(null)
      setSortVisible(false)
    })
  }

  const updateSort = () => {
    const id = checkItem._id
    const content = {
      order: sortNumber - 0,
    }
    updateItem(id, content)
  }

  const deleteItem = () => {
    const id = checkItem._id
    apiCase.deleteCase({id}).then(()=>{
      message.success('修改成功！')
      getList()
      setDeleteVisible(false)
      setCheckItem({})
    })
  }

  const saveInfo = (content) => {
    apiCase.saveCase({content}).then(()=>{
      message.success('修改成功！')
      getList()
      setEditVisible(false)
      setCheckItem({})
      setIsAdd(false)
    })
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
          setCheckItem({...checkItem, icon: result.data})
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
    // 用时间戳作为文件夹名字就可以保证不会同名覆盖
    return {
      name: uploadConfig.body.name,
      overwrite: uploadConfig.body.overwrite,
      dir: uploadConfig.body.dir,
    }
  }

  return (
    <div className="case-list-container">

      <div className="resume-search-wrap">
        <Tag color="#4169E1" className="search-title" icon={<SearchOutlined />}>筛选</Tag>
        <div className="search-container">
          <div className="FBH FBAC mar-l20 h-80">
            <div className="n-title">岗位名字：</div>
            <Input
              className="n-input mar-l10"
              allowClear
              ref={searchRef}
              placeholder="请输入标题/岗位/描述"
            />
          </div>
          <div className="FBH FBAC mar-l20 h-80">
            <div className="n-title">上线：</div>
            <Select
              className="n-search"
              value={searchStatus}
              onChange={
                (e)=>{
                  setSearchStatus(e)
                }
              }
            >
              <Option value={2}>全部</Option>
              <Option value={1}>已上线</Option>
              <Option value={0}>已下线</Option>
            </Select>
          </div>
        </div>
        <div className="btns-container">
          <Button
            className="btn-info mar-r20"
            onClick={()=>{
              searchRef.current.handleReset()
              setSearchStatus(2)
            }}
          >
            清空条件
          </Button>
          <Button
            className="btn-primary mar-r20"
            onClick={()=>{
              getList()
            }}
          >
            筛 选
          </Button>
        </div>
      </div>

      <div className="index-module-wrap">
        <div className="FBH FBJ mar-t20 mar-b20">
          <div className="main-color mar-l20">简历标签</div>
          <Button
            className="btn-add mar-r20"
            type="primary"
            onClick={()=>{
              setIsAdd(true)
              setEditVisible(true)
              setCheckItem({
                title: '',
                desc: '',
                key: '',
                icon: '',
                href: '',
                nofollow: false,
                target: false,
              })
            }}
          >
            新增案例
          </Button>
        </div>
        <div className="table-wrap">
          <Table
            bordered
            rowKey={(record) => record.index}
            dataSource={list}
            loading={tableLoading}
            scroll={{x: '100%'}}
            onChange={(pagination,filters,sorter)=>{
              if(sorter){
                if(sorter.columnKey === 'order'){
                  setOrderSort(sorter.order)
                }
              }
            }}
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
            <Column title="标题" dataIndex="title" key="title" width={100} align="center" />
            <Column title="描述" dataIndex="desc" key="desc" width={160} align="center" />
            <Column
              title="关键词"
              width={100}
              align="center"
              render={(status)=>{
                return (
                  <>
                    {
                      (status.key || []).map((item,index)=>{
                        return (
                          <span key={item}>
                            {item}
                            {index < (status.key.length - 1) ? ',' : ''}
                          </span>
                        )
                      })
                    }
                  </>
                )
              }}
            />
            <Column
              title="logo"
              width={100}
              align="center"
              render={status=>{
                return <img className="logo-img" src={utils.getFixUrl(status.icon)} alt="" />
              }}
            />
            <Column
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
              width={100}
              align="center"
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
            <Column title="排序" dataIndex="order" sorter sortOrder={orderSort} key="order" width={80} align="center" />
            <Column
              title="状态"
              width={80}
              align="center"
              render={(status)=>{
                return (
                  <>
                    {
                      status.status === 1 ? <span className="online-text">已上线</span> : <span className="offline-text">已下线</span>
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
              render={(state)=> {
                return (
                  <div>
                    <Button className="btn-danger mar-r20" onClick={()=>{handleModal(state)}}>编辑</Button>
                    {
                      state.status === 1 ? (
                        <Button
                          className="btn-warning mar-r20"
                          onClick={
                            ()=>{
                              updateStatus(state._id, 0)
                            }
                          }
                        >
                          下线
                        </Button>
                      ) : (
                        <Button
                          className="btn-success mar-r20"
                          onClick={
                            ()=>{
                              updateStatus(state._id, 1)
                            }
                          }
                        >
                          上线
                        </Button>
                      )
                    }
                    <Button
                      className="btn-tag mar-r20"
                      onClick={
                        ()=>{
                          setCheckItem(state)
                          setSortNumber(state.order)
                          setSortVisible(true)
                        }
                      }
                    >
                      排序
                    </Button>
                    <Button
                      className="btn-delete"
                      onClick={
                        ()=>{
                          setCheckItem(state)
                          setDeleteVisible(true)
                        }
                      }
                    >
                      删除
                    </Button>
                  </div>
                ) }}
            />
          </Table>

          {
            list.length > 0 ? (
              <div className="FBH FBAC FBJC pagination-wrap">
                <Pagination
                  current={pageParams.page}
                  onChange={e=>{
                    setPageParams({...pageParams, page: e})
                  }}
                  Pagination
                  total={total}
                  className="mar-t20"
                />
              </div>
            ) : null
          }

        </div>
      </div>

      <Modal
        visible={deleteVisible}
        className="resource-list-normal-modal"
        width={400}
        cancelText="取消"
        okText="确定"
        onOk={()=>{
          deleteItem()
        }}
        onCancel={()=>{
          setDeleteVisible(false)
          setCheckItem({})
        }}
      >
        <p className="normal-content">确定要删除吗（不可恢复）？</p>
      </Modal>

      <Modal
        visible={isAddVisible}
        title="新增标签"
        width={400}
        cancelText="取消"
        className="add-modal-view-wrap"
        okText="确定"
        onOk={()=>{
          saveInfo()
        }}
        onCancel={()=>{
          setCheckItem({})
          setIsAddVisible(false)
        }}
      >
        <div>
          <div className="FBH modal-cell">
            <div className="normal-title">mainKey：</div>
            <Input
              className="normal-input"
              placeholder="请输入名字"
              value={checkItem.mainKey}
              disabled
            />
          </div>
          <div className="FBH modal-cell">
            <div className="normal-title">key：</div>
            <Input
              className="normal-input"
              placeholder="请输入名字"
              value={checkItem.key}
              onChange={e=>{
                setCheckItem({...checkItem, key: e.target.value})
              }}
            />
          </div>
          <div className="FBH modal-cell">
            <div className="normal-title">名字：</div>
            <Input
              className="normal-input"
              placeholder="请输入名字"
              value={checkItem.name}
              onChange={e=>{
                setCheckItem({...checkItem, name: e.target.value})
              }}
            />
          </div>
          <div className="FBH modal-cell">
            <div className="normal-title">备注：</div>
            <Input
              className="normal-input"
              placeholder="请输入key"
              value={checkItem.remark}
              onChange={e=>{
                setCheckItem({...checkItem, remark: e.target.value})
              }}
            />
          </div>
        </div>
      </Modal>

      <Modal
        visible={sortVisible}
        centered
        width={300}
        title="排序（序号越大，越靠前）"
        okText="保存"
        cancelText="取消"
        onOk={updateSort}
        onCancel={()=>setSortVisible(false)}
      >
        <div className="FBH FBAC FBJC">
          <Input
            type="number"
            className="text-center"
            onChange={e =>{ setSortNumber(e.target.value - 0)}}
            value={sortNumber}
          />
        </div>
      </Modal>

      <Modal
        title={isAdd ? '新增案例' : '编辑案例'}
        centered
        className="add-modal-view-wrap edit-modal-view"
        maskClosable={false}
        maskStyle={{
          backgroundColor: 'rgba(0,0,0,0.1)',
        }}
        visible={editVisible}
        onOk={()=>{
          confirmPre(isAdd)
        }}
        okText="保存"
        cancelText="取消"
        onCancel={() => {
          setEditVisible(false)
        }}
        width={800}
      >
        <div>
          <div className="FBH modal-cell">
            <div className="normal-title">标题：</div>
            <Input
              className="normal-input"
              placeholder="请输入标题"
              value={checkItem.title}
              onChange={e =>{ setCheckItem({...checkItem, title: e.target.value}
              )}}
            />
          </div>
          <div className="FBH modal-cell">
            <div className="normal-title">描述：</div>
            <TextArea
              className="textarea-input"
              value={checkItem.desc}
              key="sys-summary"
              onChange={e =>{ setCheckItem({...checkItem, desc: e.target.value}
              )}}
            />
          </div>
          <div className="FBH modal-cell">
            <div className="normal-title">关键词：</div>
            <Input
              className="normal-input"
              placeholder="请输入关键词，每个词以英文逗号（,）分开"
              value={checkItem.key}
              onChange={e=>{
                setCheckItem({...checkItem, key: e.target.value})
              }}
            />
          </div>
          <div className="FBH modal-cell">
            <div className="normal-title">logo：</div>
            <div className="FBV">
              <div className="FBH">
                {
                  checkItem.icon ? <img src={utils.getFixUrl(checkItem.icon)} className="item-img" alt="" /> : <div className="empty-img">暂无主图</div>
                }
                <Upload
                  name={uploadConfig.name}
                  listType="picture-card"
                  className="img-uploader mar-l20"
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
              <div className="remark-text prompt-text mar-t10">注：标准尺寸为正方形（如80px x 80px、100px x 100px都可）</div>
            </div>
          </div>
          <div className="FBH modal-cell">
            <div className="normal-title">跳转链接：</div>
            <Input
              className="normal-input"
              placeholder="请输入跳转链接"
              value={checkItem.href}
              onChange={e=>{
                setCheckItem({...checkItem, href: e.target.value})
              }}
            />
          </div>
          <div className="FBH modal-cell">
            <div className="normal-title">是否新窗口打开：</div>
            <Switch
              checked={checkItem.target}
              className="mar-l10"
              onChange={e =>{ setCheckItem(
                {...checkItem, target: e}
              )}}
            />
          </div>
          <div className="FBH modal-cell">
            <div className="normal-title">添加nofollow：</div>
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

    </div>
  )
}

export default IndexModule
