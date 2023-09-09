<template>
  <v-container>


    <v-row no-gutters>
      <v-text-field v-model="search" outlined rounded label="Search New Medical Professionals..."></v-text-field>
    </v-row>

    <v-card outlined :loading="loading">
      <v-data-table
          :search="search"
          :headers="headers"
          :items="doctors">
        <template v-slot:item.status="{ item }">
          <v-chip dark  color="red">New</v-chip>
        </template>

        <template v-slot:item.actions="{ item }">

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-bind="attrs"
                     v-on="on" @click="toggleStatus(item)" color="green" icon>
                <v-icon>mdi-check</v-icon>
              </v-btn>
            </template>
            <span>Approve</span>
          </v-tooltip>


          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-bind="attrs"
                     v-on="on" @click="toggleStatus(item)" color="red" v-if="item.doctor.approved" icon>
                <v-icon>mdi-close-circle-outline</v-icon>
              </v-btn>

            </template>
              <span>Reject</span>
          </v-tooltip>

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
  name: "NewDoctors",
  data: () => ({
    loading: true,
    headers: [
      {text: "Title", value: "doctor.title"},
      {text: "Name", value: "name"},
      {text: "Specialty", value: "doctor.speciality"},
      {text: "Charge Type", value:'doctor.charge_type'},
      {text: "Currency", value:'currency'},
      {text: "Country", value:'country_code'},
      {text: "Can Prescribe", value:'doctor.can_prescribe'},
      {text: "Status", value: "status"},
      {text: "Actions", value: "actions", sortable: false}
    ],
    search: '',
    doctors:[],
  }),
  methods: {
    viewDetails(item){
      console.log(item);
      this.$router.push({name:'Medical Professionals Profile Overview', params:{member:item}});
    },
    toggleStatus(item){
      let result = window.prompt('Are you sure you want to Approve this doctor?. Type "YES" to confirm');
      if (result === 'YES') {
        this.loading = true;
        authClient.post('/doctors/approve', {
          doctor_id: item.doctor.user_id,
        })
          .then(response => {
            console.log(response);
            this.getDoctors();
          })
          .catch(error => {
            console.log(error);
            this.loading = false;
          });
      }
    },
    getDoctors() {
      this.loading = true;
      authClient.get('/doctors/all-new').then(response => {
        this.doctors = response.data;
        this.loading = false;
        console.log(this.doctors);
      }).catch(error => {
        console.log(error);
        this.loading = false;
      });
    },
  },
  mounted() {
    this.getDoctors();
  }
}
</script>

<style scoped>

</style>
