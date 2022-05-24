import React, {useState, useEffect, useRef} from "react";
import "./index.styl";
import apiActivity from '@api/activity'
import {message, Table, Button, Modal, Input, Tag, Select, Pagination, Upload, Switch, Radio} from 'antd';
import {
  LoadingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MinusCircleOutlined, PlusCircleOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import utils from '@utils'
import helper from '@helper'

const {Column} = Table;
const {Option} = Select
const {TextArea} = Input;

const IndexModule = () => {

  // 图片上传配置
  const uploadConfig = {
    header: {
      authorization: helper.getToken(),
    },
    name: 'activityBg',
    url: '/admin/api/uploadV2/auth',
    body: {
      name: 'activityBg',
      dir: 'activity/product/bg/' + utils.getDateDir(new Date()),
      overwrite: 'Y',
    },
  }

  const [list, setList] = useState([])  // table 数据源
  const [total, setTotal] = useState(null)
  const [tableLoading, setTableLoading] = useState(true) // table是否数据加载中
  const [searchStatus, setSearchStatus] = useState(2)
  const [itemExpand, setItemExpand] = useState(false) // (跳转链接)列是否展开


  const [sortVisible, setSortVisible] = useState(false) // 排序弹窗显示
  const [sortNumber, setSortNumber] = useState(null)    //  排序的序号绑定值
  const [orderSort, setOrderSort] = useState(null)

  const [editVisible, setEditVisible] = useState(false) // 编辑弹窗显示
  const [checkItem, setCheckItem] = useState({})        // 当前操作的行数据源

  const [deleteVisible, setDeleteVisible] = useState(false)
  const [uploadLoading, setUploadLoading] = useState(false) // 是否在上传中

  const [isAdd, setIsAdd] = useState(false)
  const [addItem, setAddItem] = useState('') // 当前是给那个栏目新添项目
  const [editItem, setEditItem] = useState('')

  const [tagKey, setTagKey] = useState('fill')

  const [pageParams, setPageParams] = useState({
    page: 1,
    pageSize: 10,
    done: false,
  })

  const searchRef = useRef()
  // todo: 汉化antd组件
  const getList = () => {
    setTableLoading(true)
    const search = searchRef.current.state.value
    const p = {
      type: 'product',
      page: pageParams.page,
      pageSize: pageParams.pageSize,
    }
    if(searchStatus !== 2 && searchStatus !== '2') {
      p.status = searchStatus
    }
    if(search && search !== ''){
      p.searchKey = search
    }
    if(orderSort && orderSort !== ''){
      p.orderSort = orderSort
    }

    apiActivity.getActivityList(p).then(data=>{
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
  },[orderSort, pageParams])

  const handleModal = (state) => {
    // 这里数组有深拷贝
    setCheckItem({
      title: state.title,
      desc: state.desc,
      tag: state.tag || [],
      advantage: state.advantage || [],
      cover: state.cover,
      href: state.href,
      nofollow: !!state.nofollow,
      target: state.target === '_blank',
      status: state.status,
      order: state.order,
      type: state.type,
      _id: state._id,
      remark: state.remark || '',
      btnText: state.btnText,
    })
    setEditVisible(true)
  }

  const confirmPre = () => {
    if(!checkItem.title || checkItem.title === ''){
      message.warning('名字不能为空！')
      return
    }

    if(!checkItem.desc || checkItem.desc === ''){
      message.warning('描述不能为空！')
      return
    }

    if(!checkItem.cover || checkItem.cover === ''){
      message.warning('背景图不能为空！')
      return
    }

    if(!checkItem.btnText || checkItem.btnText === ''){
      message.warning('按钮名字不能为空！')
      return
    }

    if(!checkItem.href || checkItem.href === ''){
      message.warning('跳转链接不能为空！')
      return
    }

    const content = {
      title: checkItem.title,
      desc: checkItem.desc,
      cover: checkItem.cover,
      nofollow: !!checkItem.nofollow,
      btnText: checkItem.btnText,
      advantage: checkItem.advantage || [],
      tag: checkItem.tag || [],
      href: checkItem.href,
    }

    if(isAdd){
      const newInstance = {
        ...content,
        order: 1,
        status: 1,
        type: 'normal',
      }
      saveInfo(newInstance)
      return
    }

    if(checkItem.target){
      content.target = '_blank'
    }
    updateItem(checkItem._id, content)
  }

  const updateStatus = (id, status) => {
    updateItem(id,{status})
  }

  const updateType = (id) => {
    apiActivity.setMain({id, type: 'product'}).then(()=>{
      message.success('修改成功！')
      getList()
    })
  }

  const updateItem = (id, content) => {
    apiActivity.updateActivity({id, content, type: 'product'}).then(()=>{
      message.success('修改成功！')
      getList()
      setCheckItem({})
      setEditVisible(false)
      setSortNumber(null)
      setSortVisible(false)
      setTagKey('fill')
    })
  }

  const deleteItem = () => {
    const id = checkItem._id
    apiActivity.deleteActivity({id, type: 'product'}).then(()=>{
      message.success('修改成功！')
      getList()
      setDeleteVisible(false)
      setCheckItem({})
    })
  }

  const saveInfo = (content) => {
    apiActivity.saveActivity({content, type: 'product'}).then(()=>{
      message.success('修改成功！')
      getList()
      setEditVisible(false)
      setCheckItem({})
      setIsAdd(false)
      setTagKey('fill')
    })
  }

  const updateSort = () => {
    const id = checkItem._id
    const content = {
      order: sortNumber - 0,
    }
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
    // 用时间戳作为文件夹名字就可以保证不会同名覆盖
    return {
      name: uploadConfig.body.name,
      overwrite: uploadConfig.body.overwrite,
      dir: uploadConfig.body.dir,
    }
  }

  const handleAddItem = (key) => {
    if(addItem !== ''){
      message.warning('请先确认正在编辑中的内容！')
      return
    }
    setAddItem(key)
  }

  const handleDeleteItem = (key, index) => {
    const target = checkItem[key]
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
    const newData = {}
    newData[key] = target
    setCheckItem({...checkItem, ...newData})
  }

  const addItemConfirm = (key) => {
    const target = checkItem[key]
    if(!editItem || editItem === ''){
      message.warning('内容不能为空！')
      return
    }
    target.push(
      key === 'tag' ? {
        text: editItem,
        key: tagKey,
      } : editItem
    )
    const newData = {}
    newData[key] = target
    setCheckItem({...checkItem, ...newData})
    setEditItem('')
    setAddItem('')
    setTagKey('fill')
  }
  return (
    <div className="activity-product-container">
      <div className="module-search-view-wrap">
        <Tag color="#4169E1" className="search-title" icon={<SearchOutlined />}>筛选</Tag>
        <div className="search-container mar-t20">
          <div className="FBH FBAC mar-l20 h-40">
            <div className="cell-title">关键词：</div>
            <Input
              className="search-input"
              allowClear
              ref={searchRef}
              placeholder="请输入标题/描述/key"
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
                title: '',
                desc: '',
                order: 1,
                status: 1,
                remark: '',
                advantage: [],
                tag: [],
                cover: null,
                nofollow: false,
                href: '',
                target: false,
                type: 'normal',
                btnText: '查看详情',
              })
            }}
          >
            新增活动
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
            <Column title="名字" dataIndex="title" key="title" width={100} align="center" />
            <Column title="描述" dataIndex="desc" key="desc" width={150} align="center" />
            <Column
              title="背景图"
              width={100}
              align="center"
              render={status=>{
                return <img className="cover-img" src={utils.getFixUrl(status.cover)} alt="背景图" />
              }}
            />
            <Column
              title="优势"
              width={150}
              align="center"
              render={(status)=>{
                return (
                  <>
                    {
                      (status.advantage || []).map((item,index)=>{
                        return (
                          <div key={index + 'advantage'}>
                            {index + 1}
                            {'.'}
                            {item}
                          </div>
                        )
                      })
                    }
                  </>
                )
              }}
            />
            <Column
              title="标签"
              width={150}
              align="center"
              render={(status)=>{
                return (
                  <>
                    {
                      (status.tag || []).map((item,index)=>{
                        return (
                          <div key={index + 'tag'} className={item.key === 'fill' ? 'fill' :  'outline'}>
                            {item.text}
                          </div>
                        )
                      })
                    }
                  </>
                )
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
            <Column
              title="是否是主位"
              width={80}
              align="center"
              render={(status)=>{
                return (
                  <>
                    {
                      status.type === 'main' ? <span className="color-main">是</span> : <span className="color-light-grey">否</span>
                    }
                  </>
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
                      status.status === 1 ? <span className="color-success">已上线</span> : <span className="color-red">已下线</span>
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
                      className="btn-tag mar-10"
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
                    {
                      state.type === 'normal' ? (
                        <Button
                          className="btn-warm mar-10"
                          onClick={
                            ()=>{
                              updateType(state._id)
                            }
                          }
                        >
                          设置主位
                        </Button>
                      ) : null
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

      <Modal
        visible={sortVisible}
        centered
        width={300}
        title="排序（序号越大，越靠前）"
        className="sort-module-view-wrap"
        okText="保存"
        cancelText="取消"
        onOk={updateSort}
        onCancel={()=>{
          setSortVisible(false)
          setCheckItem({})
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
        title="编辑"
        centered
        className="modal-view-wrap activity-product-modal"
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
          <div className="FBH FBAC item-cell">
            <div className="item-title">名字：</div>
            <Input
              placeholder="请输入名字"
              value={checkItem.title}
              onChange={e=>{
                setCheckItem({...checkItem, title: e.target.value})
              }}
            />
          </div>
          <div className="item-cell FBH">
            <div className="item-title-top">描述：</div>
            <TextArea
              style={{minHeight: '80px'}}
              value={checkItem.desc}
              key="sys-summary"
              placeholder="请输入描述"
              onChange={e =>{
                setCheckItem({...checkItem, desc: e.target.value})
              }}
            />
          </div>
          <div className="item-cell FBH mar-t10 mar-b10">
            <div className="item-title-top">背景图：</div>
            <div className="FBV">
              <div className="FBH">
                {
                  checkItem.cover ? <img src={utils.getFixUrl(checkItem.cover)} className="item-img" alt="" /> : <div className="empty-img">暂无主图</div>
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
            </div>
          </div>
          <div className="item-cell FBH">
            <div className="tag-title">标签：</div>
            <div className="FBV">
              {
                (checkItem.tag || []).map((item, index)=>{
                  return (
                    <div className="FBH" key={'tag' + index}>
                      <p className={item.key === 'fill' ? 'p-text tag-fill' : 'p-text tag-outline'}>
                        {item.text}
                      </p>
                      <div className="delete-wrap">
                        <MinusCircleOutlined
                          className="delete-btn"
                          onClick={()=>{
                            handleDeleteItem('tag', index)
                          }}
                        />
                      </div>
                    </div>
                  )
                })
              }
              {
                addItem === 'tag' ? (
                  <div className="FBH mar-b20">
                    <Input
                      value={editItem}
                      onChange={(e)=>{
                        setEditItem(e.target.value)
                      }}
                      style={{minWidth: '150px'}}
                    />
                    <div className="FBH FBAC" style={{minWidth: '220px'}}>
                      <span className="mar-l10 mar-r10 tag-opt-tit">标签风格：</span>
                      <Radio.Group onChange={e=>{setTagKey(e.target.value)}} value={tagKey}>
                        <Radio value="fill">填充</Radio>
                        <Radio value="outline">描边</Radio>
                      </Radio.Group>
                    </div>
                    <Button
                      className="btn-warning mar-r20"
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
                    onClick={()=>{handleAddItem('tag')}}
                    icon={<PlusCircleOutlined style={{fontSize: '12px'}} />}
                  >
                    添加选项
                  </Button>
                )
              }
            </div>
          </div>

          <div className="item-cell FBH">
            <div className="tag-title">优势：</div>
            <div className="FBV">
              {
                (checkItem.advantage || []).map((item, index)=>{
                  return (
                    <div className="FBH" key={'tag' + index}>
                      <p className="p-text">
                        {index + 1}
                        .
                        {item}
                      </p>
                      <div className="delete-wrap">
                        <MinusCircleOutlined
                          className="delete-btn"
                          onClick={()=>{
                            handleDeleteItem('advantage', index)
                          }}
                        />
                      </div>
                    </div>
                  )
                })
              }
              {
                addItem === 'advantage' ? (
                  <div className="FBH mar-b20">
                    <Input
                      className="desc-input"
                      value={editItem}
                      onChange={(e)=>{
                        setEditItem(e.target.value)
                      }}
                      style={{minWidth: '150px'}}
                    />
                    <Button
                      className="btn-warning mar-l20"
                      onClick={()=>{
                        addItemConfirm('advantage')
                      }}
                    >
                      确认
                    </Button>
                    <Button
                      className="btn-info mar-l20"
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
                    onClick={()=>{handleAddItem('advantage')}}
                    icon={<PlusCircleOutlined style={{fontSize: '12px'}} />}
                  >
                    添加选项
                  </Button>
                )
              }
            </div>
          </div>

          <div className="item-cell FBH FBAC">
            <div className="item-title" style={{minWidth: '65px'}}>按钮名字：</div>
            <Input
              className="normal-input"
              placeholder="请输入按钮名字"
              value={checkItem.btnText}
              onChange={e=>{
                setCheckItem({...checkItem, btnText: e.target.value})
              }}
            />
          </div>
          <div className="item-cell FBH FBAC">
            <div className="item-title">链接：</div>
            <Input
              className="normal-input"
              placeholder="请输入链接"
              value={checkItem.href}
              onChange={e=>{
                setCheckItem({...checkItem, href: e.target.value})
              }}
            />
          </div>
          <div className="item-cell FBH FBAC">
            <div className="item-title">是否新窗口打开：</div>
            <Switch
              checked={checkItem.target}
              className="mar-l10"
              onChange={e =>{ setCheckItem(
                {...checkItem, target: e}
              )}}
            />
            <div className="normal-title mar-l20">是否添加nofollow：</div>
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
