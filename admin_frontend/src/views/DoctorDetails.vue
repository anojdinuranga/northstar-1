<template>
  <v-container>
    <v-col>
      <UserDetailsHeading :data="member" class="mb-4"/>
      <v-divider class="mb-4"/>
      <v-row no-gutters class="mt-8">
        <v-col cols="4" class="pr-2">
          <UserBaseDetails :details="getDetails()"/>
          <v-card-title class="pl-0">Qualifications</v-card-title>
          <v-card outlined class="ma-2 rounded-lg" v-for="(qx,i) in member.qualifications" :key="i">
            <v-card-title>
              {{ qx.title }}
            </v-card-title>
            <v-card-text>
              {{ qx.description }}
            </v-card-text>
          </v-card>
        </v-col>
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
export default {
  name: "DoctorDetails",
  components: {UserEWalletTransactions, UserDetailsHeading, UserBaseDetails},
  props:{
    member: {
      type: Object,
      required: true
    }
  },
  methods:{
    getDetails(){
      return [

        {name: 'Phone', value: this.member.phone},
        {name: 'Email', value: this.member.email},
        {name: 'Birthday', value: this.member.birthday},
        {name: 'Gender', value: this.member.gender.toUpperCase()},
        {name: 'NIC', value: this.member.nic.toUpperCase()},
        {name: 'Country', value: this.member.country_code},
      ]
    }
  },
  mounted() {
    console.log(this.member);
  }
}
</script>

<style scoped>

</style>
