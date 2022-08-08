<template>
  <div :class="{ 'reduce-view': (notesFiltered.length == 0 || isLoading) }">
    <NoteForm :noteId="undefined" :showDialog="noteDialog" v-on:hideDialog="noteDialog = false" v-if="noteDialog"></NoteForm>
    <v-layout class="notes-layout">
      <v-row>
        <v-col cols="12">
          <v-card v-if="notesFiltered.length > 0 && !isLoading">
            <v-list two-line="two-line">
              <div v-for="(item, index) in notesFiltered">
                <note-element :note="item"></note-element>
                <v-divider v-if="(index + 1) < notesFiltered.length" :key="index"></v-divider>
              </div>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </v-layout>
    <v-container>
        <v-row>
          <v-spacer></v-spacer>
          <v-col align-self="center">
            <div v-if="isLoading">
            <v-progress-circular :size="50" :indeterminate="true" color="primary"></v-progress-circular><span class="title" style="margin-left: 20px">{{ t('app.loading') }}</span>
            </div>
            <div v-if="notesFiltered.length === 0 && !search && !isLoading"><span>{{ t('app.nothing') }}</span>
              <v-btn color="green" style="color: white !important" @click="noteDialog = true">{{ t('app.add_note') }}</v-btn>
            </div>
            <div v-if="notesFiltered.length === 0 && search && !isLoading">
              <h1>{{ t('app.no_note_found') }}</h1>
            </div>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeMount } from 'vue'
import { useStore } from '../store'

import NoteElement from "../components/Note.vue"
import NoteForm from "../components/NoteForm.vue"
import { Note } from '../models/Note'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const store = useStore()

const noteDialog = ref(false)

onBeforeMount(() => {
  store.dispatch('loadNotes')
})

const isLoading = computed(() => {
  return store.state.isLoading
})

const search = computed(() => {
  return store.state.search
})

const notesFiltered = computed(() => {
  let safeSearch = store.getters.search
  if (safeSearch == null) {
    safeSearch = ""
  }
  safeSearch = safeSearch.trim()
  const notesFilteredInner = store.getters.notes.filter((item: Note) =>
    safeSearch
      .split(" ")
      .every(
        (el: string) =>
          item.title.toLowerCase().indexOf(el.toLowerCase()) > -1 ||
          item.content.toLowerCase().indexOf(el.toLowerCase()) > -1
      )
  )

  if (store.getters.categorySelected !== "all") {
    const notesFilteredByCategory: Note[] = []
    notesFilteredInner.forEach((note: Note) => {
      if (note.categories != null && note.categories.includes(store.getters.categorySelected)) {
        notesFilteredByCategory.push(note)
      }
    })
    return notesFilteredByCategory
  }

  return notesFilteredInner
})
</script>

<style>
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
