<template>
  <div>
    <v-dialog v-model="showDialog" :scrollable="true" :persistent="true">
      <v-form v-model="valid" style="width: 550px" ref="form" :lazy-validation="true">
        <v-card>
          <v-card-title class="headline">{{ title }}</v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="model.title" v-focus :label="t('general.title')" required="required" :rules="rules"></v-text-field>
               </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-autocomplete :items="categories" v-model="model.categories" :label="t('general.categories')" itemTitle="name" itemValue="name" :clearable="true" :multiple="true" :chips="true">
                    <template v-slot:chip="{ props, item } : { props: any, item: any }">
                      <v-chip
                        v-bind="props"
                        :closable="true"
                        :text="item.raw.name"
                        color="primary" 
                        text-color="white"
                      ></v-chip>
                    </template>
                  </v-autocomplete>
                </v-col>
               </v-row>
               <v-row>
                <v-col cols="12">
                  <v-textarea v-model="model.content" :auto-grow="true" :label="t('general.content')" required="required" :rules="rules"></v-textarea>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text="text" color="error" @click.native="cancel">{{ t('app.cancel') }}</v-btn>
            <v-btn depressed="depressed" color="info" @click.stop="save" :disabled="!valid" :loading="saving">{{ t('app.save') }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { Category } from '../models/Category';
import { Note } from '../models/Note';
import { ref, reactive, computed, onMounted, VueElement } from 'vue'
import { useStore } from '../store'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const store = useStore()

const props = defineProps<{
  showDialog?: boolean
  noteId?: string
}>()

const emit = defineEmits(['hideDialog'])

const form = ref<HTMLFormElement>()
const loaded = ref(false)
const saving = ref(false)
const valid = ref(true)
const action = ref("New")
const title = ref("New Note")
const model = reactive<Note>({
  _id: undefined,
  title: '',
  content: '',
  categories: [],
  createdDate: new Date(),
  updatedDate: new Date()
})

const rules = computed(() => {
  const rules = []
  const rule =
      (v: string) => !!v || 'Required'

  rules.push(rule)
  return rules;
})

const categories = computed(() => {
  return store.state.categories;
})

const vFocus = {
  mounted: (el: VueElement) => el.focus()
}

onMounted(() => {
  if (props.noteId == null) {
    Object.assign(model, {})
    action.value = "New"
  } else {
    Object.assign(model, store.getters.noteById(props.noteId))
    action.value = "Update"
    title.value = "Update Note"
  }
})

const save = () => {
  model.title = model.title.trim()
  model.content = model.content.trim()

  if (form.value && form.value.validate()) {
    saving.value = true

    if (action.value === "New") {
      model.createdDate = new Date()
      model.updatedDate = new Date()
      store.dispatch('addNote', model).then(() => {
        emit("hideDialog")
      })
    } else {
      model.updatedDate = new Date()
      store.dispatch('updateNote', model).then(() => {
        emit("hideDialog")
      })
    }
  }
}

const cancel = () => {
  emit("hideDialog")
}

const remove = (item: Category) => {
  const index = model.categories.indexOf(item.name)
  if (index >= 0) model.categories.splice(index, 1)
}

</script>
