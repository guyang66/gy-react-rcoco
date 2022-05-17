import React, {useState, useEffect} from "react";
import "./index.styl";
import apiResume from '@api/resume'
import {message, Table, Button, Modal, Input} from 'antd';

const {Column} = Table;

const IndexModule = () => {

  const [list, setList] = useState([])  // table 数据源
  const [keyMap, setKeyMap] = useState({})
  const [tableLoading, setTableLoading] = useState(true) // table是否数据加载中

  const [editVisible, setEditVisible] = useState(false) // 编辑弹窗显示
  const [checkItem, setCheckItem] = useState({})        // 当前操作的行数据源

  const [deleteVisible, setDeleteVisible] = useState(false)
  const [isAdd, setIsAdd] = useState(false)
  const getList = () => {
    setTableLoading(true)
    apiResume.getResumeTag().then(data=>{
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

  const handleModal = (state) => {
    setCheckItem(state)
    setEditVisible(true)
  }

  const confirmPre = () => {
    const {key} = checkItem
    if(!checkItem.name || checkItem.name === ''){
      message.warning('名字不能为空！')
      return
    }

    if((!checkItem.key || checkItem.key === '') && isAdd){
      message.warning('key不能为空！')
      return
    }

    if(keyMap[key] && isAdd){
      message.warning('key 已存在！')
      return
    }

    const content = {
      name: checkItem.name,
      remark: checkItem.remark || '',
    }
    if(isAdd){
      content.mainKey = checkItem.mainKey
      content.key = checkItem.key
      content.status = checkItem.status
      saveInfo(content)
      return;
    }
    updateItem(checkItem._id, content)
  }

  const updateStatus = (id, status) => {
    updateItem(id,{status})
  }

  const updateItem = (id, content) => {
    apiResume.updateResumeTag({id, content}).then(()=>{
      message.success('修改成功！')
      getList()
      setCheckItem({})
      setEditVisible(false)
    })
  }

  const deleteItem = () => {
    const id = checkItem._id
    apiResume.deleteResumeTag({id}).then(()=>{
      message.success('修改成功！')
      getList()
      setDeleteVisible(false)
      setCheckItem({})
    })
  }

  const saveInfo = (content) => {
    apiResume.saveResumeTag({content}).then(()=>{
      message.success('修改成功！')
      getList()
      setCheckItem({})
      setIsAdd(false)
      setEditVisible(false)
    })
  }

  return (
    <div className="resume-tag-container">
      <div className="module-view-wrap">
        <div className="FBH FBJ mar-t20 mar-b20">
          <div className="module-title mar-l20">简历标签</div>
          <Button
            className="btn-success mar-r20"
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
                    <Button className="btn-primary mar-10" onClick={()=>{handleModal(state)}}>编辑</Button>
                    {
                      state.status === 1 ? (
                        <Button
                          className="btn-danger mar-10"
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
                          className="btn-success mar-10"
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
                  </div>
                ) }}
            />
          </Table>
        </div>
      </div>

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
          setEditVisible(false)
        }}
        width={500}
      >
        <div>
          <div className="item-cell FBH FBAC">
            <div className="item-title">主key：</div>
            <Input
              placeholder="请输入mainKey"
              value={checkItem.mainKey}
              disabled
            />
          </div>
          <div className="item-cell FBH FBAC">
            <div className="item-title">key：</div>
            <Input
              placeholder="请输入key"
              value={checkItem.key}
              onChange={e=>{
                setCheckItem({...checkItem, key: e.target.value})
              }}
              disabled={!isAdd}
            />
          </div>
          <div className="item-cell FBH FBAC">
            <div className="item-title">名字：</div>
            <Input
              placeholder="请输入名字"
              value={checkItem.name}
              onChange={e=>{
                setCheckItem({...checkItem, name: e.target.value})
              }}
            />
          </div>
          <div className="item-cell FBH FBAC">
            <div className="item-title">备注：</div>
            <Input
              placeholder="请输入备注"
              value={checkItem.remark}
              onChange={e=>{
                setCheckItem({...checkItem, remark: e.target.value})
              }}
            />
          </div>
        </div>
      </Modal>

      <Modal
        visible={deleteVisible}
        className="sample-view-modal"
        title="确定要删除吗（不可恢复）？"
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
      />

    </div>
  )
}

export default IndexModule
