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
                  v-text-field(v-model='model.name' ref="name" :label="$t('general.name')" required :rules="[rules.required]")
          v-card-actions
            v-spacer
            v-btn(text color='error' @click.native="cancel") {{ $t('app.cancel') }}
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
    categoryId: {
      type: String,
      default: null
    }
  },
  data: function() {
    return {
      loaded: false,
      saving: false,
      valid: true,
      title: "New Category",
      model: {},
      rules: {
        required: value => !!value || "Required"
      }
    }
  },
  computed: {
    ...mapGetters(['categoryById'])
  },
  mounted() {
    if (this.categoryId == null) {
      this.model = {}
      this.model.action = "New"
    } else {
      this.model = Object.assign({}, this.categoryById(this.categoryId))
      this.model.action = "Update"
      this.title = "Update Category"
    }

    this.$refs.name.focus()
  },
  methods: {
    ...mapActions(["addCategory", "updateCategory"]),
    save() {
      if (this.$refs.form.validate()) {
        this.saving = true
        this.model.name = this.model.name.trim()

        if (this.model.action === "New") {
          this.model.createdDate = new Date()
          this.model.updatedDate = new Date()
          this.addCategory(this.model).then(() => {
            this.$emit("hideDialog")
          })
        } else {
          this.model.updatedDate = new Date()
          this.updateCategory(this.model).then(() => {
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
