import React , {useState, useEffect} from "react";
import {Tag, Input, Button, message, Upload, DatePicker, Switch, Select} from 'antd'
import apiNews from '@api/news'
import helper from '@helper'
import utils from "@common/utils"
import "./index.styl";
import {withRouter} from "react-router-dom";
import RichTextEditor from 'wangeditor'
import alertMenu from '@components/editor/image-uploader'

import {LoadingOutlined, PlusOutlined} from "@ant-design/icons";
import {TweenOneGroup} from "rc-tween-one";

const {TextArea} = Input
const {Option} = Select

const ViewModule = (props) => {
  const {location, history} = props
  // 是否是编辑状态
  const newsId =  location.state && location.state.id
  const isNew = (newsId === null || newsId === undefined)

  const [newsDetail, setNewsDetail] = useState({})
  const [uploadLoading, setupLoadLoading] = useState(false)
  const [htmlValue, setHtmlValue] = useState('')
  const [categories, setCategories] = useState([])
  const [categorySelectLoading, setCategorySelectLoading] = useState(true)
  const [tagModel, setTagModel] = useState([])
  const [tagEdit, setTagEdit] = useState(false)
  const [tagNew, setTagNew] = useState('')

  const [searchModel, setSearchModel] = useState([])
  const [searchEdit, setSearchEdit] = useState(false)
  const [searchNew, setSearchNew] = useState('')

  // 这个不要用ref， 因为input 节点尚未渲染。
  const [tagInputRef, setTagInputRef] = useState(null)
  const [searchInputRef, setSearchInputRef] = useState(null)

  let editor
  const uploadConfig = {
    header: {
      authorization: helper.getToken(),
    },
    name: 'newsCover',
    url: '/admin/api/uploadV2/auth',
    body: {
      name: 'newsCover',
      dir: 'news/cover/' + utils.getDateDir(new Date()),
      overwrite: 'Y',
    },
  }

  const getDetail = () => {
    apiNews.getNewsDetail({id: newsId}).then(data=>{
      if(!data){
        return
      }
      setNewsDetail(data)
      setTagModel(data.tag ? data.tag : [])
      setSearchModel(data.search ? data.search : [])
      editor.txt.html(data.body);
    })
  }

  const getCategory = () => {
    apiNews.getNewsCategoryOnline().then(data=>{
      if(!data){
        return
      }
      setCategories(data)
      setCategorySelectLoading(false)
    })
  }

  const initEditor = ()=> {
    // 初始化编辑器
    const menuKey = 'alertMenuKey'
    RichTextEditor.registerMenu(menuKey, alertMenu)
    editor = new RichTextEditor("#dteditor")
    editor.config.uploadImgServer = '/admin/api/multiUpload/auth'
    editor.config.uploadFileName = 'newsContent'
    // 一次最多上传5张
    editor.config.uploadImgMaxLength = 5
    // 上传超时设置为 `
    editor.config.uploadImgTimeout = 30 * 1000
    // 图片最大为2M, 超过2M自行压缩
    editor.config.uploadImgMaxSize = 2 * 1024 * 1024 // 2M
    // 请求体参数
    editor.config.uploadImgParams = {
      name: 'newsContent',
      dir: `news/body/${   utils.getDateDir(new Date())}`,
      overwrite: 'Y', // 是否开同名覆盖
      type: 'wange',
    }
    editor.config.uploadImgHeaders = {
      authorization: helper.getToken(),
    }
    editor.config.onchange = (newHtml) => {
      setHtmlValue(newHtml)
    }

    // 需要展示的菜单
    editor.config.menus = [
      'alertMenuKey',
      'head',
      'bold',
      'fontSize',
      'fontName',
      'italic',
      'underline',
      'strikeThrough',
      'indent',
      'lineHeight',
      'foreColor',
      'backColor',
      'link',
      'list',
      'todo',
      'justify',
      'quote',
      'table',
      'splitLine',
      'image',
      'video',
      'undo',
      'redo',
    ]
    editor.create()
  }

  useEffect(() => {
    if (editor) {
      editor.txt.html(htmlValue);
    }
  }, [htmlValue])

  // 监听input被挂载，然后自动焦点
  useEffect(()=>{
    if(tagEdit && tagInputRef){
      tagInputRef.focus()
    }
  },[tagInputRef])

  // 监听input被挂载，然后自动焦点
  useEffect(()=>{
    if(searchEdit && searchInputRef){
      searchInputRef.focus()
    }
  },[searchInputRef])

  useEffect(()=>{
    if(isNew){
      setNewsDetail({
        title: '',
        summary: '',
        date: '',
        cover: null,
        description: '',
        keywords: '',
        type: '',
        isTop: 0,
        isHot: 0,
        isRecommend: 0,
        order: 1,
        status: 1,
        body: '',
        tag: [],
        search: [],
      })
      getCategory()
    } else {
      getDetail()
      getCategory()
    }

    initEditor()
    return () => {
      // 组件销毁时销毁编辑器 注：class写法需要在componentWillUnmount中调用
      editor.destroy()
    }
  },[])

  const uploadButton = (
    <div>
      {uploadLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div>上传主图</div>
    </div>
  );

  const beforeUpload = (file) => {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('上传的资源大小不能超过2MB!');
    }
    return isLt2M
  }

  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setupLoadLoading(true)
      return;
    }
    if (info.file.status === 'done') {
      if(info.file && info.file.response){
        setupLoadLoading(false)
        const result = info.file.response
        if(result.success){
          message.success('上传成功！')
          setNewsDetail({...newsDetail, cover: result.data})
        } else {
          message.error(`上传失败：${  result.errorMessage}`)
        }
      }
    }
  }

  const getUploadBody = () => {
    return {
      name: uploadConfig.body.name,
      overwrite: uploadConfig.body.overwrite,
      dir: uploadConfig.body.dir,
    }
  }

  const removeCell = (value, key) => {
    if(key === 'tag'){
      setTagModel(tagModel.filter(tag => tag !== value))
    }

    if(key === 'search'){
      setSearchModel(searchModel.filter(search => search !== value))
    }
  };

  const tagChild = tagModel.map(tag=>{
    const tagElem = (
      <Tag
        closable
        className="key-tags"
        onClose={e => {
          e.preventDefault();
          removeCell(tag, 'tag');
        }}
      >
        {tag}
      </Tag>
    );
    return (
      <span key={tag} style={{display: 'inline-block'}}>{tagElem}</span>
    );
  })

  const searchChild = searchModel.map(tag=>{
    const tagElem = (
      <Tag
        closable
        className="key-search"
        onClose={e => {
          e.preventDefault();
          removeCell(tag, 'search');
        }}
      >
        {tag}
      </Tag>
    );
    return (
      <span key={tag} style={{display: 'inline-block'}}>{tagElem}</span>
    );
  })

  const handleTagConfirm = (key) => {

    if(key === 'tag'){
      if(tagNew && tagModel.indexOf(tagNew) === -1){
        setTagModel([...tagModel, tagNew])
      } else {
        message.warning('标签已存在！')
      }
      setTagEdit(false)
      setTagNew('')
    } else if (key === 'search'){
      if(searchNew && searchModel.indexOf(searchNew) === -1){
        setSearchModel([...searchModel, searchNew])
      } else {
        message.warning('标签已存在！')
      }
      setSearchEdit(false)
      setSearchNew('')
    }

  }

  const showTagInput = (key) => {
    if(key === 'tag'){
      setTagEdit(true)
    } else if (key === 'search'){
      setSearchEdit(true)
    }
  }

  const handleTagInputChange = (e) =>{
    setTagNew(e.target.value)
  }
  const handleSearchInputChange = (e) =>{
    setSearchNew(e.target.value)
  }

  const saveInfo = () => {
    if(!newsDetail.title || newsDetail.title === ''){
      message.warning('标题不能为空')
      return
    }
    if(!newsDetail.summary || newsDetail.summary === ''){
      message.warning('摘要不能为空')
      return
    }
    if(!newsDetail.date || newsDetail.date === ''){
      message.warning('发布日期不能为空')
      return
    }
    if(!newsDetail.type || newsDetail.type === ''){
      message.warning('新闻分类不能为空')
      return
    }
    if(!newsDetail.author || newsDetail.author === ''){
      message.warning('作者来源日期不能为空')
      return
    }
    if(!htmlValue || htmlValue === ''){
      message.warning('文章内容不能为空')
      return
    }
    if(!newsDetail.description || newsDetail.description === ''){
      message.warning('tdk-描述不能为空')
      return
    }
    if(!newsDetail.keywords || newsDetail.keywords === ''){
      message.warning('tdk-关键字不能为空')
      return
    }
    const p = {
      title: newsDetail.title,
      summary: newsDetail.summary,
      date: newsDetail.date,
      cover: newsDetail.cover,
      author: newsDetail.author,
      description: newsDetail.description,
      keywords: newsDetail.keywords,
      type: newsDetail.type,
      tag: tagModel,
      search: searchModel,
      body: htmlValue,
      order: newsDetail.order,
      isTop: newsDetail.isTop,
      isRecommend: newsDetail.isRecommend,
      isHot: newsDetail.isHot,
    }
    if(isNew){
      apiNews.saveNews({content: {...p, status: 1}}).then( ()=>{
        message.success('保存成功！')
        history.push('/admin/web/news/list')
      })
    } else {
      apiNews.updateNews({id: newsId, content: {...p, status: newsDetail.status}}).then( ()=>{
        message.success('保存成功！')
        history.push('/admin/web/news/list')
      })
    }
  }

  return (
    <div className="news-detail-container">
      <div className="module-view-wrap news-detail-wrap">
        <div className="module-title mar-20">{isNew ? '新建新闻' : '编辑新闻'}</div>
        <div className="content-wrap">
          <div className="normal-cell">
            <div className="cell-title">标题：</div>
            <Input
              className="normal-input w-600"
              placeholder="请输入标题"
              onChange={e =>{
                setNewsDetail({...newsDetail, title: e.target.value})
              }}
              value={newsDetail.title}
            />
          </div>
          <div className="auto-cell">
            <div className="cell-title">摘要：</div>
            <TextArea
              className="textarea w-600"
              placeholder="请输入摘要"
              onChange={e =>{
                setNewsDetail({...newsDetail, summary: e.target.value})
              }}
              value={newsDetail.summary}
            />
          </div>
          <div className="normal-cell">
            <div className="cell-title">发布时间：</div>
            <Input
              className="normal-input mar-r20"
              value={newsDetail.date}
            />
            <DatePicker
              placeholder="请输入发布日期"
              onChange={(e,d)=>{
                setNewsDetail({...newsDetail, date: d})
              }}
              className="normal-data-picker"
            />
          </div>
          <div className="normal-cell">
            <div className="cell-title">分类：</div>
            <Select
              className="normal-select"
              value={newsDetail.type}
              loading={categorySelectLoading}
              onChange={
                (e)=>{
                  setNewsDetail({...newsDetail, type: e})
                }
              }
            >
              {
                categories.map(item=>{
                  return (
                    <Option key={item.key} value={item.key} disabled={item.key === 'all'}>{item.name}</Option>
                  )
                })
              }

            </Select>
          </div>
          <div className="auto-cell">
            <div className="cell-title">主图：</div>
            <div className="FBH">
              {
                newsDetail.cover ? (
                  <img src={utils.getFixUrl(newsDetail.cover)} className="thumb-img-wrap" alt="" />
                ) : <div className="thumb-img-wrap">主图缺失</div>
              }
              <div>
                <Upload
                  name={uploadConfig.name}
                  listType="picture-card"
                  className="uploader mar-l20"
                  showUploadList={false}
                  action={uploadConfig.url}
                  headers={uploadConfig.header}
                  data={getUploadBody()}
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                >
                  { uploadButton }
                </Upload>
              </div>
            </div>
          </div>
          <div className="normal-cell">
            <div className="cell-title">作者（来源）：</div>
            <Input
              className="normal-input"
              placeholder="请输入来源作者"
              onChange={e =>{
                setNewsDetail({...newsDetail, author: e.target.value})
              }}
              value={newsDetail.author}
            />
          </div>
          <div className="auto-cell">
            <div className="cell-title">内容：</div>
            <div className="editor-wrap">
              <div id="dteditor" className="editor-main" />
            </div>
          </div>
          <div className="auto-cell">
            <div className="cell-title">tdk-描述：</div>
            <TextArea
              className="textarea w-600 h-120"
              placeholder="请输入tdk title"
              onChange={e =>{
                setNewsDetail({...newsDetail, description: e.target.value})
              }}
              value={newsDetail.description}
            />
          </div>
          <div className="normal-cell">
            <div className="cell-title">tdk-关键字：</div>
            <Input
              className="normal-input w-600"
              placeholder="请输入title关键字，以英文','隔开"
              onChange={e =>{
                setNewsDetail({...newsDetail, keywords: e.target.value})
              }}
              value={newsDetail.keywords}
            />
            <div className="prompt-text mar-l20">(注：多个tdk关键字必须以英文逗号隔开！)</div>
          </div>
          <div className="auto-cell">
            <div className="cell-title">标签：</div>
            <div>
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
                </>
              </div>
              <div className="FBH">
                {tagEdit && (
                  <div className="FBH">
                    <Input
                      ref={setTagInputRef}
                      type="text"
                      size="small"
                      className="site-tag-input"
                      value={tagNew}
                      placeholder="请输入新标签"
                      onChange={handleTagInputChange}
                      onPressEnter={()=>{handleTagConfirm('tag')}}
                    />
                    <Button className="btn-primary mar-l20" onClick={()=>{handleTagConfirm('tag')}}>确认</Button>
                  </div>
                )}
                {!tagEdit && (
                  <Tag onClick={()=>{showTagInput('tag')}} className="site-tag-plus">
                    <PlusOutlined />
                    {' '}
                    添加标签key
                  </Tag>
                )}
              </div>
            </div>
          </div>
          <div className="auto-cell">
            <div className="cell-title">关键词：</div>
            <div>
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
                      {searchChild}
                    </TweenOneGroup>
                  </div>
                </>
              </div>
              <div className="FBH">
                {searchEdit && (
                  <div className="FBH">
                    <Input
                      ref={setSearchInputRef}
                      type="text"
                      size="small"
                      className="site-tag-input"
                      value={searchNew}
                      placeholder="请输入新标签"
                      onChange={handleSearchInputChange}
                      onPressEnter={()=>{handleTagConfirm('search')}}
                    />
                    <Button className="btn-primary mar-l20" onClick={()=>{handleTagConfirm('search')}}>确认</Button>
                  </div>
                )}
                {!searchEdit && (
                  <Tag onClick={()=>{showTagInput('search')}} className="site-tag-plus">
                    <PlusOutlined />
                    {' '}
                    添加关键词
                  </Tag>
                )}
              </div>
            </div>
          </div>
          <div className="normal-cell">
            <div className="cell-title">排序：</div>
            <Input
              className="normal-input"
              placeholder="请输入序号"
              type="number"
              style={{width: '120px'}}
              onChange={e =>{
                setNewsDetail({...newsDetail, order: e.target.value})
              }}
              value={newsDetail.order}
            />
          </div>
          <div className="normal-cell">
            <div className="cell-title">是否置顶：</div>
            <Switch
              checked={newsDetail.isTop}
              onChange={(e)=>{
                setNewsDetail({...newsDetail, isTop: e ? 1 : 0})
              }}
            />
          </div>
          <div className="normal-cell">
            <div className="cell-title">是否设置热门：</div>
            <Switch
              checked={newsDetail.isHot}
              onChange={(e)=>{
                setNewsDetail({...newsDetail, isHot: e ? 1 : 0})
              }}
            />
          </div>
          <div className="normal-cell">
            <div className="cell-title">是否设置推荐：</div>
            <Switch
              checked={newsDetail.isRecommend}
              onChange={(e)=>{
                setNewsDetail({...newsDetail, isRecommend: e ? 1 : 0})
              }}
            />
          </div>
          <div className="normal-cell">
            <div className="cell-title" />
            <Button className="btn-primary" style={{width: '100px'}} onClick={saveInfo}>保存</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default withRouter(ViewModule)
