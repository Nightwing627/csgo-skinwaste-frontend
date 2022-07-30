<template>
  <v-card class="modal">
    <v-card-title>Test</v-card-title>
    <v-card-text class="number">
      Lorem ipsum dolor sit amet consectetur adipisicing elit.
      Eveniet tenetur repellendus dicta quos nihil obcaecati repellat nemo nisi aspernatur delectus, dolorem exercitationem, sunt sequi,
      laudantium culpa sed deleniti? Vel animi repellendus labore dolorum libero, adipisci eveniet suscipit quidem illum omnis expedita in
      totam. Vel, quidem dolorum. Reprehenderit debitis quia suscipit!
    </v-card-text>
    <v-card-actions>
      <v-btn color="white" text small @click="close()">
        Close
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: ['close']
}
</script>

<style lang="scss" scoped>
.modal ::v-deep ul {
  margin-bottom: 20px;
}
</style>
