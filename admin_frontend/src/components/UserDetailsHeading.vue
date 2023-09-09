<template>
  <div>
    <v-row align="center" no-gutters>
      <v-img class="rounded-xl" max-height="128" min-width="128" min-height="128" max-width="128" :src=" $store.state.s3BaseUrl + data.avatar_url"></v-img>
      <v-col class="ml-8">
        <span class="text-h4 font-weight-bold">{{ data.name }}</span><br>
        <v-chip v-if="(data.role !=='doctor') && (data.role !=='gym')" dark
                :color="hasActiveSub ? '#ffa200':''">
          {{ hasActiveSub  ? 'PRO Member':'Member' }}
        </v-chip>
        <v-chip v-if="data.role ==='doctor'" dark :color="data.doctor.online ? 'green':''">{{ data.doctor.online  ? 'Online':'Offline' }}</v-chip>
      </v-col>



      <v-spacer/>

      <v-btn v-if="data.role !== 'gym'" @click="editSheet = true" elevation="0" dark rounded color="#ffa200">
        <v-icon class="mr-2">mdi-pencil</v-icon>Edit
      </v-btn>

      <v-btn v-if="data.role === 'gym'" @click="editGymSheet = true" elevation="0" dark rounded color="#ffa200">
        <v-icon class="mr-2">mdi-pencil</v-icon>Edit
      </v-btn>


    </v-row>
    <v-bottom-sheet inset v-model="editSheet">
      <UserEditBasicData :data="data" @close="editSheet = false;$router.back()"/>
    </v-bottom-sheet>

    <v-bottom-sheet scrollable inset v-model="editGymSheet">
      <GymUserEditBasicData :gym="gym" @soft-close="editGymSheet = false;" @close="close"/>
    </v-bottom-sheet>
  </div>
</template>

<script>
import UserEditBasicData from "@/components/UserEditBasicData";
import GymUserEditBasicData from "@/components/GymEditBasicData";
export default {
  name: "UserDetailsHeading",
  components: {GymUserEditBasicData, UserEditBasicData},
  data: () => ({
    editSheet: false,
    editGymSheet: false,
  }),
  props: {
    data: {
      type: Object,
      required: true
    },
    gym: {
      type: Object,
      required: true,
    }
  },
  methods:{
    hasActiveSub(){
      if(this.data.subscription === null){
        return false;
      } else {
        return this.data.subscription.is_active
      }
    },
    close(){
      this.editGymSheet = false;
      this.$emit('close');
    }
  },
  mounted() {
  }
}
</script>

<style scoped>

</style>
