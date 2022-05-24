import React, {useState, useEffect, useRef} from "react";
import "./index.styl";
import apiWeb from '@api/web'
import {message, Table, Button, Modal, Input, Tag, Select, Pagination} from 'antd';
import {SearchOutlined} from "@ant-design/icons";

const {Column} = Table;
const {Option} = Select
const {TextArea} = Input

const IndexModule = () => {

  const [list, setList] = useState([])  // table 数据源
  const [total, setTotal] = useState({})
  const [tableLoading, setTableLoading] = useState(true) // table是否数据加载中
  const [searchStatus, setSearchStatus] = useState(2)
  const [editVisible, setEditVisible] = useState(false) // 编辑弹窗显示
  const [checkItem, setCheckItem] = useState({})        // 当前操作的行数据源

  const [deleteVisible, setDeleteVisible] = useState(false)
  const [pageParams, setPageParams] = useState({
    page: 1,
    pageSize: 10,
    done: false,
  })

  const searchRef = useRef()
  const [isAdd, setIsAdd] = useState(false)
  const getList = () => {
    setTableLoading(true)
    const search = searchRef.current.state.value
    const p = {
      page: pageParams.page,
      pageSize: pageParams.pageSize,
    }
    if(searchStatus !== 2 && searchStatus !== '2') {
      p.status = searchStatus
    }
    if(search && search !== ''){
      p.searchKey = search
    }
    apiWeb.getPageTdkList(p).then(data=>{
      if(!data){
        return
      }
      setTotal(data.total)
      setList(data.list)
      setTableLoading(false)
    })
  }

  useEffect(()=>{
    getList()
  },[])

  useEffect(()=>{
    getList()
  },[pageParams])

  const handleModal = (state) => {
    setCheckItem(state)
    setEditVisible(true)
  }

  const confirmPre = () => {
    if(!checkItem.name || checkItem.name === ''){
      message.warning('name不能为空！')
      return
    }

    if(checkItem.name !== 'default' && (!checkItem.path || checkItem.name === '')){
      message.warning('path不能为空！')
      return
    }

    if(!checkItem.title || checkItem.title === ''){
      message.warning('title不能为空！')
      return
    }

    if(!checkItem.description || checkItem.description === ''){
      message.warning('description不能为空！')
      return
    }

    if(!checkItem.keywords || checkItem.keywords === ''){
      message.warning('keywords不能为空！')
      return
    }

    const content = {
      name: checkItem.name,
      path: checkItem.path || '',
      keywords: checkItem.keywords,
      description: checkItem.description,
      title: checkItem.title,
    }
    if(isAdd){
      content.status = 1
      saveInfo(content)
      return;
    }
    updateItem(checkItem._id, content)
  }

  const updateStatus = (id, status) => {
    updateItem(id,{status})
  }

  const updateItem = (id, content) => {
    apiWeb.updateTdk({id, content}).then(()=>{
      message.success('修改成功！')
      getList()
      setCheckItem({})
      setEditVisible(false)
      setIsAdd(false)
    })
  }

  const deleteItem = () => {
    const id = checkItem._id
    apiWeb.deleteTdk({id}).then(()=>{
      message.success('修改成功！')
      getList()
      setDeleteVisible(false)
      setCheckItem({})
    })
  }

  const saveInfo = () => {
    apiWeb.saveTdk({content:{...checkItem}}).then(()=>{
      message.success('修改成功！')
      getList()
      setIsAdd(false)
      setCheckItem({})
      setEditVisible(false)
    })
  }

  return (
    <div className="tdk-manage-container">
      <div className="module-search-view-wrap">
        <Tag color="#4169E1" className="search-title" icon={<SearchOutlined />}>筛选</Tag>
        <div className="search-container mar-t20">
          <div className="FBH FBAC mar-l20 h-40">
            <div className="cell-title">岗位名字：</div>
            <Input
              className="search-input"
              allowClear
              ref={searchRef}
              placeholder="请输入标题/描述/日期/类型"
            />
          </div>
          <div className="FBH FBAC mar-l20 h-40">
            <div className="cell-title">上线：</div>
            <Select
              className="search-select"
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
        <div className="button-view-wrap">
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
              setPageParams({
                page: 1,
                pageSize: 10,
                done: false,
              })
              getList()
            }}
          >
            筛 选
          </Button>
        </div>
      </div>
      <div className="module-view-wrap min-h-200">
        <div className="FBH mar-t20 mar-b20">
          <Button
            className="btn-success mar-l20"
            onClick={()=>{
              setIsAdd(true)
              setEditVisible(true)
              setCheckItem({
                mainKey: 'resume_tag',
                key: '',
                name: '',
                status: 1,
                remark: '',
              })
            }}
          >
            新增
          </Button>
        </div>
        <div className="table-wrap">
          <Table
            bordered
            rowKey={(record) => record.index}
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
            <Column title="name" dataIndex="name" key="name" width={100} align="center" />
            <Column title="path" dataIndex="path" key="path" width={100} align="center" />
            <Column title="title" dataIndex="title" key="title" width={120} align="center" />
            <Column title="description" dataIndex="description" key="description" width={250} align="center" />
            <Column title="keywords" dataIndex="keywords" key="keywords" width={100} align="center" />
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
              render={(state)=> {
                return (
                  <div>
                    <Button
                      className='btn-primary mar-10'
                      onClick={()=>{handleModal(state)}}
                    >
                      编辑
                    </Button>
                    {
                      state.status === 1 ? (
                        <Button
                          disabled={state.name === 'default'}
                          className={state.name === 'default' ? 'btn-disabled mar-10' : 'btn-warning mar-10'}
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
                          disabled={state.name === 'default'}
                          className={state.name === 'default' ? 'btn-disabled mar-10' : 'btn-success mar-10'}
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
                      disabled={state.name === 'default'}
                      className={state.name === 'default' ? 'btn-disabled mar-10' : 'btn-delete mar-10'}
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
              <div className="FBH FBAC FBJC mar-t40">
                <Pagination
                  current={pageParams.page}
                  onChange={e=>{
                    setPageParams({...pageParams,page: e})
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
        className="sample-view-modal"
        width={400}
        title="确定要删除吗（不可恢复）？"
        cancelText="取消"
        okText="确定"
        onOk={()=>{
          deleteItem()
        }}
        onCancel={()=>{
          setDeleteVisible(false)
          setCheckItem({})
        }}
      />

      <Modal
        title="编辑"
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
          setIsAdd(false)
          setEditVisible(false)
        }}
        width={800}
      >
        <div>
          <div className="item-cell FBH FBAC">
            <div className="item-title" style={{minWidth:'80px'}}>name：</div>
            <Input
              placeholder="请输入name"
              value={checkItem.name}
              disabled={checkItem.name === 'default'}
              onChange={e=>{
                setCheckItem({...checkItem, name: e.target.value})
              }}
            />
          </div>
          <div className="item-cell FBH FBAC">
            <div className="item-title" style={{minWidth:'80px'}}>path：</div>
            <Input
              placeholder="请输入path"
              value={checkItem.path}
              disabled={!isAdd}
              onChange={e=>{
                setCheckItem({...checkItem, path: e.target.value})
              }}
            />
          </div>
          <div className="item-cell FBH FBAC">
            <div className="item-title" style={{minWidth:'80px'}}>title：</div>
            <Input
              placeholder="请输入title"
              value={checkItem.title}
              onChange={e=>{
                setCheckItem({...checkItem, title: e.target.value})
              }}
            />
          </div>
          <div className="item-cell FBH">
            <div className="item-title-top" style={{minWidth:'80px'}}>description：</div>
            <TextArea
              style={{minHeight: '100px'}}
              placeholder="请输入description"
              value={checkItem.description}
              onChange={e=>{
                setCheckItem({...checkItem, description: e.target.value})
              }}
            />
          </div>
          <div className="item-cell FBH" style={{height: '60px', marginTop:'8px'}}>
            <div className="item-title-top" style={{minWidth:'80px'}}>keywords：</div>
            <div className="FBV FBJ">
              <Input
                placeholder="请输入keywords"
                className="w-600"
                value={checkItem.keywords}
                onChange={e=>{
                  setCheckItem({...checkItem, keywords: e.target.value})
                }}
              />
              <div className="color-orange">多个关键词用英文逗号隔开</div>
            </div>
          </div>
        </div>
      </Modal>

    </div>
  )
}

export default IndexModule
