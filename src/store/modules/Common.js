const state = {
  isLoading: false,
  darkTheme: false,
  search: ''
}

const mutations = {
  THEME: (state, { theme }) => {
    state.darkTheme = theme
  },
  SEARCH: (state, { search }) => {
    state.search = search
  },
  LOADING(state, loading) {
    state.isLoading = loading
  }
}

const actions = {
  THEME: ({ commit }, { theme }) => {
    return new Promise(resolve => {
      commit('THEME', { theme })
      resolve()
    })
  },
  SEARCH: ({ commit }, { search }) => {
    return new Promise(resolve => {
      commit('SEARCH', { search })
      resolve()
    })
  }
}

const getters = {
  isLoading: state => state.isLoading,
  darkTheme: state => state.darkTheme,
  search: state => state.search
}

export default {
  state,
  mutations,
  actions,
  getters
}
