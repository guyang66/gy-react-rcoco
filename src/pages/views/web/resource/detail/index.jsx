import React , {useState, useEffect} from "react";
import "./index.styl";
import {Tag, Input, Button, message, Upload ,DatePicker, Radio, Select} from 'antd'
import apiResource from '@api/resource'
import {withRouter} from "react-router-dom";
import helper from '@helper'
import {TweenOneGroup} from 'rc-tween-one';
import {LoadingOutlined, MinusCircleOutlined, PlusCircleOutlined, PlusOutlined} from "@ant-design/icons";

import utils from "@common/utils";

const {Option} = Select;
const {TextArea} = Input

const ResourceDetail = (props) => {
  const {location, history} = props
  // 是否是编辑状态
  const resourceId =  location.state && location.state.id
  const isEdit =  location.state && location.state.edit === 'Y'
  const isNew = (resourceId === null || resourceId === undefined)
  const [category, setCategory] = useState([])
  const [categorySelectLoading, setCategorySelectLoading] = useState(true)

  const [resourceDetail, setResourceDetail] = useState({})
  const [radioValue, setRadioValue] = useState('upload')
  const [uploadLoading, setUploadLoading] = useState(false)

  const [tagModel, setTagModel] = useState([]) // 搜索关键词绑定数据
  const [tagEdit, setTagEdit] = useState(false)
  const [tagNew, setTagNew] = useState('')
  const [addItem, setAddItem] = useState('') // 是否在编辑标签
  const [editItem, setEditItem] = useState('') // 标签绑定值
  // 这个不要用ref， 因为input 节点尚未渲染。
  const [tagInputRef, setTagInputRef] = useState(null)

  const uploadConfig = {
    header: {
      authorization: helper.getToken(),
    },
    name: 'resourceDetail',
    url: '/admin/api/uploadV2/auth',
    body: {
      name: 'resourceDetail',
      // 用时间戳作为文件夹名字就可以保证不会同名覆盖
      dir: 'resource/detail/' + utils.getDateDir(new Date()),
      overwrite: 'Y',
    },
  }
  const getDetail = () => {
    if(isNew){
      setResourceDetail({
        title: '',
        desc: '',
        key: '',
        size: '',
        type: '',
        download: 0,
        downloadType: 'normal',
        href: '',
        search: [],
        tag: [],
        date: '',
        remark: '',
        order: 1,
        status: 1, // 新建为1
      })
      return
    }
    apiResource.getResourceDetail({id: resourceId}).then(data=>{
      setResourceDetail(data)
      setTagModel(data.search ? data.search : [])
    }).catch(error=>{
      message.error(error.message)
    })
  }

  const getCategory = () => {
    apiResource.getCategoryOnlineList().then(data=>{
      if(!data){
        return
      }
      setCategory(data)
      setCategorySelectLoading(false)
    })
  }

  useEffect(()=>{
    getDetail()
    getCategory()
  },[])

  const chooseDate = (e,d)=>{
    setResourceDetail({...resourceDetail, date: d})
  }

  const onRadioChange = e => {
    setResourceDetail({...resourceDetail, downloadType: e.target.value})
  }

  const uploadButton = (
    <div>
      {uploadLoading ? (
        <LoadingOutlined />
      ): <PlusOutlined />}
      <div style={{marginTop: 8}}>{uploadLoading ? '资源正在上传中...请勿操作...' : '上传资源'}</div>
    </div>
  );

  const getUploadBody = () => {
    return {
      name: uploadConfig.body.name,
      overwrite: uploadConfig.body.overwrite,
      dir: uploadConfig.body.dir,
    }
  }

  const handleChange = (info)=> {
    if (info.file.status === 'uploading') {
      setUploadLoading(true)
      return
    }

    if (info.file.status === 'done') {
      if(info.file && info.file.response){
        setUploadLoading(false)
        const result = info.file.response
        if(result.success){
          console.log(result)
          message.success('上传成功！')
          setResourceDetail({...resourceDetail, href: result.data})
        } else {
          message.error(`上传失败：${  result.errorMessage}`)
        }
      }
    }
  }

  const removeTag = (removedTag) => {
    setTagModel(tagModel.filter(tag => tag !== removedTag))
  };

  const tagChild = tagModel.map((tag, index)=>{
    const tagElem = (
      <Tag
        closable
        key={`tag-key-${  index}`}
        className="key-tags"
        onClose={e => {
          e.preventDefault();
          removeTag(tag);
        }}
      >
        {tag}
      </Tag>
    );
    return (
      <span key={tag} style={{display: 'inline-block'}}>{tagElem}</span>
    );
  })

  const handleTagInputChange = (e) =>{
    setTagNew(e.target.value)
  }

  const handleTagInputConfirm = () => {
    if(tagNew && tagModel.indexOf(tagNew) === -1){
      setTagModel([...tagModel, tagNew])
    } else {
      message.warning('标签已存在！')
    }
    setTagEdit(false)
    setTagNew('')
  }

  const showTagInput = () => {
    setTagEdit(true)
  }
  // 监听input被挂载，然后自动焦点
  useEffect(()=>{
    if(tagEdit && tagInputRef){
      tagInputRef.focus()
    }
  },[tagInputRef])

  const saveInfo = () => {
    if(!resourceDetail.title || resourceDetail.title === '') {
      return message.warn('标题不能为空！')
    }
    if(!resourceDetail.key || resourceDetail.key === '') {
      return message.warn('所属分类不能为空！')
    }
    if(!resourceDetail.size || resourceDetail.size < 0) {
      return message.warn('资源大小格式不正确！')
    }

    if(!resourceDetail.type || resourceDetail.type === '') {
      return message.warn('资源类型不能为空！')
    }
    if(!resourceDetail.downloadType || resourceDetail.downloadType === '') {
      return message.warn('下载模式不能为空！')
    }
    if(!resourceDetail.href || resourceDetail.href === '') {
      return message.warn('资源地址不能为空！')
    }
    if(!resourceDetail.date || resourceDetail.date === '') {
      return message.warn('发布日期不能为空！')
    }
    const requestParams = {
      title: resourceDetail.title,
      desc: resourceDetail.desc || '',
      key: resourceDetail.key,
      size: resourceDetail.size,
      type: resourceDetail.type,
      download: resourceDetail.download || 0,
      downloadType: resourceDetail.downloadType,
      href: resourceDetail.href,
      search: tagModel,
      tag: resourceDetail.tag,
      date: resourceDetail.date,
      remark: resourceDetail.remark,
      status: resourceDetail.status,
      order: resourceDetail.order,
    }
    if(isNew){
      apiResource.saveResource({content: requestParams}).then(()=>{
        message.success('保存成功')
        history.push({pathname: '/admin/web/resource/list'})
      })
    } else {
      apiResource.updateResource({id: resourceId, content: requestParams}).then(()=>{
        message.success('保存成功')
        history.push({pathname: '/admin/web/resource/list'})
      })
    }
    return  true
  }

  const handleAddItem = () => {
    if(addItem !== ''){
      message.warning('请先确认正在编辑中的内容！')
      return
    }
    setAddItem('tag')
  }


  const handleDeleteItem = (index) => {
    const target = resourceDetail.tag
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
    setResourceDetail({...resourceDetail, tag: target})
  }

  const addItemConfirm = () => {
    const target = resourceDetail.tag
    if(!editItem || editItem === ''){
      message.warning('内容不能为空！')
      return
    }
    target.push(editItem)
    setResourceDetail({...resourceDetail, tag: target})
    setEditItem('')
    setAddItem('')
  }

  return (
    <div className="resource-detail-container">
      <div className="resource-detail-wrap">
        <div className="resource-title">{ isEdit ? '资源编辑' : '新增资源'}</div>
        <div className="content-wrap">
          <div className="normal-cell FBH FBAC">
            <div className="cell-title">标题：</div>
            <Input
              className="normal-input w-600"
              placeholder="请输入标题"
              onChange={e =>{
                setResourceDetail({...resourceDetail, title: e.target.value})
              }}
              value={resourceDetail.title}
            />
          </div>
          <div className="normal-cell FBH">
            <div className="cell-title">描述：</div>
            <TextArea
              className="text-area w-600"
              placeholder="请输入描述（非必填）"
              onChange={e =>{
                setResourceDetail({...resourceDetail, desc: e.target.value})
              }}
              value={resourceDetail.desc}
            />
          </div>
          <div className="normal-cell FBH FBAC">
            <div className="cell-title">所属分类：</div>
            <Select
              value={resourceDetail.key}
              className="normal-select"
              loading={categorySelectLoading}
              onSelect={(e)=>{
                setResourceDetail({...resourceDetail, key: e})
              }}
            >
              {
                category.map(item=>{
                  return (
                    <Option key={item.key} value={item.key} disabled={ item.key === 'all'}>{item.name}</Option>
                  )
                })
              }
            </Select>
          </div>
          <div className="normal-cell FBH FBAC">
            <div className="cell-title">资源大小：</div>
            <Input
              className="normal-input"
              placeholder="请输入资源大小"
              onChange={e =>{
                setResourceDetail({...resourceDetail, size: e.target.value})
              }}
              value={resourceDetail.size}
            />
          </div>
          <div className="normal-cell FBH FBAC">
            <div className="cell-title">资源类型：</div>
            <Input
              className="normal-input"
              placeholder="请输入资源类型"
              onChange={e =>{
                setResourceDetail({...resourceDetail, type: e.target.value})
              }}
              value={resourceDetail.type}
            />
            <div className="prompt-text mar-l10">（请输入有效资源类型，如：pdf、mp4、ppt、excel）</div>
          </div>

          <div className="normal-cell FBH FBAC">
            <div className="cell-title">下载次数：</div>
            <Input
              className="normal-input"
              type="number"
              placeholder="请输入下载次数"
              onChange={e =>{
                setResourceDetail({...resourceDetail, download: e.target.value})
              }}
              value={resourceDetail.download}
            />
          </div>
          <div className="auto-cell">
            <div className="cell-title">资源地址：</div>
            <div className="FBV">
              <div className="FBH radio-wrap">
                <Radio.Group
                  onChange={(e)=>{
                    setRadioValue(e.target.value)
                  }}
                  value={radioValue}
                >
                  <Radio value="input">手动填写地址</Radio>
                  <Radio value="upload">使用上传地址</Radio>
                </Radio.Group>
              </div>
              <TextArea
                className="text-area"
                placeholder="请输入资源地址或手动上传资源"
                disabled={radioValue === 'upload'}
                onChange={e =>{
                  setResourceDetail({...resourceDetail, href: e.target.value})
                }}
                value={resourceDetail.href}
              />
              {
                radioValue === 'upload' ? (
                  <Upload
                    name={uploadConfig.name}
                    listType="picture-card"
                    className="uploader mar-t20"
                    showUploadList={false}
                    action={uploadConfig.url}
                    headers={uploadConfig.header}
                    data={getUploadBody}
                    onChange={handleChange}
                  >
                    { uploadButton }
                  </Upload>
                ) : null
              }
            </div>
          </div>
          <div className="normal-cell FBH FBAC">
            <div className="cell-title">下载模式：</div>
            <Radio.Group onChange={onRadioChange} value={resourceDetail.downloadType}>
              <Radio className="mar-l20" value="normal">normal(普通下载)</Radio>
              <Radio className="mar-l10" value="link">link(跳转到新页面手动下载)</Radio>
            </Radio.Group>
          </div>
          <div className="auto-cell">
            <div className="cell-title">标签：</div>
            <div className="FBV">
              {
                (resourceDetail.tag || []).map((item, index)=>{
                  return (
                    <div className="FBH" key={'tag' + index}>
                      <p className="column-tag">
                        {item}
                      </p>
                      <div className="delete-wrap mar-l20">
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
                        addItemConfirm()
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
          <div className="auto-cell">
            <div className="cell-title">搜索关键词：</div>
            <div className="FBH tags-wrap">
              <>
                <div style={{marginBottom: 16}}>
                  <TweenOneGroup
                    enter={{
                      scale: 0.8,
                      opacity: 0,
                      type: 'from',
                      duration: 100,
                    }}
                    onEnd={e => {
                      if (e.type === 'appear' || e.type === 'enter') {
                        e.target.style = 'display: inline-block';
                      }
                    }}
                    leave={{opacity: 0, width: 0, scale: 0, duration: 200}}
                    appear={false}
                  >
                    {tagChild}
                  </TweenOneGroup>
                </div>
                {tagEdit && (
                  <Input
                    ref={setTagInputRef}
                    type="text"
                    size="small"
                    className="site-tag-input"
                    value={tagNew}
                    placeholder="请输入新标签"
                    onChange={handleTagInputChange}
                    onBlur={()=>{
                      setTagEdit(false)
                      handleTagInputConfirm()
                    }}
                    onPressEnter={handleTagInputConfirm}
                  />
                )}
                {!tagEdit && (
                  <Tag onClick={showTagInput} className="site-tag-plus">
                    <PlusOutlined />
                    {' '}
                    添加搜索关键词
                  </Tag>
                )}
              </>
            </div>
          </div>
          <div className="normal-cell FBH FBAC">
            <div className="cell-title">发布日期：</div>
            <Input
              className="normal-input"
              value={resourceDetail.date}
            />
            <DatePicker
              placeholder="请输入发布日期"
              onChange={chooseDate}
              className="normal-date-picker"
            />
          </div>
          <div className="normal-cell FBH FBAC">
            <div className="cell-title">备注：</div>
            <Input
              className="normal-input"
              placeholder="请输入备注"
              onChange={e =>{
                setResourceDetail({...resourceDetail, remark: e.target.value})
              }}
              value={resourceDetail.remark}
            />
          </div>
          <div className="normal-cell FBH FBAC">
            <div className="cell-title" />
            <Button
              className="btn-primary"
              onClick={saveInfo}
              style={{width: '100px'}}
            >
              保存
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default withRouter(ResourceDetail)
