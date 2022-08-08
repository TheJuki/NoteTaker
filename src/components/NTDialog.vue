<template>
  <div>
    <v-dialog v-model="showDialog" max-width="350" :persistent="true">
      <v-card>
        <v-card-title class="headline">{{ title }}</v-card-title>
        <v-card-text>{{ description }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn :color="btn1.color" v-if="btn1.visible" text="text" @click.native="btn1Event">{{ btn1.text }}</v-btn>
          <v-btn :color="btn2.color" v-if="btn2.visible" text="text" @click.native="btn2Event">{{ btn2.text }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
defineProps({
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
})

const emit = defineEmits(['hideDialog', 'btn1Event', 'btn2Event'])

const btn1Event = () => {
  emit('hideDialog')
  emit('btn1Event')
}

const btn2Event = () => {
  emit('hideDialog')
  emit('btn2Event')
}
</script>
