import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'
import { Category } from './models/Category'
import { Note } from './models/Note'
import dbCategories from './datastore-categories'
import dbNotes from './datastore-notes'

export interface State {
  isLoading: boolean,
  darkTheme: boolean,
  search: string,
  categories: Category[],
  categorySelected: string,
  notes: Note[]
}

export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  state: {
    isLoading: false,
    darkTheme: false,
    search: '',
    categories: [],
    categorySelected: 'all',
    notes: []
  },
  mutations: {
    LOAD_CATEGORIES(state, categories: Category[]) {
      state.categories = categories
    },
    ADD_CATEGORY(state, category: Category) {
      state.categories.push(category)
    },
    DELETE_CATEGORY(state, category: Category) {
      state.categories = state.categories.filter(n => n._id !== category._id)
    },
    SELECT_CATEGORY(state, category: string) {
      state.categorySelected = category
    },
    LOAD_NOTES(state, notes: Note[]) {
      state.notes = notes
    },
    ADD_NOTE(state, note: Note) {
      state.notes.push(note)
    },
    DELETE_NOTE(state, note: Note) {
      state.notes = state.notes.filter(n => n._id !== note._id)
    },
    THEME: (state, { theme }) => {
      state.darkTheme = theme
    },
    SEARCH: (state, { search }) => {
      state.search = search
    },
    LOADING(state, loading: boolean) {
      state.isLoading = loading
    }
  },
  actions: {
    loadCategories(store) {
      store.commit('LOADING', true)
      dbCategories.find({}, (err: Error, categories: Category[]) => {
        if (!err) {
          store.commit('LOAD_CATEGORIES', categories)
          store.commit('LOADING', false)
        }
        else {
          console.log(err)
        }
      })
    },
    addCategory(store, category: Category) {
      store.commit('LOADING', true)
      dbCategories.insert(category, (err, category) => {
        if (!err) {
          store.commit('ADD_CATEGORY', category)
          store.commit('LOADING', false)
        }
        else {
          console.log(err)
        }
      })
    },
    updateCategory(store, category: Category) {
      dbCategories.update({ _id: category._id }, category, {}, err => {
        if (!err) {
          store.dispatch('loadCategories')
        }
        else {
          console.log(err)
        }
      })
    },
    deleteCategory(store, category: Category) {
      store.commit('LOADING', true)
      dbCategories.remove({ _id: category._id }, {}, err => {
        if (!err) {
          store.commit('DELETE_CATEGORY', category)
          store.commit('LOADING', false)
        }
        else {
          console.log(err)
        }
      })
    },
    selectCategory(store, category: Category) {
      store.commit('SELECT_CATEGORY', category)
    },
    loadNotes(store) {
      store.commit('LOADING', true)
      dbNotes.find({}, (err: Error, notes: Note[]) => {
        if (!err) {
          store.commit('LOAD_NOTES', notes)
          store.commit('LOADING', false)
        }
        else {
          console.log(err)
        }
      })
    },
    addNote(store, note) {
      store.commit('LOADING', true)
      dbNotes.insert(note, (err, note) => {
        if (!err) {
          store.commit('ADD_NOTE', note)
          store.commit('LOADING', false)
        }
        else {
          console.log(err)
        }
      })
    },
    updateNote(store, note) {
      dbNotes.update({ _id: note._id }, note, {}, err => {
        if (!err) {
          store.dispatch('loadNotes')
        }
        else {
          console.log(err)
        }
      })
    },
    deleteNote(store, note) {
      store.commit('LOADING', true)
      dbNotes.remove({ _id: note._id }, {}, err => {
        if (!err) {
          store.commit('DELETE_NOTE', note)
          store.commit('LOADING', false)
        }
        else {
          console.log(err)
        }
      })
    },
    THEME: ({ commit }, { theme }) => {
      return new Promise(resolve => {
        commit('THEME', { theme })
        resolve(true)
      })
    },
    SEARCH: ({ commit }, { search }) => {
      return new Promise(resolve => {
        commit('SEARCH', { search })
        resolve(true)
      })
    }
  },
  getters: {
    categories: state => state.categories,
    categoryById: state => (id: string) => state.categories.find(category => category._id === id),
    categorySelected: state => state.categorySelected,
    isLoading: state => state.isLoading,
    darkTheme: state => state.darkTheme,
    search: state => state.search,
    notes: state => state.notes,
    noteById: state => (id: string) => state.notes.find(note => note._id === id)
  }
})

export function useStore () {
  return baseUseStore(key)
}