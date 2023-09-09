<template>
  <v-card class="rounded-t-lg rounded-b-0">
    <v-card-title>
      <v-row no-gutters>
        Edit Gym
        <v-spacer/>
        <v-btn color="red" icon @click="softClose()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-row>
    </v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="valid">
        <v-card-title  class="ml-0 pl-0 pt-0">Owner's Information</v-card-title>
        <v-row no-gutters>
          <v-text-field v-model="data.name" :rules="[rules.required]" outlined label="Owner Name"/>
          <v-text-field v-model="data.email" :rules="[rules.required]" class="mx-2" outlined label="Owner Email"/>
          <v-text-field v-model="data.nic" :rules="[rules.required]" outlined label="Owner NIC"/>
        </v-row>


        <v-row no-gutters>
          <v-text-field v-model="data.bd_mod.day" :rules="[rules.required]" type="number" outlined label="Owner Birthday | Day" min="1" max="31"/>
          <v-text-field v-model="data.bd_mod.month" :rules="[rules.required]" class="mx-2" type="number" outlined label="Owner Birthday | Month" min="1" max="12"/>
          <v-text-field v-model="data.bd_mod.year" :rules="[rules.required]" type="number" outlined label="Owner Birthday | Year" min="1900" max="3000"/>
        </v-row>

        <v-card-title class="ml-0 pl-0 pt-0">Gym Information</v-card-title>

        <v-row no-gutters>
          <v-text-field :rules="[rules.required]" v-model="data.gym_name" outlined label="Gym Name"/>
          <v-text-field :rules="[rules.required]" :prefix="data.country_code.dial_code" class="mx-2" v-model="data.phone" outlined label="Gym Phone"/>
          <v-autocomplete :rules="[rules.required]" :items="$store.state.countries" item-text="name" return-object v-model="data.country_code" outlined label="Gym Country"/>
        </v-row>

        <v-row no-gutters>
          <v-text-field :rules="[rules.required]" v-model="data.gym_city" outlined label="Gym City"/>
          <v-autocomplete :rules="[rules.required]" :items="$store.state.currencies" item-text="name" item-value="cc" class="mx-2" v-model="data.currency" outlined label="Gym Currency"/>
          <v-text-field :rules="[rules.required]"  v-model="data.capacity" type="number" min="0" outlined label="Gym Capacity"/>
        </v-row>

        <v-text-field :rules="[rules.required]" v-model="data.gym_address" outlined label="Gym Address"/>

        <v-card-title class="ml-0 pl-0 pt-0">Gym Payments (All Values are in {{ data.currency }})</v-card-title>

        <v-row no-gutters>
          <v-text-field v-model="data.hourly_rate" label="Hourly Charge" v-if="gym.gym_type === 'exclusive'" type="number" min="1" outlined></v-text-field>
          <v-text-field v-model="data.daily_charge" label="Daily Charge" v-if="gym.gym_type !== 'exclusive'" type="number" min="1" outlined></v-text-field>
          <v-text-field class="mx-2" v-model="data.weekly_charge" label="Weekly Charge" v-if="gym.gym_type !== 'exclusive'" type="number" min="1" outlined></v-text-field>
          <v-text-field v-model="data.monthly_charge" label="Monthly Charge" v-if="gym.gym_type !== 'exclusive'" type="number" min="1" outlined></v-text-field>
        </v-row>

        <v-card-title class="ml-0 pl-0 pt-0">Gym Facilities</v-card-title>
        <v-row no-gutters>
          <v-text-field class="rounded-r-0" outlined v-model="facility" label="Add a Facility"/>
          <v-btn @click="facility.length > 0 ? data.gym_facilities.push(facility): nothing() ; facility = ''" height="56" elevation="0" color="primary" class="rounded-l-0">
            <v-icon class="mr-2">mdi-plus</v-icon> Add
          </v-btn>
        </v-row>
        <v-row no-gutters justify="start">
          <v-chip dark color="primary" close v-for="(fs,i) in data.gym_facilities" :key="i" label class="mx-1" @click:close="data.gym_facilities.splice(data.gym_facilities.indexOf(fs), 1)">
            {{ fs }}
          </v-chip>
        </v-row>
      </v-form>
    </v-card-text>

    <v-card-actions style="background: #1976d2">
      <v-spacer/>
      <v-btn @click="addNewGym" large color="white">
        <v-icon class="mr-2">mdi-check</v-icon>
        Save</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import {authClient} from "@/plugins/http";

export default {
  name: "UserDetailsHeading",
  data: () => ({
    rules: {
      required: value => !!value || 'Required.',
    },
    facility:'',
    data: {
      name:"",
      email:"",
      password:"",
      password_confirmation:"",
      role:"gym",
      phone:"",
      nic:"",
      gender:"male",
      bd_mod:{
        year: 1990,
        month: 1,
        day: 1
      },
      birthday:"", // 02/20/1999
      address:"",
      country_code:{
        name: "Maldives",
        dial_code: "+960",
        code: "MV"
      },
      currency:"",
      gym_type:"exclusive",
      gym_name:"",
      gym_address:"",
      gym_country:"",
      gym_city:"",
      capacity: 0,
      monthly_charge:0,
      weekly_charge:0,
      daily_charge:0,
      hourly_rate:0,
      about:"",
      gym_facilities:[],
    },
    valid: false,
    gender:[
      {text:'Male',value:'male'},
      {text:'Female',value:'female'}
    ]
  }),
  methods:{
    addNewGym(){
      this.$refs.form.validate();
      if(this.valid){
        this.data.birthday = this.data.bd_mod.year + "-"+ this.data.bd_mod.month + "-" + this.data.bd_mod.day;
        this.data.country_code = this.data.country_code.code;
        this.data.gym_country = this.data.country_code;
        this.data.password_confirmation = this.data.password;
        this.data.gym_type = this.type === 'EXC' ? 'exclusive' : 'normal';

        console.log(this.data);
        authClient.post('/admin/users/update-gym',this.data).then(res => {
          console.log(res);
          if(res.status === 200){
            this.$emit('close');
          } else {
            window.alert("Something went wrong. Please try again later.");
          }
        }).catch(err => {
          console.log(err);
        })
      } else {
        window.alert("Please fill all the fields");
      }

    },
    close(){
      this.$emit('close')
    },
    softClose(){
      this.$emit('soft-close')
    },
    nothing(){}
  },
  mounted() {
    let tempMod = this.gym;
    tempMod.id = this.gym.user_id;

    tempMod.bd_mod = {
      year: this.gym.user.birthday.split("-")[0],
      month: this.gym.user.birthday.split("-")[1],
      day: this.gym.user.birthday.split("-")[2]
    }

    tempMod.country_code = this.$store.state.countries.find(c => c.code === this.gym.gym_country);

    tempMod.name = this.gym.user.name;
    tempMod.email = this.gym.user.email;
    tempMod.nic = this.gym.user.nic;

    tempMod.phone = this.gym.user.phone;
    tempMod.currency = this.gym.user.currency;

    this.data = tempMod;
    console.log(this.data);



  },
  props: {
    gym:{
      type: Object,
      required: true
    }
  },
}
</script>

<style scoped>

</style>
