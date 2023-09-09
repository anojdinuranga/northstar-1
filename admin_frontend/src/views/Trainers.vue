<template>
  <v-container>
    <v-row no-gutters>
      <v-text-field v-model="search" outlined rounded label="Search Trainers..."></v-text-field>
    </v-row>

    <v-card outlined :loading="loading">
      <v-data-table
          :search="search"
          :headers="headers"
          :items="trainers">
        <template v-slot:item.avatar_url="{ item }">
          <v-avatar class="ma-2">
            <v-img :src="$store.state.s3BaseUrl + item.avatar_url"></v-img>
          </v-avatar>
        </template>
        <template v-slot:item.membership="{ item }">
          <v-chip dark :color="hasActiveSub(item) ? '#ffa200':''">{{ hasActiveSub(item) ? 'PRO Member' : 'Member' }}</v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn @click="viewDetails(item)" v-bind="attrs"
                     v-on="on" icon>
                <v-icon>mdi-dots-horizontal</v-icon>
              </v-btn>

            </template>
            <span>More Info</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import {authClient} from "@/plugins/http";

export default {
  name: "Trainers",
  data: () => ({
    search: '',
    trainers: [],
    loading: true,
    headers: [
      {text: "DP", value: "avatar_url", sortable: false},
      {text: "User ID", value: "id"},
      {text: "Name", value: "name"},
      {text: "Email", value: "email"},
      {text: "Phone", value: 'phone'},
      {text: "Country", value: 'country_code'},
      {text: "Membership", value: 'membership',sortable: false},
      {text: "Actions", value: "actions", sortable: false}
    ],
  }),
  methods: {
    viewDetails(item) {
      console.log(item);
      this.$router.push({name: 'Trainer Profile Overview', params: {member: item}});
    },
    hasActiveSub(item) {
      if (item.subscriptions === null) {
        return false;
      } else {
        return item.subscriptions.is_active
      }
    },
    getTrainers() {
      authClient.get('/trainers/get-all').then(value => {
        this.trainers = value.data;
        console.log(value.data);
        this.loading = false;
      });
    }
  },
  mounted() {
    this.getTrainers();
  }
}
</script>

<style scoped>

</style>
