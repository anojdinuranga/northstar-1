<template>
  <v-container style="height: 100% !important;">
    <v-col style="height: 100%;display: flex;flex-wrap: nowrap;align-content: center;justify-content: center;align-items: center;">
      <v-row no-gutters justify="center">
        <v-card elevation="24" width="380" class="rounded-lg">
          <v-img class="ma-8" contain src="@/assets/allblack.png"/>
          <v-card-title class="text-h4">Sign In</v-card-title>
          <v-card-text class="mb-0 pb-0">
            <v-form>
              <v-text-field type="email" v-model="email" outlined label="Email"></v-text-field>
              <v-text-field type="password" v-model="password" outlined label="Password"></v-text-field>
            </v-form>
          </v-card-text>

          <v-card-actions class="mx-2 mb-4 mt-0 pt-0">
            <v-spacer/>
            <v-btn :loading="loading" large width="128" class="rounded-lg" @click="signIn" color="primary">Sign In</v-btn>
          </v-card-actions>

          <v-card-text v-if="hasError">
            <v-row justify="center">
              <span class="red--text mb-4 text-h4">Unauthorized!</span>
            </v-row>
          </v-card-text>
        </v-card>
      </v-row>
    </v-col>
  </v-container>
</template>

<script>
import {client} from "@/plugins/http";

export default {
  name: "Auth",
  data: () => ({
    email: "",
    password: "",
    loading: false,
    hasError: false,
  }),
  methods: {
    signIn() {
      this.loading = true;
      client.post("/admin/auth", {
        email: this.email,
        password: this.password,
      }).then((response) => {
        if(response.status === 200){
          this.$store.commit("setAuth", response.data);
          if(['admin','moderator'].includes(this.$store.state.user.role)){
            this.$router.push('/members');
          } else {
            this.$router.push('/gyms/' + this.$store.state.user.id + '/details');
          }
        }
      }).catch((error) => {
        console.log(error);
        this.loading = false;
        this.hasError = true;
      });
    },
  },
}
</script>

<style scoped>

</style>
