import React, {useState, useEffect} from "react";
import "./index.styl";
import apiCase from '@api/case'
import {message, Table, Button, Modal, Input} from 'antd';

const {Column} = Table;

const IndexModule = () => {

  const [list, setList] = useState([])  // table 数据源
  const [keyMap, setKeyMap] = useState({})
  const [tableLoading, setTableLoading] = useState(true) // table是否数据加载中

  const [editVisible, setEditVisible] = useState(false) // 编辑弹窗显示
  const [checkItem, setCheckItem] = useState({})        // 当前操作的行数据源
  const [orderSort, setOrderSort] = useState(null)

  const [deleteVisible, setDeleteVisible] = useState(false)
  const [isAddVisible, setIsAddVisible] = useState(false)
  const [handleId, setHandleId] = useState(null)
  const [sortNumber, setSortNumber] = useState(null)    //  排序的序号绑定值
  const [sortVisible, setSortVisible] = useState(false) // 排序弹窗显示
  const getList = () => {
    setTableLoading(true)
    const p = {}
    if(orderSort && orderSort !== ''){
      p.orderSort = orderSort
    }

    apiCase.getCaseTag(p).then(data=>{
      if(!data){
        return
      }
      const map = {}
      data.forEach(item=>{
        map[item.key] = item
      })
      setKeyMap(map)
      setList(data)
      setTableLoading(false)
    })
  }

  useEffect(()=>{
    getList()
  },[])

  useEffect(()=>{
    getList()
  },[orderSort])

  const handleModal = (state) => {
    setCheckItem(state)
    setEditVisible(true)
  }

  const confirmPre = () => {
    const target = checkItem
    if(!target.name || target.name === ''){
      message.warning('名字不能为空！')
      return
    }
    const content = {
      name: target.name,
      remark: target.remark || '',
    }
    updateItem(checkItem._id, content)
  }

  const updateStatus = (id, status) => {
    updateItem(id,{status})
  }

  const updateItem = (id, content) => {
    apiCase.updateCaseTag({id, content}).then(()=>{
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

  const deleteItem = () => {
    const id = checkItem._id
    apiCase.deleteCaseTag({id}).then(()=>{
      message.success('修改成功！')
      getList()
      setDeleteVisible(false)
      setCheckItem({})
    })
  }

  const saveInfo = () => {
    const {key} = checkItem
    if(keyMap[key]){
      message.warning('key 已存在！')
      return
    }

    if(!checkItem.name || checkItem.name === ''){
      message.warning('name不能为空！')
      return
    }

    if(!checkItem.key || checkItem.key === ''){
      message.warning('name不能为空！')
      return
    }

    apiCase.saveCaseTag({content:{...checkItem}}).then(()=>{
      message.success('修改成功！')
      getList()
      setIsAddVisible(false)
      setCheckItem({})
    })
  }

  return (
    <div className="case-tag-container">
      <div className="index-module-wrap">
        <div className="FBH FBJ mar-t20 mar-b20">
          <div className="main-color mar-l20">简历标签</div>
          <Button
            className="btn-add mar-r20"
            type="primary"
            onClick={()=>{
              setIsAddVisible(true)
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
            <Column title="mainKey" dataIndex="mainKey" key="mainKey" width={100} align="center" />
            <Column title="名字" dataIndex="name" key="name" width={100} align="center" />
            <Column title="key" dataIndex="key" key="key" width={100} align="center" />
            <Column title="备注" dataIndex="remark" key="remark" width={100} align="center" />
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
            <Column title="排序" dataIndex="order" sorter sortOrder={orderSort} key="order" width={80} align="center" />
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
                          setHandleId(state._id)
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

                    <Modal
                      title="编辑"
                      centered
                      className="add-modal-view-wrap"
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
                      width={500}
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
                            placeholder="请输入key"
                            value={checkItem.key}
                            disabled
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
                            placeholder="请输入备注"
                            value={checkItem.remark}
                            onChange={e=>{
                              setCheckItem({...checkItem, remark: e.target.value})
                            }}
                          />
                        </div>
                      </div>
                    </Modal>
                  </div>
                ) }}
            />
          </Table>
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
              placeholder="请输入mainKey"
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

    </div>
  )
}

export default IndexModule
