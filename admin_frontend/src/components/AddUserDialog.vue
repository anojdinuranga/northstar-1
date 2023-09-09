<template>
  <v-card>
    <v-card-title>
      <v-row no-gutters>
        <span class="headline">{{ edit ? 'Edit':'Add' }} User</span>
        <v-spacer/>
        <v-btn @click="$emit('close')" icon color="red">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-row>
    </v-card-title>
    <v-divider class="mb-4"/>
    <v-card-text>
      <v-form ref="MainForm">
        <v-text-field outlined :rules="[rules.required]"  label="Name" v-model="name"></v-text-field>
        <v-text-field outlined :rules="[rules.required]"  label="Email" v-model="email"></v-text-field>
        <v-row no-gutters>
          <v-text-field outlined :rules="repeatPasswordRules" label="Password" v-model="password"></v-text-field>
          <v-text-field class="ml-2" outlined :rules="repeatPasswordRules" label="Confirm Password" v-model="confirmPassword"></v-text-field>
        </v-row>

        <v-text-field outlined :rules="[rules.required]" label="Phone" v-model="phone"></v-text-field>
        <v-text-field outlined :rules="[rules.required]" label="NIC" v-model="nic"></v-text-field>
        <v-select outlined  label="Type" v-model="role" item-value="value" :items="UserTypes"></v-select>


        <v-row justify="end" no-gutters>
          <v-btn :loading="loading" @click="upsertUser" width="128" elevation="0"  height="56" color="primary">Save</v-btn>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import {authClient} from "@/plugins/http";

export default {
  name: "AddUserDialog",
  props: {
    edit: Boolean,
    user: Object
  },
  computed:{
    repeatPasswordRules() {
      if(!this.edit){
        return [
          (v) => !!v || 'Required',
          (v) => (v && v.length >= 8) || 'Password must be at least 8 characters',
          (v) => (v === this.password) || 'Passwords must match',
        ];
      } else {
        return [];
      }
    },
  },
  data: () => ({
    loading: false,
    rules: {
      required: value => !!value || 'Required.',
    },
    UserTypes: [
      { text: 'Admin', value: 'admin'},
      { text: 'Moderator', value: 'moderator'}
    ],

    id: null,
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'moderator',
    nic: ''
  }),
  methods:{
    upsertUser(){
      const valid = this.$refs.MainForm.validate();
      console.log(this.role);
      if(valid) {
        this.loading = true;
        authClient.post('/admin/staff/upsert',{
          id: this.id,
          name: this.name,
          email: this.email,
          password: this.password,
          phone: this.phone,
          role: this.role,
          nic: this.nic
        }).then(res => {
          if(res.status === 200){
            this.$emit('close');
          } else {
            this.loading = false;
            window.alert(res.data.message);
          }
        }).catch(err => {
          this.loading = false;
          window.alert(err.response.data.message);
        })
      } else {
        this.loading = false;
        window.alert('Please fill all the fields');
      }
    }
  },
  mounted() {
    if(this.edit){
      this.id = this.user.id;
      this.name = this.user.name;
      this.email = this.user.email;
      this.phone = this.user.phone;
      this.role = this.user.role;
      this.nic = this.user.nic;
    }
  }
}
</script>

<style scoped>

</style>
