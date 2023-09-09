<template>
  <v-card class="rounded-t-lg rounded-b-0">
    <v-card-title>
      <v-row no-gutters>
        Edit Basic Details
        <v-spacer/>
        <v-btn color="red" icon @click="close()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-row>
    </v-card-title>
    <v-card-text>
      <v-text-field v-model="editData.name" outlined label="Name" class="rounded-lg"></v-text-field>
      <v-text-field v-model="editData.email" outlined label="Email" class="rounded-lg"></v-text-field>
      <v-text-field v-model="editData.phone" outlined label="Phone" class="rounded-lg"></v-text-field>
      <v-text-field v-model="editData.birthday" outlined label="Birthday" class="rounded-lg"></v-text-field>
      <v-select :items="gender" v-model="editData.gender" outlined label="Gender" class="rounded-lg"></v-select>
      <v-text-field v-model="editData.nic" outlined label="NIC" class="rounded-lg"></v-text-field>
    </v-card-text>

    <v-card-actions>
      <v-spacer/>
      <v-btn @click="editUser" dark large color="primary">
        <v-icon class="mr-2">mdi-check</v-icon>
        Save</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import {authClient} from "@/plugins/http";

export default {
  name: "UserEditBasicData",
  data: () => ({
    editSheet: false,
    editData: {},
    gender:[
      {text:'Male',value:'male'},
      {text:'Female',value:'female'}
    ]
  }),
  methods:{
    close(){
      this.$emit('close')
    },
    editUser(){
      let updatedData = this.editData;
      delete updatedData.created_at;
      delete updatedData.updated_at;
      delete updatedData.trainer;
      delete updatedData.doctor;
      delete updatedData.subscriptions;
      delete updatedData.qualifications;
      authClient.post('/admin/users/update-profile',this.editData).then(r=>{
        console.log(r);
        this.close();
      });
    }
  },
  mounted() {
    this.editData = this.data;
    this.editData.nic = this.editData.nic.toUpperCase();
    console.log(this.editData);
  },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
}
</script>

<style scoped>

</style>
