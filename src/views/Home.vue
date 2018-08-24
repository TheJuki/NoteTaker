<template lang="pug">
  div(:class="{ 'reduce-view': (notesFiltered.length == 0 || isLoading) }" )
    note-form(:showDialog="noteDialog" v-on:hideDialog="noteDialog = false" v-if="noteDialog")
    v-layout.notes-layout(row)
      v-flex(xs12)
        v-card(v-if="notesFiltered.length > 0 && !isLoading")
          v-list(two-line)
            div(v-for='(item, index) in notesFiltered')
              note(:note='item')
              v-divider(v-if='index + 1 < notesFiltered.length' :key='index')
    v-container(fluid fill-height)
      v-layout(align-center justify-center)
        div(v-if="isLoading")
          v-progress-circular(:size="50" indeterminate color="primary")
          span.title(style="margin-left: 20px") {{ $t('app.loading') }}
        div(v-if="notesFiltered.length === 0 && !search && !isLoading")
          span {{ $t('app.nothing') }}
          v-btn(dark color="green" @click='noteDialog = true')
            | {{ $t('app.add_note') }}
        div(v-if="notesFiltered.length === 0 && search && !isLoading")
          h1 {{ $t('app.no_note_found') }}
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import Note from "../components/Note.vue"
import NoteForm from "../components/NoteForm.vue"

export default {
  components: {
    Note,
    NoteForm
  },
  data: () => ({
    noteDialog: false
  }),
  methods: {
    ...mapActions(["loadNotes"])
  },
  computed: {
    ...mapGetters(["notes", "categorySelected", "isLoading", "search"]),
    notesFiltered() {
      let safeSearch = this.search
      if (safeSearch == null) {
        safeSearch = ""
      }
      safeSearch = safeSearch.trim()
      const notesFiltered = this.notes.filter(item =>
        safeSearch
          .split(" ")
          .every(
            el =>
              item.title.toLowerCase().indexOf(el.toLowerCase()) > -1 ||
              item.content.toLowerCase().indexOf(el.toLowerCase()) > -1
          )
      )

      if (this.categorySelected !== "all") {
        const notesFilteredByCategory = []
        notesFiltered.forEach(note => {
          if (note.categories != null && note.categories.includes(this.categorySelected)) {
            notesFilteredByCategory.push(note)
          }
        })
        return notesFilteredByCategory
      }

      return notesFiltered
    }
  },
  beforeRouteEnter(route, redirect, next) {
    next(vm => {
      vm.loadNotes()
    })
  }
}
</script>

<style lang="stylus">
.reduce-view {
  height: 70vh
}

.notes-layout {
  margin-top: 20px
}

.note-divider {
  border-width: thick 0 0
}
</style>
