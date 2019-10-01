<template lang="pug">
  div
    v-dialog(v-model="showDialog" max-width="350" :persistent="true")
      v-card
        v-card-title.headline {{ title }}
        v-card-text {{ description }}
        v-card-actions
          v-spacer
          v-btn(:color="btn1.color" v-if="btn1.visible" text @click.native="btn1Event") {{ btn1.text }}
          v-btn(:color="btn2.color" v-if="btn2.visible" text @click.native="btn2Event") {{ btn2.text }}
</template>

<script>
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    btn1: {
      type: Object,
      default: function() {
        return {
         color: 'red',
          visible: true,
          text: 'Yes'
        }
      }
    },
    btn2: {
      type: Object,
      default: function() {
        return {
          color: 'blue',
          visible: true,
          text: 'No'
        }
      }
    }
  },
  methods: {
   btn1Event () {
      this.$emit('hideDialog')
      this.$emit('btn1Event')
    },
    btn2Event () {
      this.$emit('hideDialog')
      this.$emit('btn2Event')
    }
  }
}
</script>
