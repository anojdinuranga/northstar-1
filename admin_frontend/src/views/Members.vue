<template>
  <v-container>
    <v-row no-gutters>
      <v-text-field v-model="search" outlined rounded label="Search Members..."></v-text-field>
    </v-row>

    <v-card outlined :loading="loading">
      <v-data-table
          :search="search"
          :headers="headers"
          :items="members">
        <template v-slot:item.membership="{ item }">
          <v-chip dark :color="hasActiveSub(item) ? '#ffa200':''">{{ hasActiveSub(item) ? 'PRO Member' : 'Member' }}</v-chip>
        </template>

        <template v-slot:item.user.avatar_url="{ item }">
          <v-avatar class="ma-2">
            <v-img :src="$store.state.s3BaseUrl + item.user.avatar_url"></v-img>
          </v-avatar>
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
  name: "Members",
  data: () => ({
    search: '',
    members: [],
    loading: true,
    headers: [
      {text: "", value: "user.avatar_url", sortable: false},
      {text: "User ID", value: "user.id"},
      {text: "Name", value: "user.name"},
      {text: "Email", value: "user.email"},
      {text: "Phone", value: 'user.phone'},
      {text: "Membership", value: 'membership',sortable: false},
      {text: "Actions", value: "actions", sortable: false}
    ],
  }),
  methods: {
    viewDetails(item) {
      this.$router.push({name: 'Member Profile Overview', params: {member: item}});
    },
    hasActiveSub(item) {
      if (item.subscription === null) {
        return false;
      } else {
        return item.subscription.is_active
      }
    },
    getMembers() {
      authClient.get('/clients/get-all').then(value => {
        this.members = value.data;
        console.log(value.data);
        this.loading = false;
      });
    }
  },
  mounted() {
    this.getMembers();
  }
}
</script>

<style scoped>

</style>
