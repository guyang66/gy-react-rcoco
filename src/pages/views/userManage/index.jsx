import React, {useState, useEffect, useRef} from "react";
import "./index.styl";
import apiUser from '@api/user'
import apiConfig from '@api/config'
import cls from "classnames"
import helper from '@helper'
import {withRouter} from "react-router-dom";
import {inject, observer} from "mobx-react";

import {Table, Button, Input, Tag, Select, Pagination, message, Modal} from 'antd';
import {
  SearchOutlined,
} from "@ant-design/icons";

const {Column} = Table;
const {Option} = Select

const IndexModule = (props) => {
  const {appStore} = props

  const [list, setList] = useState([])  // table 数据源
  const [total, setTotal] = useState(null)
  const [roles, setRoles] = useState([])
  const [tableLoading, setTableLoading] = useState(true) // table是否数据加载中
  const [searchStatus, setSearchStatus] = useState(2)
  const [roleMap, setRoleMap] = useState({})
  const [editVisible, setEditVisible] = useState(false) // 编辑弹窗显示
  const [checkItem, setCheckItem] = useState({})        // 当前操作的行数据源
  const [deleteVisible, setDeleteVisible] = useState(false)
  const [resetVisible, setResetVisible] = useState(false)
  const [handleAuth, setHandleAuth] = useState([])
  const [authVisible, setAuthVisible] = useState(false)
  const [handleItem, setHandleItem] = useState({})
  const [newVisible, setNewVisible] = useState(false)
  const [pageParams, setPageParams] = useState({
    page: 1,
    pageSize: 10,
    done: false,
  })

  const searchRef = useRef()
  const newUserRef = useRef()

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

    apiUser.getUserList(p).then(data=>{
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
      const tmp = {}
      data.forEach(item=>{
        tmp[item.key] = item
      })
      setRoles(data)
      setRoleMap(tmp)
    })
  }

  useEffect(()=>{
    getList()
    getRoles()
  },[])

  useEffect(()=>{
    getList()
  },[pageParams])

  const updateStatus = (id, value, key) => {
    if(key === 'status'){
      updateItem(id,{status: value})
      return
    }
    if(key === 'roles') {
      updateItem(id,{roles: value})
    }
  }
  const resetPassword = () => {
    // 这个接口必须要要做权限校验，不然任何人都可以通过postman发送请求修改别的用户密码
    const id = checkItem._id
    apiUser.resetPassword({id}).then(()=>{
      message.success('重置成功！')
      setResetVisible(false)
      setCheckItem({})
    })
  }

  const deleteItem = () => {
    const id = checkItem._id
    apiUser.deleteUser({id}).then(()=>{
      message.success('修改成功！')
      getList()
      setDeleteVisible(false)
      setCheckItem({})
    })
  }

  const updateItem = (id, content) => {
    apiUser.updateUserInfo({id, content}).then(()=>{
      message.success('修改成功！')
      getList()
      setResetVisible(false)
      setNewVisible(false)
      setEditVisible(false)
      setDeleteVisible(false)
      setCheckItem({})
      setEditVisible(false)
      setHandleItem({})
      setAuthVisible(false)
      setHandleAuth([])
    })
  }

  const confirmPre = () => {
    if(!checkItem.name || checkItem.name === ''){
      message.warning('昵称不能为空！')
      return
    }

    const content = {
      name: checkItem.name || '',
      phone: checkItem.phone || '',
      email: checkItem.email || '',
      position: checkItem.position || '',
      department: checkItem.department || '',
      defaultRole: checkItem.defaultRole,
      defaultRoleName: roleMap[checkItem.defaultRole].name,
      remark: checkItem.remark || '',
    }

    updateItem(checkItem._id, content)
  }

  const getRolesString = (key) => {
    if(!key || key === ''){
      return  ''
    }
    const r = roleMap[key]
    if(r){
      return r.name
    }
    return  ''
  }

  const addNewUser = () => {
    const username = newUserRef.current.state.value
    if(!username || username === ''){
      message.warning('用户名不能为空！')
      return
    }
    apiUser.createUser({username}).then(()=>{
      message.success('修改成功！')
      getList()
      setNewVisible(false)
      newUserRef.current.handleReset()
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
              placeholder="请输入账号/昵称/phone..."
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
            helper.hasCPermission('system.addUser', appStore) ? (
              <Button
                className="btn-success mar-l20"
                onClick={()=>{
                  setNewVisible(true)
                }}
              >
                新增用户
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
            <Column title="账号" dataIndex="username" key="username" width={100} align="center" />
            <Column title="昵称" dataIndex="name" key="name" width={100} align="center" />
            <Column title="电话" dataIndex="phone" key="phone" width={100} align="center" />
            <Column title="email" dataIndex="email" key="email" width={100} align="center" />
            <Column title="部门" dataIndex="department" key="department" width={100} align="center" />
            <Column title="职位" dataIndex="position" key="position" width={100} align="center" />
            <Column
              title="权限"
              width={120}
              align="center"
              render={(status)=>{
                return (
                  <>
                    {
                      status.roles.map((item,index)=>{
                        return (
                          <div
                            key={`index${  index}`}
                            className={
                              cls({
                                'color-gold': (item === 'superAdmin'),
                                'color-main': (item === 'admin'),
                              })
                            }
                          >
                            {getRolesString(item)}
                          </div>
                        )
                      })
                    }
                  </>
                )
              }}
            />
            <Column
              title="默认角色"
              width={150}
              align="center"
              render={(status)=>{
                return (
                  <span className="color-red">{status.defaultRoleName}</span>
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
            <Column title="备注" dataIndex="remark" key="remark" width={150} align="center" />
            <Column
              title="操作"
              width={300}
              fixed="right"
              align="center"
              render={(state)=> {
                return (
                  <div>
                    {
                      state.noModify === 1 ? (
                        <Button
                          className="btn-disabled mar-10"
                          disabled
                          onClick={()=>{
                            setEditVisible(true)
                            setCheckItem(state)
                          }}
                        >
                          编辑信息
                        </Button>
                      ) : (
                        <Button
                          className="btn-primary mar-10"
                          onClick={()=>{
                            setEditVisible(true)
                            setCheckItem(state)
                          }}
                        >
                          编辑信息
                        </Button>
                      )
                    }
                    {
                      helper.hasCPermission('system.usePermission', appStore) ? (
                        <>
                          {
                            state.noModify === 1 ? (
                              <Button
                                className="btn-disabled mar-10"
                                disabled
                                onClick={()=>{
                                  setAuthVisible(true)
                                  setHandleAuth(state.roles)
                                  setHandleItem(state)
                                }}
                              >
                                编辑权限
                              </Button>
                            ) : (
                              <Button
                                className="btn-tag mar-10"
                                onClick={()=>{
                                  setAuthVisible(true)
                                  setHandleAuth(state.roles)
                                  setHandleItem(state)
                                }}
                              >
                                编辑权限
                              </Button>
                            )
                          }
                        </>
                      ) : null
                    }
                    {
                      state.status === 1 ? (
                        <>
                          {
                            helper.hasCPermission('system.updateUser', appStore) ? (
                              <>
                                {
                                  state.noModify === 1 ? (
                                    <Button
                                      className="btn-disabled mar-10"
                                      disabled
                                      onClick={
                                        ()=>{
                                          updateStatus(state._id, 0, 'status')
                                        }
                                      }
                                    >
                                      禁用
                                    </Button>
                                  ) : (
                                    <Button
                                      className="btn-warning mar-10"
                                      onClick={
                                        ()=>{
                                          updateStatus(state._id, 0, 'status')
                                        }
                                      }
                                    >
                                      禁用
                                    </Button>
                                  )
                                }
                              </>
                            ) : null
                          }
                        </>
                      ) : (
                        <>
                          {
                            helper.hasCPermission('system.updateUser', appStore) ? (
                              <>
                                {
                                  state.noModify === 1 ? (
                                    <Button
                                      className="btn-disabled mar-10"
                                      disabled
                                      onClick={
                                        ()=>{
                                          updateStatus(state._id, 1, 'status')
                                        }
                                      }
                                    >
                                      启用
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
                                      启用
                                    </Button>
                                  )
                                }
                              </>
                            ) : null
                          }
                        </>
                      )
                    }
                    {
                      helper.hasCPermission('system.resetPassword', appStore) ? (
                        <Button
                          className="btn-folk mar-10"
                          onClick={()=>{
                            setCheckItem(state)
                            setResetVisible(true)
                          }}
                        >
                          重置密码
                        </Button>
                      ) : null
                    }
                    {
                      helper.hasCPermission('system.deleteUser', appStore) ? (
                        <>
                          {
                            state.noModify === 1 ? (
                              <Button
                                className="btn-disabled mar-10"
                                disabled
                                onClick={()=>{
                                  setCheckItem(state)
                                  setDeleteVisible(true)
                                }}
                              >
                                删除
                              </Button>
                            ) : (
                              <Button
                                className="btn-delete mar-10"
                                onClick={()=>{
                                  setCheckItem(state)
                                  setDeleteVisible(true)
                                }}
                              >
                                删除
                              </Button>
                            )
                          }
                        </>
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
        title="修改用户信息"
        centered
        className="modal-view-wrap"
        maskClosable={false}
        maskStyle={{
          backgroundColor: 'rgba(0,0,0,0.1)',
        }}
        visible={editVisible}
        onOk={()=>{
          confirmPre()
        }}
        okText="保存"
        cancelText="取消"
        onCancel={() => {
          setEditVisible(false)
        }}
        width={600}
      >
        <div>
          <div className="FBH FBAC item-cell">
            <div className="item-title">账号：</div>
            <Input
              className="normal-input"
              placeholder="请输入账号"
              value={checkItem.username}
              disabled
            />
          </div>
          <div className="FBH FBAC item-cell">
            <div className="item-title">昵称：</div>
            <Input
              value={checkItem.name}
              key="sys-summary"
              placeholder="请输入昵称"
              onChange={e =>{ setCheckItem({...checkItem, name: e.target.value}
              )}}
            />
          </div>
          <div className="FBH FBAC item-cell">
            <div className="item-title">phone：</div>
            <Input
              className="normal-input"
              placeholder="请输入电话"
              value={checkItem.key}
              onChange={e=>{
                setCheckItem({...checkItem, phone: e.target.value})
              }}
            />
          </div>
          <div className="FBH FBAC item-cell">
            <div className="item-title">email：</div>
            <Input
              className="normal-input"
              placeholder="请输入邮箱"
              value={checkItem.key}
              onChange={e=>{
                setCheckItem({...checkItem, email: e.target.value})
              }}
            />
          </div>
          <div className="FBH FBAC item-cell">
            <div className="item-title">部门：</div>
            <Input
              className="normal-input"
              placeholder="请输入邮箱"
              value={checkItem.department}
              onChange={e=>{
                setCheckItem({...checkItem, department: e.target.value})
              }}
            />
          </div>
          <div className="FBH FBAC item-cell">
            <div className="item-title">职位：</div>
            <Input
              className="normal-input"
              placeholder="请输入邮箱"
              value={checkItem.position}
              onChange={e=>{
                setCheckItem({...checkItem, position: e.target.value})
              }}
            />
          </div>
          {
            (checkItem.roles && checkItem.roles.length > 1) ? (
              <div className="FBH FBAC item-cell">
                <div className="item-title">默认角色：</div>
                <Select
                  style={{width: '490px'}}
                  value={checkItem.defaultRole}
                  onChange={(e)=>{
                    setCheckItem({...checkItem, defaultRole: e})
                  }}
                >
                  {
                    checkItem.roles.map((item, index)=>{
                      return (
                        <Option key={`${item  }${  index}`} value={item} style={{height: '40px'}}>{roleMap[item].name}</Option>
                      )
                    })
                  }
                </Select>
              </div>
            ) : null
          }
          <div className="FBH FBAC item-cell">
            <div className="item-title">备注：</div>
            <Input
              className="normal-input"
              placeholder="请输入邮箱"
              value={checkItem.remark}
              onChange={e=>{
                setCheckItem({...checkItem, remark: e.target.value})
              }}
            />
          </div>
        </div>
      </Modal>

      <Modal
        visible={newVisible}
        title="新增用户"
        width={500}
        cancelText="取消"
        className="modal-view-wrap"
        okText="保存"
        onOk={()=>{
          addNewUser()
        }}
        onCancel={()=>{
          newUserRef.current.handleReset()
          setNewVisible(false)
        }}
      >
        <div className="FBH FBAC item-cell">
          <div className="ITEM-title" style={{minWidth: '88px'}}>注册用户名：</div>
          <Input
            placeholder="请输入用户名"
            ref={newUserRef}
          />
        </div>

        <div className="FBH">
          <div className="color-orange mar-t5" style={{marginLeft: '88px'}}>(注：初始密码为：1)</div>
        </div>
      </Modal>

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
        visible={resetVisible}
        className="sample-view-modal"
        width={400}
        title="确定要重置该用户密码吗"
        cancelText="取消"
        okText="确定"
        onOk={()=>{
          resetPassword()
        }}
        onCancel={()=>{
          setResetVisible(false)
          setCheckItem({})
        }}
      />

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

export default withRouter(inject('appStore')(observer(IndexModule)))
