<template>
  <v-container>
    <v-col>
      <UserDetailsHeading :data="member.user" class="mb-4"/>
      <v-divider class="mb-4"/>
      <v-row no-gutters class="mt-8">
        <v-col cols="4" class="pr-2">
          <UserBaseDetails :details="getDetails()"/>
          <v-card-title class="pl-0 mb-4">Trainers</v-card-title>
          <v-card outlined v-if="member.physical_trainer !== null">

            <v-card-title class="pb-0">
              <v-img max-height="64" contain max-width="64" class="rounded-circle" :src="$store.state.s3BaseUrl + member.physical_trainer.avatar_url" alt="avatar"/>
            </v-card-title>
            <v-card-title class="pt-2">
              {{ member.physical_trainer.name }}
            </v-card-title>
            <v-card-subtitle>
              {{ member.physical_trainer.email }}
            </v-card-subtitle>
          </v-card>
          <v-card outlined v-if="member.diet_trainer !== null">

            <v-card-title class="pb-0">
              <v-img max-height="64" contain max-width="64" class="rounded-circle" :src="$store.state.s3BaseUrl + member.physical_trainer.avatar_url" alt="avatar"/>
            </v-card-title>
            <v-card-title class="pt-2">
              {{ member.diet_trainer.name }}
            </v-card-title>
            <v-card-subtitle>
              {{ member.diet_trainer.email }}
            </v-card-subtitle>
          </v-card>
        </v-col>
        <v-spacer/>
        <v-col cols="8">
          <UserEWalletTransactions :user_id="member.user.id"/>
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
  name: "MemberDetails",
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
        {name: 'ID', value: this.member.user.id},
        {name: 'Phone', value: this.member.user.phone},
        {name: 'Email', value: this.member.user.email},
        {name: 'Birthday', value: this.member.user.birthday},
        {name: 'Gender', value: this.member.user.gender.toUpperCase()},
        {name: 'NIC', value: this.member.user.nic.toUpperCase()},
        {name: 'Country', value: this.member.user.country_code},
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
