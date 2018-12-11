// components/search/index.js
import {
  getHistorySearch,
  addHistorySearch
} from "../../models/keyword.js"

import {
  search
} from "../../models/new.js"

import {
  paginationBeh
} from '../behaviors/pagination.js'

Component({
  behaviors: [paginationBeh],

  /**
   * 组件的属性列表
   */
  properties: {
    more: {
      type: String,
      observer: '_loadMore'
    },
    placeholder: {
      type: String,
      value: '请输入内容'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    history_search: [],
    searching: false,
    inputValue: '',
    loading_center: false
  },

  attached() {
    const history_search = getHistorySearch()
    this.setData({
      history_search
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _loadMore() {
      const text = this.data.inputValue
      if (!text || this.getLoading()) {
        return
      }

      if (!this.hasMoreData()) {
        wx.showToast({
          title: '没有数据啦',
          icon: 'none'
        })
        return
      }

      this.setLoading(true)
      search(text, this.getNextPage(), this.getPageSize()).then(res => {
        // console.log(res)
        this.setMoreData(res.results)
        this.setLoading(false)
      }).catch(error => {
        this.setLoading(false)
      })
    },

    onSearch(e) {
      this._showLoadingCenter()
      const text = e.detail.value || e.detail.text
      addHistorySearch(text)
      const history_search = getHistorySearch()
      this.setData({
        history_search,
        searching: true,
        inputValue: text
      })

      search(text, 1, this.getPageSize()).then(res => {
        // console.log(res)
        this.setMoreData(res.results)
        this.setTotal(res.count)
        this._hideLoadingCenter()
      }).catch(error => {
        this._hideLoadingCenter()
      })
    },

    onClear() {
      this.reset()
      this.setData({
        searching: false,
        inputValue: ''
      })
    },

    onCancel() {
      this.triggerEvent("cancel", {}, {})
    },

    _showLoadingCenter() {
      this.setData({
        loading_center: true
      })
    },
    
    _hideLoadingCenter() {
      this.setData({
        loading_center: false
      })
    }
  }
})