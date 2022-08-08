<template>
  <div>
    <NoteForm :showDialog="noteDialog" :noteId="note._id" v-on:hideDialog="noteDialog = false" v-if="noteDialog" />
    <NTDialog :showDialog="deleteDialog" :title="t('dialog.delete_title')" :description="t('dialog.delete_message')" v-on:hideDialog="deleteDialog = false" v-on:btn1Event="deleteNote(note)" v-if="deleteDialog" />
    <v-snackbar v-model="copySnackbar" :timeout="3000">{{ copySnackbarText }}
      <template v-slot:actions>
        <v-btn color="blue" @click="copySnackbar = false">{{ t('app.close') }}</v-btn>
      </template>
    </v-snackbar>
    <div style="margin-left:10px">
      <v-list-item :key="note.title">
        <v-list-item-title class="headline">{{ note.title }}</v-list-item-title>
        <v-spacer></v-spacer>
        <v-list-item-subtitle style="margin-right: 30px">{{ note.updatedDate.toLocaleString() }}</v-list-item-subtitle>
        <v-list-item-action style="margin-right: 10px">
          <v-btn icon="mdi-content-copy" @click="copy(note.content)">
          </v-btn>
        </v-list-item-action>
        <v-list-item-action style="margin-right: 10px">
          <v-btn icon="mdi-pencil" color="blue darken-2" style="color: white !important" @click="noteDialog = true">
          </v-btn>
        </v-list-item-action>
        <v-list-item-action>
          <v-btn icon="mdi-delete" color="red darken-1" style="color: white !important" @click="deleteDialog = true">
          </v-btn>
        </v-list-item-action>
      </v-list-item>
      <div class="note-categories">
        <v-chip-group :column="true" active-class="">
          <v-chip color="primary" text-color="white" v-for="(item, index) in note.categories" :key="index">{{ item }}</v-chip>
        </v-chip-group>
      </div>
      <div class="note-content">{{ note.content }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useStore } from '../store'
import NTDialog from "./NTDialog.vue"
import NoteForm from "./NoteForm.vue"
import { useClipboard } from '@vueuse/core'
import { Note } from '../models/Note'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const store = useStore()

const props = defineProps<{
  note: Note
}>()

const noteDialog = ref(false)
const deleteDialog = ref(false)
const copySnackbar = ref(false)
const copySnackbarText = ref('')

const { copy, copied } = useClipboard()

const deleteNote = (note: Note) => {
  store.dispatch('deleteNote', note)
}

watch(copied, async (val) => {
  if(val) {
    copySnackbarText.value = 'Copied!'
    copySnackbar.value  = true
  }
})

</script>

<style>
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
.v-list__item__sub-title, .v-list__item__title {
  overflow: visible;
}
</style>
