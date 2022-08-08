<template>
  <v-app :dark="darkTheme">
    <CategoryForm :showDialog="categoryDialog" v-on:hideDialog="categoryDialog = false" :categoryId="categoryId" v-if="categoryDialog"></CategoryForm>
    <NoteForm :noteId="undefined" :showDialog="noteDialog" v-on:hideDialog="noteDialog = false" v-if="noteDialog"></NoteForm>
    <v-navigation-drawer fixed="fixed" app="app" v-model="drawer">
      <v-list dense="dense">
        <template v-for="item in drawerItems" :key="item.text">
          <v-list-group v-if="item.children" >
            <template v-slot:activator>
              <v-list-item :title="item.text"></v-list-item>
            </template>
          </v-list-group>
          <v-list-item v-if="item.children" v-for="(category, i) in categoriesSorted" :key="i" @click="selectCategoryDrawer(category.name)" :class="{ active: categorySelected === category.name }">
            <v-list-item-action>
              <v-icon :class="{ active: categorySelected === category.name }" icon="mdi-dashboard"></v-icon>
            </v-list-item-action>
            <v-list-item-title>{{ category.name }}</v-list-item-title>
            <v-spacer></v-spacer>
            <v-list-item-action>
              <v-btn icon style="color: white !important" color="grey">
                <v-icon icon="mdi-menu"></v-icon>
                <v-menu activator="parent">
                  <v-list>
                    <v-list-item @click="categoryId = category._id; categoryDialog = true">
                      <v-list-item-title>{{ t('app.edit') }}</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="deleteCategory(category)">
                      <v-list-item-title>{{ t('app.delete') }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
          <v-list-item v-else @click="selectCategoryDrawer('all')" :class="{ active: categorySelected === 'all' }">
            <v-list-item-action>
              <v-icon :class="{ active: categorySelected === 'all' }" icon="mdi-all-inclusive"></v-icon>
            </v-list-item-action>
            <v-list-item-title>All</v-list-item-title>
            <v-spacer></v-spacer>
            <v-list-item-action>
              <v-btn icon="mdi-plus" color="primary" @click.stop="categoryId = undefined; categoryDialog = true">
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar class="top-app-bar" color="blue darken-3">
      <v-app-bar-nav-icon style="color: white" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="ml-0 pl-3" style="width: 200px; color: white"><img class="logo" src="./assets/logo.svg" alt="logo"/><span style="cursor: default">{{ t('app.title') }}</span></v-toolbar-title>
      <v-text-field color="primary" style="color: white" :hide-details="true" prepend-inner-icon="mdi-search" v-focus ref="search" v-model="searchNotes" :label="t('general.search')" :clearable="true"></v-text-field>
      <v-btn icon="mdi-plus" color="primary" variant="flat" style="margin-left:10px" @click="noteDialog = true"></v-btn>
    </v-app-bar>
    <v-main>
      <Home></Home>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, VueElement } from 'vue'
import { useStore } from './store'
import { useMagicKeys } from '@vueuse/core'
import DrawerItemsConfig from './drawerItems.json'
import CategoryForm from "./components/CategoryForm.vue"
import NoteForm from "./components/NoteForm.vue"
import { Category } from './models/Category'
import Home from './components/Home.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const store = useStore()

const keys = useMagicKeys()
const ctrlF = keys['Ctrl+F']

const drawerItems = computed(() => {
  return DrawerItemsConfig;
})

const darkTheme = computed(() => {
  return store.state.darkTheme;
})

const categorySelected = computed(() => {
  return store.state.categorySelected;
})

const search = ref<VueElement>()
const darkThemeToggle = ref(false)
const drawer = ref(false)
const categoryDialog = ref(false)
const categoryId = ref<string | undefined>(undefined)
const searchNotes = ref('')
const noteDialog = ref(false)

const vFocus = {
  mounted: (el: VueElement) => el.focus()
}

onMounted(() => {
  store.dispatch('loadCategories')
  if(localStorage.getItem('darkTheme'))
  {
    store.dispatch('THEME', { theme: localStorage.getItem('darkTheme') === 'true' })
      .then(() => {
        darkThemeToggle.value = store.state.darkTheme
    })
  }
})

const selectCategoryDrawer = (category: string) => {
  store.dispatch('selectCategory', category)
}

const deleteCategory = (category: Category) => {
  store.dispatch('deleteCategory', category)
}

const categories = computed(() => {
  return store.state.categories;
})

const categoriesSorted = computed(() => {
  let safeCategories: Category[] = []
  if(categories.value != null) {
    safeCategories = categories.value
  }
  return safeCategories.slice().sort(function(a, b) {
    const nameA = a.name.toUpperCase()
    const nameB = b.name.toUpperCase()
    if (nameA < nameB) {
      return -1
    }
    if (nameA > nameB) {
      return 1
    }
    return 0
  })
})

watch(ctrlF, (val) => {
  if (val && search.value) {
    search.value.focus()
  }
})

watch(darkThemeToggle, async (val, _) => {
  localStorage.setItem('darkTheme', val.toString())
  store.dispatch('THEME', { theme: val })
})

watch(searchNotes, async (val, _) => {
  store.dispatch('SEARCH', { search: val })
})
  
</script>

<style>
.logo {
  width: 35px;
  margin-right: 10px;
  margin-left: 10px;
  display: inline-block;
  vertical-align: middle;
  user-select: none;
  -webkit-user-drag: none;
  -webkit-user-select: none;
}
.active {
  color: #1976d2 !important;
}
.top-app-bar {
  -webkit-app-region: drag;
  user-select: none;
}
html {
  --thumb-size: 16px;
}
::-webkit-scrollbar {
  width: var(--thumb-size);
  height: var(--thumb-size);
}
::-webkit-scrollbar-thumb {
  background-color: #cccccc;
  border-radius: calc((var(--thumb-size) / 2));
  border: calc((var(--thumb-size) / 4)) solid #ffffff;
}
</style>