<template>
  <v-card class="modal">
    <v-img
      width="100%" :aspect-ratio="1" contain
      :src="`https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${data}&choe=UTF-8`"
    />

    <v-card-actions class="pa-0">
      <v-btn color="white" text block @click="close()">
        Close
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'ModalQRCode',
  props: ['close', 'payload'],
  data() {
    return {
      data: this.payload.data
    }
  }
}
</script>
