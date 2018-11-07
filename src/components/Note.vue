<template lang="pug">
  div
    note-form(:showDialog="noteDialog" :noteId='note._id' v-on:hideDialog="noteDialog = false" v-if="noteDialog")
    nt-dialog(:showDialog="deleteDialog" :title="$t('dialog.delete_title')" :description="$t('dialog.delete_message')" v-on:hideDialog="deleteDialog = false" v-on:btn1Event="deleteNote(note)" v-if="deleteDialog")
    v-snackbar(v-model='copySnackbar' bottom :timeout="3000")
      | {{ copySnackbarText }}
      v-btn(color='blue' flat @click='copySnackbar = false')
        | {{ $t('app.close') }}
    div
      v-list-tile(:key='note.title' avatar)
        v-list-tile-content
          v-list-tile-title.headline {{ note.title }}
          v-list-tile-sub-title(style="margin-top: 10px") {{ note.updatedDate.toLocaleString() }}
        v-list-tile-action
          v-btn(flat icon @click='copy')
            v-icon content_copy
        v-list-tile-action
          v-btn(flat icon color='blue darken-2' @click='noteDialog = true')
            v-icon edit
        v-list-tile-action
          v-btn(flat icon color='red darken-1' @click='deleteDialog = true')
            v-icon delete
      div
      div.note-categories
        v-chip(color='primary' text-color='white' v-for='(item, index) in note.categories' :key='index') {{ item }}
      div.note-content {{ note.content }}
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import NTDialog from "./NTDialog.vue"
import NoteForm from "./NoteForm.vue"

export default {
  components: {
    "nt-dialog": NTDialog,
    NoteForm
  },
  props: {
    note: {
      type: Object,
      default: null
    }
  },
  data: function() {
    return {
      noteDialog: false,
      deleteDialog: false,
      copySnackbar: false,
      copySnackbarText: ''
    }
  },
  mounted() {},
  computed: {
    ...mapGetters(['notes'])
  },
  methods: {
    ...mapActions(["deleteNote"]),
    copy() {
      this.$copyText(this.note.content).then(
        () => {
          this.copySnackbarText = 'Copied!'
          this.copySnackbar = true
        },
        () => {
          this.copySnackbarText = 'Copy Failed'
          this.copySnackbar = true
        }
      )
    }
  }
}
</script>

<style lang="stylus">
.note-content {
  white-space: pre-wrap;
  max-height: 100px;
  overflow-y: auto;
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 20px;
}
.note-categories {
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 20px;
  display: inline-block;
}
.v-list__tile__sub-title, .v-list__tile__title {
  overflow: visible;
}
</style>
