import React, {useState, useEffect, useRef} from "react";
import "./index.styl";
import apiConfig from '@api/config'
import helper from '@helper'
import {withRouter} from "react-router-dom";
import {inject, observer} from "mobx-react";

import {message, Table, Button, Modal, Input, Tag, Select, Pagination} from 'antd';
import {
  SearchOutlined,
} from "@ant-design/icons";

const {Column} = Table;
const {Option} = Select

const IndexModule = (props) => {
  const {appStore} = props

  const [list, setList] = useState([])  // table 数据源
  const [total, setTotal] = useState(null)
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

    apiConfig.getCacheList(p).then(data=>{
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
  },[pageParams])

  const confirmPre = () => {
    if(!checkItem.key || checkItem.key === ''){
      message.warning('key不能为空！')
      return
    }

    if(!checkItem.name || checkItem.name === ''){
      message.warning('名字不能为空！')
      return
    }

    const content = {
      name: checkItem.name,
      key: checkItem.key,
      status: 1,
    }
    saveInfo(content)
  }

  const deleteItem = () => {
    const id = checkItem._id
    apiConfig.deleteCache({id}).then(()=>{
      message.success('修改成功！')
      getList()
      setDeleteVisible(false)
      setCheckItem({})
    })
  }

  const refresh = (value) => {
    apiConfig.refreshCache({key: value}).then(()=>{
      message.success('刷新成功！')
    })
  }

  const refreshAll = () => {
    apiConfig.refreshAllCache().then(()=>{
      message.success('刷新成功！')
    })
  }

  const updateStatus = (id, value) => {
    const content = {status: value}
    apiConfig.updateCache({id, content}).then(()=>{
      message.success('修改成功！')
      getList()
    })
  }

  const saveInfo = (content) => {
    apiConfig.saveCache({content}).then(()=>{
      message.success('修改成功！')
      getList()
      setEditVisible(false)
      setCheckItem({})
    })
  }

  return (
    <div className="app-cache-container">
      <div className="module-search-view-wrap">
        <Tag color="#4169E1" className="search-title" icon={<SearchOutlined />}>筛选</Tag>
        <div className="search-container mar-t20">
          <div className="FBH FBAC mar-l20 h-40">
            <div className="cell-title">关键词：</div>
            <Input
              className="search-input"
              allowClear
              ref={searchRef}
              placeholder="请输入名字/key"
            />
          </div>
          <div className="FBH FBAC mar-l20 h-40">
            <div className="cell-title">使用情况：</div>
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
              <Option value={1}>使用中</Option>
              <Option value={0}>已停用</Option>
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
          {
            helper.hasCPermission('app.addCache', appStore) ? (
              <Button
                className="btn-success mar-l20"
                onClick={()=>{
                  setEditVisible(true)
                  setCheckItem({
                    key: '',
                    name: '',
                  })
                }}
              >
                新增配置
              </Button>
            ) : null
          }
          {
            helper.hasCPermission('app.cacheAll', appStore) ? (
              <Button
                className="btn-danger mar-l20"
                onClick={()=>{
                  refreshAll()
                }}
              >
                刷新全部缓存
              </Button>
            ) : null
          }
        </div>
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
            <Column title="名字" dataIndex="name" key="name" width={100} align="center" />
            <Column title="key" dataIndex="key" key="key" width={150} align="center" />
            <Column
              title="状态"
              width={80}
              align="center"
              render={(status)=>{
                return (
                  <>
                    {
                      status.status === 1 ? <span className="color-success">使用中</span> : <span className="color-red">已停用</span>
                    }
                  </>
                )
              }}
            />
            <Column
              title="操作"
              width={120}
              fixed="right"
              align="center"
              render={(state)=> {
                return (
                  // 这里其实应该让后端来根据权限控制返回的列表...
                  <div>
                    {
                      (helper.hasCPermission('app.cacheUrlPermission', appStore) && state.key === 'page_url_permission') ? (
                        <Button
                          className="btn-primary mar-10"
                          onClick={
                            ()=>{refresh(state.key)}
                          }
                        >
                          刷新缓存
                        </Button>
                      ) : (
                        <>
                          {
                            state.key !== 'page_url_permission' ? (
                              <Button
                                className="btn-primary mar-10"
                                onClick={
                                  ()=>{refresh(state.key)}
                                }
                              >
                                刷新缓存
                              </Button>
                            ) : null
                          }
                        </>
                      )
                    }
                    {
                      state.status === 1 ? (
                        <>
                          {
                            helper.hasCPermission('system.adminManage', appStore) ? (
                              <Button
                                className="btn-warning mar-10"
                                onClick={
                                  ()=>{
                                    updateStatus(state._id, 0, 'status')
                                  }
                                }
                              >
                                下线
                              </Button>
                            ) : null
                          }
                        </>
                      ) : (
                        <>
                          {
                            helper.hasCPermission('system.adminManage', appStore) ? (
                              <Button
                                className="btn-success mar-10"
                                onClick={
                                  ()=>{
                                    updateStatus(state._id, 1, 'status')
                                  }
                                }
                              >
                                上线
                              </Button>
                            ) : null
                          }
                        </>
                      )
                    }
                    {
                      helper.hasCPermission('system.adminManage', appStore) ? (
                        <Button
                          className="btn-delete mar-10"
                          onClick={
                            ()=>{
                              setCheckItem(state)
                              setDeleteVisible(true)
                            }
                          }
                        >
                          删除
                        </Button>
                      ) : null
                    }
                  </div>
                ) }}
            />
          </Table>

          {
            list.length > 0 ? (
              <div className="FBH FBAC FBJC pagination-wrap mar-t40">
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
        className="modal-view-wrap activity-hot-module"
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
        width={400}
      >
        <div>
          <div className="FBH FBAC item-cell">
            <div className="item-title">key：</div>
            <Input
              placeholder="请输入key"
              value={checkItem.key}
              onChange={e=>{
                setCheckItem({...checkItem, key: e.target.value})
              }}
            />
          </div>
          <div className="FBH FBAC item-cell">
            <div className="item-title">name：</div>
            <Input
              className="input-input"
              placeholder="请输入名字"
              value={checkItem.name}
              onChange={e =>{
                setCheckItem({...checkItem, name: e.target.value})
              }}
            />
          </div>
        </div>
      </Modal>

    </div>
  )
}

export default withRouter(inject('appStore')(observer(IndexModule)))
