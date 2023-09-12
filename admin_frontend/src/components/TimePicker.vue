<template>
    <v-menu
      ref="menu"
      v-model="menu2"
      :close-on-content-click="false"
      :return-value.sync="time"
      lazy
      transition="scale-transition"
      offset-y
      full-width
      max-width="290px"
      min-width="290px"
    >
        <template v-slot:activator="{ on }">
          
          <v-text-field
            v-model="time"
            :label="title"
            readonly
            v-on="on"
          ></v-text-field>
        </template>
        <v-time-picker
          v-if="menu2"
          v-model="time"
          full-width
          @click:minute="$refs.menu.save(time)"
          @input="emitValue"
        ></v-time-picker>
    </v-menu>
</template>

<script>
import {authClient} from "@/plugins/http"
import { reactive, computed } from "vue";


export default {

  name: "SuccessStoryDialog",
  props: {
    edit: Boolean,
    time_data: String,
    title:String
  },
  data: () => ({
    UserTypes: [
    { text: 'Full Time', value: '0'},
    { text: 'Specific Time', value: '1'}
  ],
    time: null,
    menu2: false,
    modal2: false,
    loading: false,
  }),
  methods:{
    emitValue() {
      const [hours, minutes] = this.time.split(':');
      console.log(`${hours}:${minutes}:00`)
      this.$emit('value-emitted', `${hours}:${minutes}:00`);
    }
  },
  mounted() {
    if(this.edit){
      this.time = this.time_data
    }
  }
}
</script>
