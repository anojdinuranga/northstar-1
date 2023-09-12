<template>
  <v-card>
    <v-card-title>
      <v-row no-gutters>
        <span class="headline">{{ edit ? 'Edit':'Add' }} Therapy</span>
        <v-spacer/>
        <v-btn @click="$emit('close')" icon color="red">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-row>
    </v-card-title>
    <v-divider class="mb-4"/>
    <v-card-text>
      <form @submit.prevent="saveOrUpdate()">

        <v-row no-gutters>
            <v-col
              cols="12"
            >
            <span class="err-msg" v-if="v$.name.$error">{{ v$.name.$errors[0].$message }}</span>
            <v-text-field  outlined  label="Name" class="mr-2" v-model="state.name"></v-text-field>
          </v-col> 
        </v-row>

        <v-row no-gutters>
            <v-col
              cols="12"
            >
            <span class="err-msg" v-if="v$.email.$error">{{ v$.email.$errors[0].$message }}</span>
            <v-text-field  outlined  label="Email" class="mr-2" v-model="state.email"></v-text-field>
          </v-col> 
        </v-row>

        <v-row no-gutters>
            <v-col
              cols="12"
              sm="6"
            >
            <span class="err-msg" v-if="v$.paying_type.$error">{{ v$.paying_type.$errors[0].$message }}</span>
            <v-select :selected="state.paying_type" outlined class="mr-0 mr-sm-1" label="Paying Type" v-model="state.paying_type"  item-value="value" :items="payingTypes"></v-select>
          </v-col> 
          <v-col
              v-if="state.paying_type==1"
              cols="12"
              sm="6"
            >
            <span class="err-msg" v-if="v$.hourly_rate.$error">{{ v$.hourly_rate.$errors[0].$message }}</span>
            <v-text-field  outlined label="Hourly rate" class="ml-0 ml-sm-1 mr-0 mr-sm-2" v-model="state.hourly_rate"></v-text-field>
          </v-col>
        </v-row>
        <v-row no-gutters v-if="state.paying_type==2">
          <v-col
              cols="12"
              sm="6"
            >
            <span class="err-msg" v-if="v$.session_rate.$error">{{ v$.session_rate.$errors[0].$message }}</span>
            <v-text-field  outlined label="Sessionly rate" class="ml-0 ml-sm-1 mr-0 mr-sm-2" v-model="state.session_rate"></v-text-field>
          </v-col> 
          <v-col
              cols="12"
              sm="6"
            >
            <span class="err-msg" v-if="v$.session_duration.$error">{{ v$.session_duration.$errors[0].$message }}</span>
            <v-text-field type="number" outlined label="Duration Of a Session(Min)" class="ml-0 ml-sm-1 mr-0 mr-sm-2" v-model="state.session_duration"></v-text-field>
          </v-col> 
        </v-row>

        <v-row no-gutters>
            <v-col
              cols="12"
            >
            <span class="err-msg" v-if="v$.working_type.$error">{{ v$.working_type.$errors[0].$message }}</span>
            <v-select :selected="state.working_type" outlined class="mr-0 mr-sm-1" label="Working Type" v-model="state.working_type"  item-value="value" :items="UserTypes"></v-select>
          </v-col> 
        </v-row>
        <template v-if="state.working_type==2">
              <v-tabs>
                <v-tab>Monday</v-tab>
                <v-tab-item  >
                  <v-card  class="tab-item mt-3 mb-5">
                    <v-card-text>
                      <v-row>
                      <v-switch
                        class="day-switch"
                        v-model="monday_switch"
                        hide-details
                        inset
                        label="Rest Day"
                      ></v-switch>
                      </v-row>
                      <v-row v-if="!monday_switch">
                        <v-col cols="12" sm="6">
                          <TimePicker :time_data="time_obj.mon_start_time"  :edit="isEdit" @value-emitted="handleValueEmitted($event,'mon_start_time')" title="Start Time: "></TimePicker>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <TimePicker :time_data="time_obj.mon_end_time"  :edit="isEdit" @value-emitted="handleValueEmitted($event,'mon_end_time')" title="End Time: "></TimePicker>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
                <v-tab>Tuesday</v-tab>
                <v-tab-item  >
                  <v-card  class="tab-item mt-3 mb-5">
                    <v-card-text>
                      <v-row>
                      <v-switch
                        class="day-switch"
                        v-model="tue_switch"
                        hide-details
                        inset
                        label="Rest Day"
                      ></v-switch>
                      </v-row>
                      <v-row v-if="!tue_switch">
                        <v-col cols="12" sm="6">
                          <TimePicker :time_data="time_obj.tue_start_time"  :edit="isEdit" @value-emitted="handleValueEmitted($event,'tue_start_time')" title="Start Time: "></TimePicker>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <TimePicker :time_data="time_obj.tue_end_time"  :edit="isEdit" @value-emitted="handleValueEmitted($event,'tue_end_time')" title="End Time: "></TimePicker>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
                <v-tab>Wendsday</v-tab>
                <v-tab-item  >
                  <v-card  class="tab-item mt-3 mb-5">
                    <v-card-text>
                      <v-row>
                      <v-switch
                        class="day-switch"
                        v-model="wed_switch"
                        hide-details
                        inset
                        label="Rest Day"
                      ></v-switch>
                      </v-row>
                      <v-row v-if="!wed_switch">
                        <v-col cols="12" sm="6">
                          <TimePicker :time_data="time_obj.wed_start_time"  :edit="isEdit" @value-emitted="handleValueEmitted($event,'wed_start_time')" title="Start Time: "></TimePicker>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <TimePicker :time_data="time_obj.wed_end_time"  :edit="isEdit" @value-emitted="handleValueEmitted($event,'wed_end_time')" title="End Time: "></TimePicker>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
                <v-tab>Thursday</v-tab>
                <v-tab-item  >
                  <v-card  class="tab-item mt-3 mb-5">
                    <v-card-text>
                      <v-row>
                      <v-switch
                        class="day-switch"
                        v-model="thu_switch"
                        hide-details
                        inset
                        label="Rest Day"
                      ></v-switch>
                      </v-row>
                      <v-row v-if="!thu_switch">
                        <v-col cols="12" sm="6">
                          <TimePicker :time_data="time_obj.thu_start_time"  :edit="isEdit" @value-emitted="handleValueEmitted($event,'thu_start_time')" title="Start Time: "></TimePicker>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <TimePicker :time_data="time_obj.thu_end_time"  :edit="isEdit" @value-emitted="handleValueEmitted($event,'thu_end_time')" title="End Time: "></TimePicker>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
                <v-tab>Friday</v-tab>
                <v-tab-item  >
                  <v-card  class="tab-item mt-3 mb-5">
                    <v-card-text>
                      <v-row>
                      <v-switch
                        class="day-switch"
                        v-model="fri_switch"
                        hide-details
                        inset
                        label="Rest Day"
                      ></v-switch>
                      </v-row>
                      <v-row v-if="!fri_switch">
                        <v-col cols="12" sm="6">
                          <TimePicker :time_data="time_obj.fri_start_time"  :edit="isEdit" @value-emitted="handleValueEmitted($event,'fri_start_time')" title="Start Time: "></TimePicker>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <TimePicker :time_data="time_obj.fri_end_time"  :edit="isEdit" @value-emitted="handleValueEmitted($event,'fri_end_time')" title="End Time: "></TimePicker>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
                <v-tab>Satureday</v-tab>
                <v-tab-item  >
                  <v-card  class="tab-item mt-3 mb-5">
                    <v-card-text>
                      <v-row>
                      <v-switch
                        class="day-switch"
                        v-model="sat_switch"
                        hide-details
                        inset
                        label="Rest Day"
                      ></v-switch>
                      </v-row>
                      <v-row v-if="!sat_switch">
                        <v-col cols="12" sm="6">
                          <TimePicker :time_data="time_obj.sat_start_time"  :edit="isEdit" @value-emitted="handleValueEmitted($event,'sat_start_time')" title="Start Time: "></TimePicker>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <TimePicker :time_data="time_obj.sat_end_time"  :edit="isEdit" @value-emitted="handleValueEmitted($event,'sat_end_time')" title="End Time: "></TimePicker>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
                <v-tab>Sunday</v-tab>
                <v-tab-item  >
                  <v-card  class="tab-item mt-3 mb-5">
                    <v-card-text>
                      <v-row>
                      <v-switch
                        class="day-switch"
                        v-model="sun_switch"
                        hide-details
                        inset
                        label="Rest Day"
                      ></v-switch>
                      </v-row>
                      <v-row v-if="!sun_switch">
                        <v-col cols="12" sm="6">
                          <TimePicker :time_data="time_obj.sun_start_time"  :edit="isEdit" @value-emitted="handleValueEmitted($event,'sun_start_time')" title="Start Time: "></TimePicker>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <TimePicker :time_data="time_obj.sun_end_time"  :edit="isEdit" @value-emitted="handleValueEmitted($event,'sun_end_time')" title="End Time: "></TimePicker>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
              </v-tabs>
        </template> 
        
        <v-row no-gutters>
            <v-col
              cols="12"
              sm="6"
            >
            <span class="err-msg" v-if="v$.password.$error">{{ v$.password.$errors[0].$message }}</span>
            <v-text-field type="password"  outlined  label="Password" class="mr-0 mr-sm-1" v-model="state.password"></v-text-field>
          </v-col> 
          <v-col
              sm="6"
            >
            <span class="err-msg" v-if="v$.c_password.$error">{{ v$.c_password.$errors[0].$message }}</span>
            <v-text-field type="password" outlined  label="Confirm Password" class="ml-0 ml-sm-1 mr-0 mr-sm-2" v-model="state.c_password"></v-text-field>
          </v-col> 
        </v-row>
        <QualificationDialog :edited="isEdit" @qualification-emitted="handleValueQualification($event)" :feild_data="qualification_arr"  />
        <v-row no-gutters>
            <v-col
              cols="12"
            >
            <span class="err-msg" v-if="v$.phone.$error">{{ v$.phone.$errors[0].$message }}</span>
            <v-text-field  outlined  label="Phone" class="mr-2" v-model="state.phone"></v-text-field>
          </v-col> 
        </v-row>

        <v-row no-gutters>
            <v-col
              cols="12"
            >
            <span class="err-msg" v-if="v$.nic_no.$error">{{ v$.nic_no.$errors[0].$message }}</span>
            <v-text-field  outlined  label="NIC" class="mr-2" v-model="state.nic_no"></v-text-field>
          </v-col> 
        </v-row>

        <v-row no-gutters>
            <v-col
              cols="12"
              sm="6"
            >
            <template >
              <div class="mr-0 mr-sm-3">
                <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="date"
                      label="Birthday date"
                      prepend-icon="mdi-calendar"
                      readonly
                      outlined
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="date"
                    :active-picker.sync="activePicker"
                    :max="(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substring(0, 10)"
                    min="1950-01-01"
                    @change="save"
                  ></v-date-picker>
                </v-menu>
              </div>
            </template>
          </v-col> 
          <v-col
              sm="6"
            >
            <span class="err-msg" v-if="v$.gender.$error">{{ v$.gender.$errors[0].$message }}</span>
            <v-select class="ml-0 ml-sm-1 mr-0 mr-sm-2 rounded-lg"  v-model="state.gender" :items="gender"  outlined label="Gender" ></v-select>
          </v-col> 
        </v-row>

        <v-row no-gutters>
          <v-col
              sm="12"
            >
            <span class="err-msg" v-if="v$.country.$error">{{ v$.country.$errors[0].$message }}</span>
            <v-select class="ml-0 ml-sm-1 mr-0 mr-sm-2 rounded-lg" item-text="name"
              item-value="code"  :items="$store.state.countries"  v-model="state.country" outlined label="Country" ></v-select>
          </v-col> 
        </v-row>

      <v-row justify="end" no-gutters>
        <v-btn type="submit" :loading="loading"  width="128" elevation="0"  height="56" color="primary">Save</v-btn>
      </v-row>
    </form>
    </v-card-text>
  </v-card>
