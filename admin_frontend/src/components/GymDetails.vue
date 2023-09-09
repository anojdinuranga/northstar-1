<template>
  <v-container>
    <v-progress-linear indeterminate v-if="loading"></v-progress-linear>
    <v-col v-if="!loading" >
      <UserDetailsHeading @close="getGymFromServer" :data="getUserData()" :gym="gym" class="mb-4"/>
      <v-divider class="mb-4"/>


      <v-row no-gutters>
        <v-col class="pr-2" cols="4">
          <v-row no-gutters v-if="gym.gym_type === 'exclusive'">
            <v-card height="100" width="180" outlined class="rounded-r-0">
              <v-card-subtitle>Hourly Rate</v-card-subtitle>
              <v-card-title class="pt-0 pb-0">{{ gym.user.currency }} {{ gym.hourly_rate }}/=</v-card-title>
            </v-card>
            <v-card width="180" outlined class="rounded-l-0">
              <v-card-subtitle>Live Capacity</v-card-subtitle>
              <v-card-title class="pt-0 pb-0">- / {{ gym.capacity }}</v-card-title>
            </v-card>
          </v-row>

          <v-row no-gutters v-if="gym.gym_type === 'normal'">
            <v-card width="100%" outlined class="rounded-r-0">
              <v-card-subtitle>Charging Plans</v-card-subtitle>
              <v-card-title class="pt-0 pb-0">{{ gym.user.currency }} {{ gym.daily_charge }} / Day</v-card-title>
              <v-card-title class="pt-0 pb-0">{{ gym.user.currency }} {{ gym.weekly_charge }} / Week</v-card-title>
              <v-card-title class="pt-0">{{ gym.user.currency }} {{ gym.monthly_charge }} / Month</v-card-title>
            </v-card>
          </v-row>

          <v-card-title class="pl-0">Facilities</v-card-title>
          <ul>
            <li v-for="(fs,i) in gym.gym_facilities" :key="i">{{ fs }}</li>
          </ul>


          <v-card-title class="pl-0">
            Gallery
            <v-spacer/>
            <v-btn @click="imageUpload = true;image = null" color="primary" icon>
              <v-icon>mdi-plus-circle</v-icon>
            </v-btn>
          </v-card-title>
          <v-row no-gutters>
            <v-card color="primary" outlined class="ma-1 rounded-lg" v-for="(gs,i) in gym.gallery" :key="i" height="128" width="128">
              <v-img class="rounded-lg rounded-b-0" width="128" height="90" :src="$store.state.s3ResourcesBaseUrl + 'gym-galleries/'+ gs.image_path"></v-img>
              <v-row no-gutters justify="center">
                <v-btn target="_blank" :href="$store.state.s3ResourcesBaseUrl + 'gym-galleries/' + gs.image_path" color="white" icon>
                  <v-icon>mdi-open-in-new</v-icon>
                </v-btn>
                <v-btn @click="deleteGalleryItem(gs)" color="white" icon>
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-row>
            </v-card>
          </v-row>
        </v-col>


        <v-col cols="8">
          <v-row align="center" justify="space-between" no-gutters>
                <v-btn
                    outlined
                    class="mr-4"
                    color="grey darken-2"
                    @click="setToday"
                >
                  Today
                </v-btn>
                <v-btn
                    fab
                    text
                    small
                    color="grey darken-2"
                    @click="prev"
                >
                  <v-icon small>
                    mdi-chevron-left
                  </v-icon>
                </v-btn>
                <v-btn
                    fab
                    text
                    small
                    color="grey darken-2"
                    @click="next"
                >
                  <v-icon small>
                    mdi-chevron-right
                  </v-icon>
                </v-btn>
                <v-toolbar-title v-if="$refs.calendar">
                  {{ $refs.calendar.title }}
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-menu
                    bottom
                    right
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        outlined
                        color="grey darken-2"
                        v-bind="attrs"
                        v-on="on"
                    >
                      <span>{{ typeToLabel[type] }}</span>
                      <v-icon right>
                        mdi-menu-down
                      </v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item @click="type = 'day'">
                      <v-list-item-title>Day</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="type = 'week'">
                      <v-list-item-title>Week</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="type = 'month'">
                      <v-list-item-title>Month</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="type = '4day'">
                      <v-list-item-title>4 days</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
          </v-row>

          <v-calendar
              :type="type"
              ref="calendar"
              v-model="focus"
              color="primary"


              :event-color="getEventColor"
              @click:more="viewDay"
              @click:date="viewDay"
              @change="updateRange"
            ></v-calendar>
<!--          <v-calendar
              ref="calendar"
              v-model="value"
              :weekdays="weekday"
              :type="type"
              :events="events"
              :event-overlap-mode="mode"
              :event-overlap-threshold="30"
              :event-color="getEventColor"
              @change="getEvents"
          ></v-calendar>-->
        </v-col>
      </v-row>



    </v-col>

    <v-bottom-sheet inset persistent v-if="imageUpload" v-model="imageUpload">
      <v-card class="rounded-t-lg rounded-b-0">
        <v-card-title>
          <v-row no-gutters>
            Add Gym Image
            <v-spacer/>
            <v-btn v-if="!imageUploadLoading" color="red" icon @click="imageUpload = false;image = null">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-row>
        </v-card-title>
        <v-card-text>
          <v-file-input
              v-model="image"
              accept="image/*"
              label="Upload Image"
              prepend-icon=""
              prepend-inner-icon="mdi-camera"
              show-size
              outlined></v-file-input>
        </v-card-text>

        <v-card-actions>
          <v-spacer/>
          <v-btn @click="saveImage" :loading="imageUploadLoading" dark large color="primary">
            <v-icon class="mr-2">mdi-check</v-icon>
            Upload and Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-bottom-sheet>

  </v-container>
