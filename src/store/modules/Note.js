import db from '@/datastore-notes'

const state = {
  notes: []
}

const mutations = {
  LOAD_NOTES(state, notes) {
    state.notes = notes
  },
  ADD_NOTE(state, note) {
    state.notes.push(note)
  },
  DELETE_NOTE(state, note) {
    state.notes = state.notes.filter(n => n._id !== note._id)
  }
}

const actions = {
  loadNotes(store) {
    store.commit('LOADING', true)
    db.find({}, (err, notes) => {
      if (!err) {
        store.commit('LOAD_NOTES', notes)
        store.commit('LOADING', false)
      }
    })
  },
  addNote(store, note) {
    store.commit('LOADING', true)
    db.insert(note, (err, note) => {
      if (!err) {
        store.commit('ADD_NOTE', note)
        store.commit('LOADING', false)
      }
    })
  },
  updateNote(store, note) {
    db.update({ _id: note._id }, note, {}, err => {
      if (!err) {
        store.dispatch('loadNotes')
      }
    })
  },
  deleteNote(store, note) {
    store.commit('LOADING', true)
    db.remove({ _id: note._id }, {}, err => {
      if (!err) {
        store.commit('DELETE_NOTE', note)
        store.commit('LOADING', false)
      }
    })
  }
}

const getters = {
  notes: state => state.notes,
  noteById: state => id => state.notes.find(note => note._id === id)
}

export default {
  state,
  mutations,
  actions,
  getters
}
