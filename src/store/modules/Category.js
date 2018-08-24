import db from '@/datastore-categories'

const state = {
  categories: [],
  categorySelected: 'all'
}

const mutations = {
  LOAD_CATEGORIES(state, categories) {
    state.categories = categories
  },
  ADD_CATEGORY(state, category) {
    state.categories.push(category)
  },
  DELETE_CATEGORY(state, category) {
    state.categories = state.categories.filter(n => n._id !== category._id)
  },
  SELECT_CATEGORY(state, category) {
    state.categorySelected = category
  }
}

const actions = {
  loadCategories(store) {
    store.commit('LOADING', true)
    db.find({}, (err, categories) => {
      if (!err) {
        store.commit('LOAD_CATEGORIES', categories)
        store.commit('LOADING', false)
      }
    })
  },
  addCategory(store, category) {
    store.commit('LOADING', true)
    db.insert(category, (err, category) => {
      if (!err) {
        store.commit('ADD_CATEGORY', category)
        store.commit('LOADING', false)
      }
    })
  },
  updateCategory(store, category) {
    db.update({ _id: category._id }, category, {}, err => {
      if (!err) {
        store.dispatch('loadCategories')
      }
    })
  },
  deleteCategory(store, category) {
    store.commit('LOADING', true)
    db.remove({ _id: category._id }, {}, err => {
      if (!err) {
        store.commit('DELETE_CATEGORY', category)
        store.commit('LOADING', false)
      }
    })
  },
  selectCategory(store, category) {
    store.commit('SELECT_CATEGORY', category)
  }
}

const getters = {
  categories: state => state.categories,
  categoryById: state => id => state.categories.find(category => category._id === id),
  categorySelected: state => state.categorySelected
}

export default {
  state,
  mutations,
  actions,
  getters
}
