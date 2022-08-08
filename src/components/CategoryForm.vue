<template>
  <div>
    <v-dialog v-model="showDialog" :persistent="true">
      <v-form v-model="valid" style="width: 550px" ref="form" :lazy-validation="true">
        <v-card>
          <v-card-title class="headline">{{ title }}</v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="model.name" v-focus :label="t('general.name')" required="required" :rules="rules"></v-text-field>
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
import { ref, reactive, computed, onMounted, VueElement } from 'vue'
import { useStore } from '../store'
import { useI18n } from 'vue-i18n';

const { t } = useI18n()

const store = useStore()

const props = defineProps<{
  showDialog?: boolean
  categoryId?: string
}>()

const emit = defineEmits(['hideDialog'])

const form = ref<HTMLFormElement>()
const saving = ref(false)
const valid = ref(true)
const action = ref("New")
const title = ref("New Category")
const model = reactive<Category>({
  _id: undefined,
  name: '',
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

const vFocus = {
  mounted: (el: VueElement) => el.focus()
}

onMounted(() => {
  if (props.categoryId == null) {
    Object.assign(model, {})
    action.value = "New"
  } else {
    Object.assign(model, store.getters.categoryById(props.categoryId))
    action.value= "Update"
    title.value = "Update Category"
  }
})

const save = () => {
  if (form.value && form.value.validate()) {
    saving.value = true
    model.name = model.name.trim()

    if (action.value === "New") {
      model.createdDate = new Date()
      model.updatedDate = new Date()
      store.dispatch('addCategory', model).then(() => {
        emit("hideDialog")
      })
    } else {
      model.updatedDate = new Date()
      store.dispatch('updateCategory', model).then(() => {
        emit("hideDialog")
      })
    }
  }
}

const cancel = () => {
  emit("hideDialog")
}

</script>
