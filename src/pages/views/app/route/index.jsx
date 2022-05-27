import React, {useState, useEffect, useRef} from "react";
import "./index.styl";
import apiConfig from '@api/config'
import {message, Table, Button, Modal, Input, Tag, Select, Pagination} from 'antd';
import {SearchOutlined} from "@ant-design/icons";
import cls from "classnames";

const {Column} = Table;
const {Option} = Select

const ViewModule = () => {
  const [list, setList] = useState([])  // table 数据源
  const [total, setTotal] = useState(0)
  const [tableLoading, setTableLoading] = useState(true) // table是否数据加载中
  const [searchStatus, setSearchStatus] = useState(2)
  const [orderSort, setOrderSort] = useState(null)

  const [roles, setRoles] = useState([])
  const [handleAuth, setHandleAuth] = useState([])
  const [authVisible, setAuthVisible] = useState(false)
  const [handleItem, setHandleItem] = useState({})
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
    if(search && search !== ''){
      p.searchKey = search
    }
    if(searchStatus !== 2) {
      p.status = searchStatus
    }
    apiConfig.getRouteList(p).then(data=>{
      if(!data){
        return
      }
      setTotal(data.total)
      setList(data.list)
      setTableLoading(false)
    })
  }

  const getRoles = () => {
    apiConfig.getRoles().then(data=>{
      if(!data || data.length < 1){
        return
      }
      setRoles(data)
    })
  }

  useEffect(()=>{
    getRoles()
  },[])

  useEffect(()=>{
    getList()
  },[orderSort,pageParams])

  const updateStatus = (id, value, key) => {
    if(key === 'status'){
      updateItem(id,{status: value})
      return
    }
    if(key === 'isCommon'){
      updateItem(id,{isCommon: value})
    }
    if(key === 'roles') {
      updateItem(id,{roles: value})
    }
  }

  const updateItem = (id, content) => {
    apiConfig.updateAdminRoute({id, content}).then(()=>{
      message.success('修改成功！')
      getList()
      setHandleItem({})
      setAuthVisible(false)
      setHandleAuth([])
    })
  }

  const hasAuthRoles = (key) => {
    if(!key || key === ''){
      return false
    }
    if(!roles || roles.length < 1){
      return  false
    }
    const targetList = handleAuth || []
    const r = targetList.find(item=>{
      return item === key
    })
    return !!r
  }

  const saveAuthConfig = () => {
    if(!handleAuth || handleAuth.length < 1){
      message.warning('权限至少要授予一个！')
      return
    }
    if(!handleItem._id){
      message.warning('id不存在！')
      return
    }
    updateStatus(handleItem._id, handleAuth, 'roles')
  }

  return (
    <div className="app-route-container">
      <div className="module-search-view-wrap">
        <Tag color="#4169E1" className="search-title" icon={<SearchOutlined />}>筛选</Tag>
        <div className="search-container mar-t20">
          <div className="FBH FBAC mar-l20 h-40">
            <div className="cell-title">名字：</div>
            <Input
              className="search-input"
              allowClear
              ref={searchRef}
              placeholder="请输入名字"
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
        <div className="table-wrap">
          <Table
            bordered
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
            <Column title="名字" dataIndex="name" key="name" width={150} align="center" />
            <Column title="key" dataIndex="key" key="key" width={150} align="center" />
            <Column title="path" dataIndex="path" key="path" width={150} align="center" />
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
              title="权限"
              width={100}
              align="center"
              render={(status)=>{
                return (
                  <>
                    {
                      status.roles.map((item,index)=>{
                        return (
                          <div key={`index${  index}`}>{item}</div>
                        )
                      })
                    }
                  </>
                )
              }}
            />
            <Column
              title="操作"
              width={150}
              fixed="right"
              align="center"
              render={(state)=> {
                return (
                  <div>
                    <Button
                      className="btn-primary mar-10"
                      onClick={()=>{
                        setAuthVisible(true)
                        setHandleAuth(state.roles)
                        setHandleItem(state)
                      }}
                    >
                      编辑权限
                    </Button>
                    {
                      state.status === 1 ? (
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
                      ) : (
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
                      )
                    }
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
        visible={authVisible}
        title="用户权限编辑"
        width={800}
        cancelText="取消"
        className="modal-view-wrap"
        okText="保存"
        onOk={()=>{
          saveAuthConfig()
        }}
        onCancel={()=>{
          setHandleItem({})
          setAuthVisible(false)
        }}
      >
        <div className="roles-wrap">
          {
            roles.map(item =>{
              return (
                <div key={item.key}>
                  <div className="FBH role-choose-cell FBAC FBJ">
                    <span className={
                      cls({
                        'color-light-grey': true,
                        'color-red': hasAuthRoles(item.key),
                      })
                    }
                    >
                      {item.key}
                      {' '}
                      （
                      {item.name}
                      ）
                    </span>
                    <div className="FBH FBAC">
                      {
                        hasAuthRoles(item.key) ? (
                          <Button
                            className="btn-danger mar-r20"
                            onClick={()=>{
                              setHandleAuth(handleAuth.filter(key => key !== item.key))
                            }}
                          >
                            收回
                          </Button>
                        ) : (
                          <Button
                            className="btn-success mar-r20"
                            onClick={()=>{
                              if(handleAuth && handleAuth.indexOf(item.key) === -1){
                                setHandleAuth([...handleAuth, item.key])
                              }
                            }}
                          >
                            授予
                          </Button>
                        )
                      }
                    </div>
                  </div>
                  <div className="lines" />
                </div>
              )
            })
          }
          <div className="color-orange mar-t20">注：点击保存之后才生效</div>
        </div>
      </Modal>

    </div>
  )
}

export default ViewModule
