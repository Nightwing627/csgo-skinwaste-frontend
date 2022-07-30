<template>
  <v-data-table
    v-if="items.length"
    class="grey700"
    :dark="false"
    :headers="headers"
    :items="items"
    :items-per-page="5"
  >
    <!-- eslint-disable-next-line -->
    <template v-slot:item.createdAt="{ item }">
      {{ item.createdAt.toLocaleString() }}
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: 'ReferredUsers',
  props: {
    items: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      headers: [
        {
          text: 'Date',
          align: 'start',
          sortable: false,
          value: 'createdAt'
        },
        { text: 'User', value: 'user_id' },
        { text: 'Deposited', value: 'balance' },
        {
          text: 'You Received',
          value: 'earnings'
        }
      ]
    }
  }
}
</script>
