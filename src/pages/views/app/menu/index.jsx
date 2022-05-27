import React, {useState, useEffect, useRef} from "react";
import "./index.styl";
import apiConfig from '@api/config'
import {message, Table, Button, Modal, Input, Tag, Select, Tooltip, Pagination} from 'antd';
import {SearchOutlined,QuestionCircleOutlined} from "@ant-design/icons";
import cls from "classnames"

const {Column} = Table;
const {Option} = Select

const ViewModule = () => {
  const [list, setList] = useState([])  // table 数据源
  const [total, setTotal] = useState(0)
  const [tableLoading, setTableLoading] = useState(true) // table是否数据加载中
  const [searchStatus, setSearchStatus] = useState(2)
  const [searchLevel, setSearchLevel] = useState(0)
  const [orderSort, setOrderSort] = useState(null)
  const [searchIsCommon,setSearchIsCommon] = useState(2)

  const [roles, setRoles] = useState([])

  const [handleId, setHandleId] = useState(null)
  const [sortNumber, setSortNumber] = useState(null)    //  排序的序号绑定值
  const [sortVisible, setSortVisible] = useState(false) // 排序弹窗显示

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
    if(orderSort && orderSort !== ''){
      p.orderSort = orderSort
    }
    if(searchLevel !== 0) {
      p.level = searchLevel
    }
    if(searchIsCommon !==2) {
      p.isCommon = searchIsCommon
    }
    if(searchStatus !== 2) {
      p.status = searchStatus
    }
    if(search && search !== ''){
      p.searchKey = search
    }

    apiConfig.getMenuList(p).then(data=>{
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
    apiConfig.updateAdminMenu({id, content}).then(()=>{
      message.success('修改成功！')
      getList()
      setSortNumber(null)
      setSortVisible(false)
      setHandleId(null)
      setHandleItem({})
      setAuthVisible(false)
      setHandleAuth([])
    })
  }

  const updateSort = () => {
    const id = handleId
    const order = sortNumber - 0
    const content = {order}
    updateItem(id, content)
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

  const getMenuLevelString = (key) => {
    if(!key){
      return ''
    }
    if(key === 1 || key === '1'){
      return '一级菜单'
    }
    if(key === 2 || key === '2'){
      return '二级菜单'
    }
    if(key === 3 || key === '3'){
      return '三级菜单'
    }
    return  ''
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

  return (
    <div className="app-menu-container">
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

          <div className="FBH FBAC mar-l20 h-40">
            <div className="cell-title">是否是公共：</div>
            <Select
              className="search-select"
              value={searchIsCommon}
              onChange={
                (e)=>{
                  setSearchIsCommon(e)
                }
              }
            >
              <Option value={2}>全部</Option>
              <Option value={1}>是</Option>
              <Option value={0}>否</Option>
            </Select>
          </div>

          <div className="FBH FBAC mar-l20 h-40">
            <div className="mar-r10">菜单级别：</div>
            <Select
              className="search-select"
              value={searchLevel}
              onChange={
                (e)=>{
                  setSearchLevel(e)
                }
              }
            >
              <Option value={0}>全部</Option>
              <Option value={1}>一级菜单</Option>
              <Option value={2}>二级菜单</Option>
              <Option value={3}>三级菜单</Option>
            </Select>
          </div>
        </div>
        <div className="button-view-wrap">
          <Button
            className="btn-info mar-r20"
            onClick={()=>{
              searchRef.current.handleReset()
              setSearchStatus(2)
              setSearchLevel(0)
              setSearchIsCommon(2)
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
            <Column title="名字" dataIndex="title" key="title" width={150} align="center" />
            <Column title="key" dataIndex="key" key="key" width={150} align="center" />
            <Column title="path" dataIndex="path" key="path" width={150} align="center" />
            <Column
              title="级别"
              width={100}
              align="center"
              render={(status)=>{
                return (
                  <span className={cls({
                    'color-main': (status.level === 1),
                    'color-red': (status.level === 2),
                    'color-orange': (status.level === 3),
                  })}
                  >
                    {getMenuLevelString(status.level)}
                  </span>
                )
              }}
            />
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
              title={()=>{
                return (
                  <Tooltip placement="top" title="如果是公共，表示该菜单所有人可见，权限设置无效；否则表示是权限菜单，仅配置了权限的用户可见">
                    <div>
                      公共
                      <QuestionCircleOutlined style={{marginLeft: '4px', fontSize: '14px'}} />
                    </div>
                  </Tooltip>
                )
              }}
              width={80}
              align="center"
              render={(status)=>{
                return (
                  <>
                    {
                      status.isCommon ? <span style={{color: '#67c23a'}}>是</span> : <span style={{color: "red"}}>否</span>
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
            <Column title="排序" dataIndex="order" sorter sortOrder={orderSort} key="order" width={80} align="center" />
            <Column
              title="操作"
              width={300}
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
                    {
                      state.isCommon === 1 ? (
                        <Button
                          className="btn-danger mar-10"
                          onClick={
                            ()=>{
                              updateStatus(state._id, 0, 'isCommon')
                            }
                          }
                        >
                          取消公共
                        </Button>
                      ) : (
                        <Button
                          className="btn-folk mar-10"
                          onClick={
                            ()=>{
                              updateStatus(state._id, 1, 'isCommon')
                            }
                          }
                        >
                          设置公共
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
          setHandleId(null)
          setSortNumber(null)
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
