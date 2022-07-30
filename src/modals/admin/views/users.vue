<template>
  <v-row class="justify-center">
    <v-row class="px-2">
      <v-col>
        <v-text-field
          v-model="input.search"
          label="Search..."
          hide-details class="mb-3"
          filled dense background-color="grey500"
          prepend-inner-icon="fas fa-search"
        >
          <template v-slot:prepend-inner>
            <fai class="mr-1  title" :icon="['fas','search']" />
          </template>
        </v-text-field>
      </v-col>
    </v-row>
    <v-row class="px-2">
      <v-col>
        <v-data-table
          :loading="loading" loading-text="Fetching..."
          :headers="fields"
          :items="data"
          :options.sync="options"
          hide-default-footer
          item-key="_id"
          color="grey900"
        >
          <template v-slot:item.balance="{headers, name, value}">
            {{ value | currencyInt }}
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn small color="secondary" @click="clicked(item)">
              <fai class="title" :icon="['fas','search']" />
            </v-btn>
          </template>
        </v-data-table>
        <v-pagination
          class="my-4"
          :total-visible="5"
          :value="pagination.page"
          :length="pagination.totalPages"
          @input="update"
          @next="next"
          @previous="prev"
        />
      </v-col>
    </v-row>
    </v-input>
  </v-row>
  </v-row>
</template>
<script>
import { users } from './fields'
import { admin as api } from '@/api'

export default {
  name: 'ModalAdminViewUsers',
  components: {
  },

  props: ['lookUpUser'],

  data() {
    return {
      loading: true,
      fields: users,
      perPage: 5,

      input: {
        search: ''
      },

      options: {},

      expanded: [],
      singleExpand: false,

      data: [],
      pagination: {
        totalPages: 0,
        page: 1
      }
    }
  },

  watch: {
    options: {
      handler(val) {
        console.log(val)
      }
    },
    input: {
      handler(val) {
        this.getUsers({ page: 1, search: val.search })
      },
      deep: true
    }
  },

  created() {
    this.getUsers({ page: 1 })
  },

  methods: {
    async getUsers(params) {
      this.loading = true
      const resp = await api.getUsers({ limit: this.perPage, ...params })
      console.log(resp)
      this.pagination = resp.pagination
      this.data = resp.data
      this.loading = false
    },
    async update(page) {
      await this.getUsers({ page })
    },
    async next() {
      await this.getUsers({ page: this.pagination.page + 1 })
    },
    async prev() {
      await this.getUsers({ page: this.pagination.page - 1 })
    },
    clicked(data) {
      console.log(this.refs)
      this.lookUpUser(data._id)
    }
  }
}
</script>