</template>

<script>
import UserDetailsHeading from "@/components/UserDetailsHeading";
import {authClient} from "@/plugins/http";
export default {
  name: "GymDetails",
  components: {UserDetailsHeading},
  data: () => ({
    loading: true,
    image:null,
    imageUpload:false,
    imageUploadLoading:false,
    type: 'month',
    types: ['month', 'week', 'day', '4day'],
    mode: 'stack',
    modes: ['stack', 'column'],
    weekday: [0, 1, 2, 3, 4, 5],
    focus: '',
    typeToLabel: {
      month: 'Month',
      week: 'Week',
      day: 'Day',
      '4day': '4 Days',
    },
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    weekdays: [
      { text: 'Sun - Sat', value: [0, 1, 2, 3, 4, 5, 6] },
      { text: 'Mon - Sun', value: [1, 2, 3, 4, 5, 6, 0] },
      { text: 'Mon - Fri', value: [1, 2, 3, 4, 5] },
      { text: 'Mon, Wed, Fri', value: [1, 3, 5] },
    ],
    value: '',
    events: [],
    colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
    names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
    gym: {},
  }),
  methods:{
    getUserData(){
      return {
        id: this.gym.user.id,
        name: this.gym.gym_name,
        email: this.gym.user.email,
        phone: this.gym.user.phone,
        address: this.gym.address,
        avatar_url: this.gym.user.avatar_url,
        role: this.gym.user.role,
      }
    },
    getGymFromServer(){
      this.loading = true;
      authClient.get('/gyms/actions/'+this.$route.params.id+'/get').then(res=>{
        this.gym = res.data;
        console.log(res.data);
        this.loading = false;
      }).catch(err=>{
        this.loading = false;
        console.log(err);
      });
    },
    deleteGalleryItem(item){
      let result = window.prompt("Are you sure you want to delete this image? Type 'YES' to confirm");
      if(result === 'YES'){
        authClient.post('/users/file-uploads/delete-file', {
          filePath: item.image_path
        }).then(rs => {
          console.log(rs);
          authClient.post('/admin/gyms/delete-gallery-item',{
            id: item.id
          }).then(rs => {
            console.log(rs);
            this.getGymFromServer();
          })
        });
      }
    },
    saveImage(){
      if(this.image !== null){
        this.imageUploadLoading = true;
        let data = new FormData();
        data.append('image',this.image);
        data.append('id',this.gym.user_id);
        authClient.post('/users/file-uploads/gym-gallery',data)
            .then(res => {
              console.log(res);
              this.imageUploadLoading = false;
              this.imageUpload = false;
              this.image = null;
              this.getGymFromServer();
            })
            .catch(err => {
              this.imageUploadLoading = false;
              this.imageUpload = false;
              this.image = null;
              this.getGymFromServer();
            })
      } else {
        window.alert('Please select an image');
      }
    },

    getEventColor (event) {
      return event.color
    },
    getEvents ({ start, end }) {
      const events = []

      const min = new Date(`${start.date}T00:00:00`)
      const max = new Date(`${end.date}T23:59:59`)
      const days = (max.getTime() - min.getTime()) / 86400000
      const eventCount = this.rnd(days, days + 20)

      for (let i = 0; i < eventCount; i++) {
        const allDay = this.rnd(0, 3) === 0
        const firstTimestamp = this.rnd(min.getTime(), max.getTime())
        const first = new Date(firstTimestamp - (firstTimestamp % 900000))
        const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000
        const second = new Date(first.getTime() + secondTimestamp)

        events.push({
          name: this.names[this.rnd(0, this.names.length - 1)],
          start: first,
          end: second,
          color: this.colors[this.rnd(0, this.colors.length - 1)],
          timed: !allDay,
        })
      }

      this.events = events
    },
    rnd (a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a
    },
    viewDay ({ date }) {
      this.focus = date
      this.type = 'day'
    },
    setToday () {
      this.focus = ''
    },
    prev () {
      this.$refs.calendar.prev()
    },
    next () {
      this.$refs.calendar.next()
    },
    updateRange ({ start, end }) {
      const events = []

      const min = new Date(`${start.date}T00:00:00`)
      const max = new Date(`${end.date}T23:59:59`)
      const days = (max.getTime() - min.getTime()) / 86400000
      const eventCount = this.rnd(days, days + 20)

      for (let i = 0; i < eventCount; i++) {
        const allDay = this.rnd(0, 3) === 0
        const firstTimestamp = this.rnd(min.getTime(), max.getTime())
        const first = new Date(firstTimestamp - (firstTimestamp % 900000))
        const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000
        const second = new Date(first.getTime() + secondTimestamp)

        events.push({
          name: this.names[this.rnd(0, this.names.length - 1)],
          start: first,
          end: second,
          color: this.colors[this.rnd(0, this.colors.length - 1)],
          timed: !allDay,
        })
      }

      this.events = events
    },
  },
  mounted() {
    if(this.$store.state.user.role === 'gym'){
      if(this.$router.currentRoute.path !== '/gyms/' + this.$store.state.user.id + '/details'){
        this.$router.push('/gyms/' + this.$store.state.user.id + '/details');
      }
    }
    this.getGymFromServer();
    //this.$refs.calendar.checkChange();
  },
}
</script>

<style scoped>

</style>
