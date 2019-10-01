<!-- Main App View -->
<!-- Contains navigation drawer and header wrapper around content-->
<template lang="pug">
  v-app(:dark="darkTheme")
    category-form(:showDialog="categoryDialog" v-on:hideDialog="categoryDialog = false" :categoryId="categoryId" v-if="categoryDialog")
    note-form(:showDialog="noteDialog" v-on:hideDialog="noteDialog = false" v-if="noteDialog")
    v-navigation-drawer(fixed :clipped='$vuetify.breakpoint.lgAndUp' app v-model='drawer')
      v-list(dense)
        template(v-for='item in this.$options.drawerItems')
          v-layout(row v-if='item.heading' align-center :key='item.heading')
            v-flex(xs6)
              v-subheader(v-if='item.heading')
                | {{ item.heading }}
          v-list-group(v-else-if='item.children' :key='item.text' value="true")
            template(v-slot:activator)
              v-list-item-content
                v-list-item-title {{ item.text }}
            v-list-item(v-for='(category, i) in categoriesSorted' :key='i' @click='selectCategoryDrawer(category.name)' :class="{ active: categorySelected === category.name }")
              v-list-item-action
                v-icon(:class="{ active: categorySelected === category.name }")
                  | dashboard
              v-list-item-content
                v-list-item-title
                  | {{ category.name }}
              v-list-item-action
                v-menu(bottom right)
                  template(v-slot:activator="{ on }")
                    v-btn(text icon v-on="on" color='grey')
                      v-icon more_vert
                  v-list
                    v-list-item(@click='categoryId = category._id; categoryDialog = true')
                      v-list-item-title {{ $t('app.edit') }}
                    v-list-item(@click='deleteCategory(category)')
                      v-list-item-title {{ $t('app.delete') }}
          v-list-item(v-else @click='selectCategoryDrawer("all")' :class="{ active: categorySelected === 'all' }" :key='item.text')
            v-list-item-action
              v-icon(:class="{ active: categorySelected === 'all' }") all_inclusive
            v-list-item-content
              v-list-item-title
                | All
            v-list-item-action
                v-btn(text icon color='primary' @click.stop='categoryId = null; categoryDialog = true')
                  v-icon add
    v-app-bar.top-app-bar(color='blue darken-3' dark app :clipped-left='$vuetify.breakpoint.lgAndUp' fixed v-shortkey.once="['ctrl', 'f']" @shortkey="$refs.search.focus()")
      v-app-bar-nav-icon(@click.stop='drawer = !drawer')
      v-toolbar-title.ml-0.pl-3(style="width: 200px")
        img.logo(src="@/assets/logo.svg" alt="logo")
        span(style="cursor: default") {{ $t('app.title') }}
      v-text-field(dark color='primary' solo-inverted hide-details prepend-inner-icon='search' ref="search" v-model="searchNotes" :label="$t('general.search')" clearable)

      v-btn.add-btn(fab dark small color="primary" style="margin-left:10px" @click='noteDialog = true')
        v-icon(dark) add
    v-content
      router-view.view
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import DrawerItemsConfig from './drawerItems.json'
import CategoryForm from "./components/CategoryForm.vue"
import NoteForm from "./components/NoteForm.vue"

export default {
  components: {
    CategoryForm,
    NoteForm
  },
  drawerItems: DrawerItemsConfig,
  name: "App",
  data: () => ({
    darkThemeToggle: false,
    drawer: null,
    categoryDialog: false,
    categoryId: null,
    searchNotes: "",
    noteDialog: false
  }),
  methods: {
    ...mapActions(['selectCategory', 'deleteCategory', 'loadCategories']),
    selectCategoryDrawer(category) {
      this.selectCategory(category)
    },
  },
  computed: {
    ...mapGetters(['darkTheme', 'categorySelected', 'categories']),
    categoriesSorted() {
      let safeCategories = []
      if(this.categories != null) {
        safeCategories = this.categories
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
    }
  },
  watch: {
    darkThemeToggle(val) {
      localStorage.setItem('darkTheme', val)
      this.$store.dispatch('THEME', { theme: val })
    },
    searchNotes(val) {
      this.$store.dispatch('SEARCH', { search: val })
    }
  },
  mounted() {
    this.$refs.search.focus()

    this.loadCategories()

    if(localStorage.getItem('darkTheme'))
    {
      this.$store.dispatch('THEME', { theme: localStorage.getItem('darkTheme') === 'true' })
        .then(() => {
          this.darkThemeToggle = this.$store.state.darkTheme
      })
    }
  }
}
</script>

<style lang="stylus">
.logo {
  width: 35px;
  margin-right: 10px;
  margin-left: 10px;
  display: inline-block;
  vertical-align: middle;
  user-drag: none;
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