</template>

<script>
import {authClient} from "@/plugins/http";
import useValidate from '@vuelidate/core'
import { required,numeric, maxLength, sameAs,minLength, email, requiredIf } from '@vuelidate/validators'
import { reactive, computed } from "vue";
import TimePicker from "@/components/TimePicker.vue";
import QualificationDialog from "@/components/QualificationDialog.vue";


export default {
  setup(){
    const state = reactive({
      name: "",
      email: "",
      working_type: "1",
      hourly_rate: "",
      password: "",
      phone: "",
      gender:"",
      country:"",
      nic_no: "",
      c_password: "",
      paying_type:"1",
      session_rate:"",
      session_duration:"",
    })

    const rules = computed(()=>{
      
      return { 
          phone: { required, maxLength:maxLength(20) },
          nic_no:{ required, maxLength:maxLength(30) },
          name: { required, maxLength:maxLength(200) },
          email: { email, required},
          gender: {  required},
          country: {  required},
          working_type: { required,numeric},
          paying_type: { required,numeric},
          hourly_rate: { numeric},
          session_rate: { numeric},
          session_duration: { numeric},
          password :  {  minLength: minLength(8), maxLength:maxLength(100)},
          c_password: {  maxLength:maxLength(100), minLength:minLength(8), sameAsPassword: sameAs(state.password),},
        }
    })

    
    const v$ =  useValidate(rules, state)

    return {
      v$,
      state
    }
  },
  name: "SuccessStoryDialog",
  components: {TimePicker, QualificationDialog},
  props: {
    edit: Boolean,
    therapy: Object,
    domain:String
  },
  watch: {
      menu (val) {
        val && setTimeout(() => (this.activePicker = 'YEAR'))
      },
    },
  data: () => ({
    activePicker: null,
    date: null,
    menu: false,
    UserTypes: [
    { text: 'Full Time', value: '1'},
    { text: 'Specific Time', value: '2'}
  ],
  payingTypes: [
    { text: 'Per Hour', value: '1'},
    { text: 'Per Session', value: '2'}
  ],
  gender:[
      {text:'Male',value:'male'},
      {text:'Female',value:'female'}
    ],
  qualification_arr:[],
  time: null,
      menu2: false,
      modal2: false,
    loading: false,
    title: '',
    isEdit:false,
    monday_switch:false,
    tue_switch:false,
    wed_switch:false,
    thu_switch:false,
    fri_switch:false,
    sat_switch:false,
    sun_switch:false,
    time_obj : {
      mon_start_time:null,
      mon_end_time:null,
      tue_start_time:null,
      tue_end_time:null,
      wed_start_time:null,
      wed_end_time:null,
      thu_start_time:null,
      thu_end_time:null,
      fri_start_time:null,
      fri_end_time:null,
      sat_start_time:null,
      sat_end_time:null,
      sun_start_time:null,
      sun_end_time:null,
    }
  }),
  methods:{
    handleValueEmitted(value, type) {
      this.time_obj[type] =  value;
  },
  handleValueQualification(value){
    this.qualification_arr = value
  },
    submitForm(){
      this.v$.$validate()
      if (!this.v$.$error) {
        this.loading = true;

        let final_time_list = [
              { "day" :"1", "start_time" : this.time_obj["mon_start_time"], "end_time" : this.time_obj["mon_end_time"] , "disabled":this.monday_switch},
              { "day" :"2", "start_time" : this.time_obj["tue_start_time"], "end_time" : this.time_obj["tue_end_time"] , "disabled":this.tue_switch},
              { "day" :"3", "start_time" : this.time_obj["wed_start_time"], "end_time" : this.time_obj["wed_end_time"] , "disabled":this.wed_switch},
              { "day" :"4", "start_time" : this.time_obj["thu_start_time"], "end_time" : this.time_obj["thu_end_time"] , "disabled":this.thu_switch},
              { "day" :"5", "start_time" : this.time_obj["fri_start_time"], "end_time" : this.time_obj["fri_end_time"] , "disabled":this.fri_switch},
              { "day" :"6", "start_time" : this.time_obj["sat_start_time"], "end_time" : this.time_obj["sat_end_time"] , "disabled":this.sat_switch},
              { "day" :"7", "start_time" : this.time_obj["sun_start_time"], "end_time" : this.time_obj["sun_end_time"] , "disabled":this.sun_switch},
        ]

        authClient.post('/therapy/add',{
              'name' : this.state.name,
              'email' : this.state.email,
              'working_type' : this.state.working_type,
              'paying_type' : this.state.paying_type,
              'session_rate' : this.state.paying_type == "2" ? this.state.session_rate : null,
              'session_duration' : this.state.paying_type == "2" ? this.state.session_duration : null,
              'hourly_rate' : this.state.paying_type == "1" ?  this.state.hourly_rate : null,
              'password' : this.state.password,
              'phone' : this.state.phone,
              'nic' : this.state.nic_no,
              'country' : this.state.country,
              'gender' : this.state.gender,
              'birthday' : this.date,
              'working_time' : this.state.working_type == 2 ? final_time_list : undefined,
              'qualification' : this.qualification_arr
        })
        .then((response) => {
            this.loading = false;
            // this.loadData()
            let response_data = response.data[0]
            if(response_data.status){
            this.$emit('close');
              this.$toast.success({
                title: 'Ok',
                message: response_data.message,
            });
            }else{
              this.loading = false;
              this.$toast.error({
                title: 'error',
                message: response_data.message[0],
            });
            }
          }).catch((error) => {
            console.log(error)
            this.loading = false;
            this.$toast.error({
                title: 'error',
                message: 'error',
            });
          });
    }else{
      this.loading = false;
    }
    },
    updateForm(){
      this.v$.$validate()

      if (!this.v$.$error) {
        this.loading = true;

        let final_time_list = [
              { "day" :"1", "start_time" : this.time_obj["mon_start_time"], "end_time" : this.time_obj["mon_end_time"] , "disabled":this.monday_switch},
              { "day" :"2", "start_time" : this.time_obj["tue_start_time"], "end_time" : this.time_obj["tue_end_time"] , "disabled":this.tue_switch},
              { "day" :"3", "start_time" : this.time_obj["wed_start_time"], "end_time" : this.time_obj["wed_end_time"] , "disabled":this.wed_switch},
              { "day" :"4", "start_time" : this.time_obj["thu_start_time"], "end_time" : this.time_obj["thu_end_time"] , "disabled":this.thu_switch},
              { "day" :"5", "start_time" : this.time_obj["fri_start_time"], "end_time" : this.time_obj["fri_end_time"] , "disabled":this.fri_switch},
              { "day" :"6", "start_time" : this.time_obj["sat_start_time"], "end_time" : this.time_obj["sat_end_time"] , "disabled":this.sat_switch},
              { "day" :"7", "start_time" : this.time_obj["sun_start_time"], "end_time" : this.time_obj["sun_end_time"] , "disabled":this.sun_switch},
        ]

        authClient.post('/therapy/update',{
              'userId':this.therapy.user_id,
              'therapyId':this.therapy.therapy_Id,
              'name' : this.state.name,
              'email' : this.state.email,
              'working_type' : this.state.working_type,
              'paying_type' : this.state.paying_type,
              'session_rate' : this.state.paying_type == "2" ? this.state.session_rate : null,
              'session_duration' : this.state.paying_type == "2" ? this.state.session_duration : null,
              'hourly_rate' : this.state.paying_type == "1" ?  this.state.hourly_rate : null,
              'password' : this.state.password,
              'phone' : this.state.phone,
              'nic' : this.state.nic_no,
              'country' : this.state.country,
              'gender' : this.state.gender,
              'birthday' : this.date,
              'working_time' : this.state.working_type == 2 ? final_time_list : undefined,
              'qualification' : this.qualification_arr
        })
        .then((response) => {
            this.loading = false;
            // this.loadData()
            let response_data = response.data[0]
            if(response_data.status){
              this.$emit('close');
              this.$toast.success({
                title: 'Ok',
                message: response_data.message,
            });
            }else{
              this.loading = false;
              this.$toast.error({
                title: 'error',
                message: response_data.message[0],
            });
            }
          }).catch((error) => {
            console.log(error)
            this.loading = false;
            this.$toast.error({
                title: 'error',
                message: 'error',
            });
          });
      }else{
        this.loading = false;
      }
    },
    save (date) {
        this.$refs.menu.save(date)
      },
    saveOrUpdate(){
      this.loading = true;
      if(this.edit) {
        this.updateForm();
      } else {
        this.submitForm();
      }
    }
  },
  mounted() {
    if(this.edit){
      this.isEdit = true
      this.state.name = this.therapy.name;
      this.state.gender = this.therapy.gender;
      this.state.country = this.therapy.country_code;
      this.date = this.therapy.birthday;
      this.state.email = this.therapy.email;
      this.state.working_type = `${this.therapy.working_type}`;
      this.state.paying_type = `${this.therapy.paying_type}`;
      this.state.hourly_rate = this.therapy.paying_type == 1? this.therapy.hourly_rate : "";
      this.state.phone = this.therapy.phone;
      this.state.nic_no = this.therapy.nic_no;
      this.state.session_rate = this.therapy.paying_type == 2? this.therapy.session_rate : "";
      this.state.session_duration = this.therapy.paying_type == 2? this.therapy.session_duration : "";
      this.qualification_arr = this.therapy.therapy__qualifications
      

      let final_time_list = [
              { "day" :"1", "start_time" : "mon_start_time", "end_time" : "mon_end_time" , "disabled":"monday_switch"},
              { "day" :"2", "start_time" : "tue_start_time", "end_time" : "tue_end_time" , "disabled":"tue_switch"},
              { "day" :"3", "start_time" : "wed_start_time", "end_time" : "wed_end_time" , "disabled":"wed_switch"},
              { "day" :"4", "start_time" : "thu_start_time", "end_time" : "thu_end_time" , "disabled":"thu_switch"},
              { "day" :"5", "start_time" : "fri_start_time", "end_time" : "fri_end_time" , "disabled":"fri_switch"},
              { "day" :"6", "start_time" : "sat_start_time", "end_time" : "sat_end_time" , "disabled":"sat_switch"},
              { "day" :"7", "start_time" : "sun_start_time", "end_time" : "sun_end_time" , "disabled":"sun_switch"},
        ]

      if(this.therapy.working_type == 1){
        return
      }

      final_time_list.map(main_item=>{
        this.therapy.therapy_working_hours.map(item=>{
          if(main_item.day == item.day){
             this.time_obj[main_item["start_time"]] = item.start_time
             this.time_obj[main_item["end_time"]] = item.end_time
             this[main_item.disabled] = item.rest_day == 1? true : false
          }
        })

      })

    }
  }
}
</script>


<style scoped>

  .tab-item{
    border: 1px solid #919191;
    border-bottom: 0px;
  }

  .day-switch{
    padding-left: 10px;
    padding-bottom: 20px;
  }


  .err-msg{
    color: red;
  }

  .loading-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* Adjust the opacity as needed */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 99999999;
  }

  .d-none{
    display: none;
  }


</style>
