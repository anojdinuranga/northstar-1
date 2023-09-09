<template>
  <v-container>
    <v-row no-gutters class="mb-4">
      <v-card to="/doctors/new-doctors" outlined hover ripple dark class="green" width="180">
        <v-card-subtitle class="pb-0">New Doctors</v-card-subtitle>
        <v-card-title class="pt-0 text-h4">{{ newDocCount }}</v-card-title>
      </v-card>
    </v-row>
    <v-row no-gutters>
      <v-text-field v-model="search" outlined rounded label="Search Medical Professionals..."></v-text-field>
    </v-row>

    <v-card outlined :loading="loading">
      <v-data-table
          :search="search"
          :headers="headers"
          :items="doctors">
        <template v-slot:item.status="{ item }">
          <v-chip dark :color="item.doctor.approved ? 'green':'red'">{{ item.doctor.approved ? 'Approved':'Suspended' }}</v-chip>
        </template>

        <template v-slot:item.actions="{ item }">

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-bind="attrs"
                     v-on="on" v-if="!item.doctor.approved" @click="toggleStatus(item)" color="green" icon>
                <v-icon>mdi-check</v-icon>
              </v-btn>

            </template>
            <span>Approve</span>
          </v-tooltip>


          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-bind="attrs"
                     v-on="on" @click="toggleStatus(item)" color="red" v-if="item.doctor.approved" icon>
                <v-icon>mdi-pause-circle-outline</v-icon>
              </v-btn>

            </template>
              <span>De-Approve</span>
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

        <template v-slot:item.doctor.can_prescribe="{ item }">
          <v-chip dark :color="item.doctor.can_prescribe ? 'green':'red'">{{ item.doctor.can_prescribe ? 'YES':'NO' }}</v-chip>
        </template>
      </v-data-table>
    </v-card>


  </v-container>
</template>

<script>
import {authClient} from "@/plugins/http";

export default {
  name: "Doctors",
  data: () => ({
    loading: true,
    headers: [
      {text: "ID", value: "id"},
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
    newDocCount: 0,
    doctors:[],
  }),
  methods: {
    viewDetails(item){
      console.log(item);
      this.$router.push({name:'Medical Professionals Profile Overview', params:{member:item}});
    },
    toggleStatus(item){
      let result = window.prompt('Are you sure you want to toggle the status of this doctor?. Type "YES" to confirm');
      if (result === 'YES') {
        this.loading = true;
        authClient.post('/doctors/toggle-status', {
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
      authClient.get('/doctors/all-old').then(response => {
        this.doctors = response.data;
        this.loading = false;
        console.log(this.doctors);
      }).catch(error => {
        console.log(error);
        this.loading = false;
      });
    },
    getNewDoctors() {
      this.loading = true;
      authClient.get('/doctors/all-new').then(response => {
        this.newDocCount = response.data.length;
        this.loading = false;
        console.log('NEW');
        console.log(response.data);
      }).catch(error => {
        console.log(error);
        this.loading = false;
      });
    },
  },
  mounted() {
    this.getDoctors();
    this.getNewDoctors();
  }
}
</script>

<style scoped>

</style>
