<template>
  <v-container>
    <v-row no-gutters>
      <v-text-field v-model="search" outlined rounded label="Search Users..."></v-text-field>
      <v-btn @click="addUserDialog = true; edituser = null; isEdit = false" class="ml-2" rounded height="56" elevation="0" dark>
        <v-icon>mdi-plus</v-icon>
        Add User
      </v-btn>
    </v-row>

    <v-card outlined :loading="loading">
      <v-data-table
          :search="search"
          :headers="headers"
          :items="users">
        <template v-slot:item.actions="{ item }">
          <v-btn color="primary" @click="editUserDetails(item)" icon>
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn color="red" @click="deleteUser(item)" icon>
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>

        <template v-slot:item.role="{ item }">
          <v-chip :color="item.role === 'admin' ? 'red' : 'green'" dark>
            {{ item.role === 'admin' ? 'Admin' : 'Moderator' }}
          </v-chip>
        </template>
      </v-data-table>
    </v-card>


    <v-dialog max-width="768" persistent v-if="addUserDialog" v-model="addUserDialog">
      <AddUserDialog :user='edituser' :edit="isEdit" @close="closeDialogs"/>
    </v-dialog>
  </v-container>
</template>

<script>
import {authClient} from "@/plugins/http";
import AddUserDialog from "@/components/AddUserDialog.vue";

export default {
  name: "ManageUsers",
  components: {AddUserDialog},
  data: () => ({
    search: '',
    loading: true,
    users: [],
    headers: [
      {text: "User ID", value: "id"},
      {text: "Name", value: "name"},
      {text: "Email", value: "email"},
      {text: "Phone", value: 'phone'},
      {text: "NIC", value: 'nic'},
      {text: "Role", value: 'role',sortable: false},
      {text: "Actions", value: "actions", sortable: false}
    ],
    addUserDialog: false,
    edituser: null,
    isEdit: false
  }),
  methods: {
    editUserDetails(user) {
      this.edituser = user;
      this.isEdit = true;
      this.addUserDialog = true;
    },
    closeDialogs(){
      this.GetUsers();
      this.addUserDialog = false;
      this.edituser = null;
      this.isEdit = false;
    },
    GetUsers(){
      authClient.post('/admin/staff/get')
        .then(response => {
          this.users = response.data;
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
          this.loading = false;
        });
    },
    deleteUser(user){
      let res = window.prompt("Are you sure you want to delete this user? Type 'DELETE' to confirm");
      if(res === 'DELETE'){
        this.loading = true;
        authClient.post('/admin/staff/delete', {id: user.id})
            .then(response => {
              this.GetUsers();
            })
            .catch(error => {
              console.log(error);
              this.loading = false;
            });
      }
    }
  },
  mounted() {
    this.GetUsers();
  }
}
</script>

<style scoped>

</style>
