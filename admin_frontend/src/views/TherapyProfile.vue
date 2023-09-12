<template>
    <v-container>
      <v-col>
        <UserDetailsHeading :data="member" :member_load="getMembers" class="mb-4"/>
        <v-divider class="mb-4"/>
        <v-row no-gutters class="mt-8">
          <v-col cols="4" class="pr-2">
            <UserBaseDetails :details="user_Details"/>
          </v-col>
          <v-spacer/>
          <v-col cols="8">
            <UserEWalletTransactions :user_id="member.user_id"/>
          </v-col>
        </v-row>
      </v-col>
    </v-container>
  </template>
  
  <script>
  import {authClient} from "@/plugins/http";
  import UserBaseDetails from "@/components/UserBaseDetails";
  import UserDetailsHeading from "@/components/UserDetailsHeading";
  import UserEWalletTransactions from "@/components/UserEWalletTransactions";
  export default {
    name: "TherapyProfile",
    components: {UserEWalletTransactions, UserDetailsHeading, UserBaseDetails},
    data: () => ({
      member : {},
      user_Details : []
    }),
    methods:{
      getMembers() {
        authClient.get('/therapy/therapy').then(value => {
          let data = value.data[0]
          if(data.status){
            this.member = data.data.result;
            this.user_Details = [
              {name: 'ID', value: this.member.user_id},
              {name: 'Phone', value: this.member.phone},
              {name: 'Email', value: this.member.email},
              {name: 'Birthday', value: this.member.birthday},
              {name: 'Gender', value: this.member.gender.toUpperCase()},
              {name: 'NIC', value: this.member.nic.toUpperCase()},
              {name: 'Country', value: this.member.country_code},
            ]
          }
          this.loading = false
        });
      }
    },
    mounted() {
      this.getMembers()
    }
  }
  </script>
  
  <style scoped>
  
  </style>
  