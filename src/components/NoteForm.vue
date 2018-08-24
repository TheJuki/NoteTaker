<template lang="pug">
  div
    v-dialog(v-model="showDialog" max-width="550" :persistent="true")
      v-form(v-model="valid" ref="form" lazy-validation)
        v-card
          v-card-title.headline {{ title }}
          v-card-text
            v-container
              v-layout(row)
                v-flex(xs12)
                  v-text-field(v-model='model.title' ref="title" :label="$t('general.title')" required :rules="[rules.required]")
              v-layout(row)
                v-flex(xs12)
                  v-autocomplete(:items="categories" cache-items v-model="model.categories" :label="$t('general.categories')" item-text="name" item-value="name" clearable multiple chips)
                    template(slot='selection' slot-scope='data')
                      v-chip(:selected='data.selected' close @input='data.parent.selectItem(data.item.name)' color='primary' text-color='white') {{ data.item.name }}
              v-layout(row)
                v-flex(xs12)
                  v-textarea(v-model='model.content' auto-grow :label="$t('general.content')" required :rules="[rules.required]")
          v-card-actions
            v-spacer
            v-btn(flat color='error' @click.native="cancel") {{ $t('app.cancel') }}
            v-btn(depressed color='info' @click.stop="save" :disabled="!valid" :loading="saving") {{ $t('app.save') }}
</template>

<script>
import { mapGetters, mapActions } from "vuex"

export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    noteId: {
      type: String,
      default: null
    }
  },
  data: function() {
    return {
      loaded: false,
      saving: false,
      valid: true,
      title: "New Note",
      model: {},
      rules: {
        required: value => !!value || "Required"
      }
    }
  },
  computed: {
    ...mapGetters(['noteById', 'categories'])
  },
  mounted() {
    if (this.noteId == null) {
      this.model = {}
      this.model.action = "New"
    } else {
      this.model = Object.assign({}, this.noteById(this.noteId))
      this.model.action = "Update"
      this.title = "Update Note"
    }

    this.$refs.title.focus()
  },
  methods: {
    ...mapActions(["addNote", "updateNote"]),
    save() {
      this.model.title = this.model.title.trim()
      this.model.content = this.model.content.trim()

      if (this.$refs.form.validate()) {
        this.saving = true

        if (this.model.action === "New") {
          this.model.createdDate = new Date()
          this.model.updatedDate = new Date()
          this.addNote(this.model).then(() => {
            this.$emit("hideDialog")
          })
        } else {
          this.model.updatedDate = new Date()
          this.updateNote(this.model).then(() => {
            this.$emit("hideDialog")
          })
        }
      }
    },
    cancel() {
      this.$emit("hideDialog")
    }
  }
}
</script>
