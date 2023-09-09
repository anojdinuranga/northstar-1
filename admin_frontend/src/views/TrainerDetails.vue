<template>
  <v-container>
    <v-col>
      <UserDetailsHeading :data="member" class="mb-4"/>
      <v-divider class="mb-4"/>
      <v-row no-gutters class="mt-8">
        <v-col cols="4" class="pr-2">
          <UserBaseDetails :details="getDetails()"/>
          <v-card outlined class="mt-4">
            <v-card-title>Clients</v-card-title>
            <v-card-text>
              <v-card class="mb-2 pl-0 ml-0" outlined v-for="(client,i) in clients" :key="i">
                <v-card-title class="pb-0">
                  <v-img max-height="64" contain max-width="64" class="rounded-circle" :src="$store.state.s3BaseUrl + client.user.avatar_url" alt="avatar"/>
                </v-card-title>
                <v-card-title class="pt-2">
                  {{ client.user.name }}
                </v-card-title>
                <v-card-subtitle>
                  {{ client.user.email }}
                </v-card-subtitle>
              </v-card>
            </v-card-text>
          </v-card>

        </v-col>
        <v-spacer/>
        <v-col cols="8">
            <UserEWalletTransactions :user_id="member.id"/>
        </v-col>
      </v-row>
    </v-col>
  </v-container>
</template>

<script>
import UserBaseDetails from "@/components/UserBaseDetails";
import UserDetailsHeading from "@/components/UserDetailsHeading";
import UserEWalletTransactions from "@/components/UserEWalletTransactions";
import {authClient} from "@/plugins/http";

export default {
  name: "TrainerDetails",
  components: {UserEWalletTransactions, UserDetailsHeading, UserBaseDetails},
  props: {
    member: {
      type: Object,
      required: true
    }
  },
  data:() => ({
    clients:[]
  }),
  methods: {
    getDetails() {
      return [
        {name: 'Phone', value: this.member.phone},
        {name: 'Email', value: this.member.email},
        {name: 'Birthday', value: this.member.birthday},
        {name: 'Gender', value: this.member.gender.toUpperCase()},
        {name: 'NIC', value: this.member.nic.toUpperCase()},
        {name: 'Country', value: this.member.country_code},
      ]
    },
    getMembers(){
      authClient.get('trainer/clients/all/' + this.member.id).then(value => {
        this.clients = value.data;
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
