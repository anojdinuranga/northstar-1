<template>
  <v-app v-if="$store.state.user != null">
    <v-app-bar v-if="$route.path !== '/auth'" flat app>
      <v-btn v-if="$route.fullPath.split('/').length > 2 && this.$store.state.user.role !== 'gym'" icon @click="$router.back()" color="black">
        <v-icon>mdi-arrow-left-circle</v-icon>
      </v-btn>
      <v-card-title>{{ $route.name }}</v-card-title>
      <v-spacer/>
      <v-col cols="auto">
        <span class="font-weight-bold">{{  $store.state.user.name }}</span> <br>
        {{  $store.state.user.role.toUpperCase() }}
      </v-col>
      <v-divider class="mr-2" vertical/>
      <v-avatar>
        <v-img :src="$store.state.s3BaseUrl + $store.state.user.avatar_url"/>
      </v-avatar>
      <v-btn color="red" icon @click="$store.commit('deAuth')">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-if="$route.path !== '/auth' && ['admin','moderator'].includes($store.state.user.role)" width="280" color="#f2f2f2" app permanent class="pr-4">
      <div class="d-flex justify-center">
        <v-img height="128" width="260" contain src="@/assets/allblack.png" max-width="200" max-height="200"></v-img>
      </div>

      <v-list-item v-if="shouldRestrict(menu)" active-class="sideMenu-active" v-for="(menu,i) in sideMenu" :key="i" color="transparent"
                   class="sideMenu rounded" :to="menu.to">
        <v-list-item-icon>
          <v-icon color="black">{{ menu.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-title class="black--text">{{ menu.title }}</v-list-item-title>
      </v-list-item>
    </v-navigation-drawer>


    <v-navigation-drawer v-if="$route.path !== '/auth' && $store.state.user.role === 'therapy'" width="280" color="#f2f2f2" app permanent class="pr-4">
      <div class="d-flex justify-center">
        <v-img height="128" width="260" contain src="@/assets/allblack.png" max-width="200" max-height="200"></v-img>
      </div>

      <v-list-item active-class="sideMenu-active" v-for="(menu,i) in sideMenuGym" :key="i" color="transparent"
                   class="sideMenu rounded" :to="menu.to">
        <v-list-item-icon>
          <v-icon color="black">{{ menu.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-title class="black--text">{{ menu.title }}</v-list-item-title>
      </v-list-item>
    </v-navigation-drawer>


    <v-navigation-drawer v-if="$route.path !== '/auth' && $store.state.user.role === 'gym'" width="280" color="#f2f2f2" app permanent class="pr-4">
      <div class="d-flex justify-center">
        <v-img height="128" width="260" contain src="@/assets/allblack.png" max-width="200" max-height="200"></v-img>
      </div>

      <v-list-item active-class="sideMenu-active" v-for="(menu,i) in sideMenuGym" :key="i" color="transparent"
                   class="sideMenu rounded" :to="menu.to">
        <v-list-item-icon>
          <v-icon color="black">{{ menu.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-title class="black--text">{{ menu.title }}</v-list-item-title>
      </v-list-item>
    </v-navigation-drawer>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    pathForGym:'',
    restrictedItems: [
      '/manage-users',
      '/subscriptions',
      '/commercial-gyms',
      '/commercial-gyms',
      '/members',
      '/trainers',
      '/doctors'
    ],
    sideMenuGym:[
      {
        title: 'Gym Manager',
        icon: 'mdi-dumbbell',
        to: ''
      },
      {
        title: 'Finances',
        icon: 'mdi-account-group',
        to: ''
      },
    ],
    sideMenu: [
      {
        title: 'Members',
        icon: 'mdi-account-group',
        to: '/members'
      },
      {
        title: 'Trainers',
        icon: 'mdi-account-tie',
        to: '/trainers'
      },
      {
        title: 'Medical Professionals',
        icon: 'mdi-doctor',
        to: '/doctors'
      },
      {
        title: 'Food Data',
        icon: 'mdi-food',
        to: '/food-data'
      },
      {
        title: 'Exercise Bank',
        icon: 'mdi-dumbbell',
        to: '/exercise-bank'
      },
      {
        title: 'Resources',
        icon: 'mdi-book',
        to: '/resources'
      },
      {
        title: 'Newsletters',
        icon: 'mdi-email-newsletter',
        to: '/newsletters'
      },
      {
        title: 'Exclusive Gyms',
        icon: 'mdi-weight-lifter',
        to: '/exclusive-gyms'
      },
      {
        title: 'Commercial Gyms',
        icon: 'mdi-weight-lifter',
        to: '/commercial-gyms'
      },
      {
        title: 'Shop Manager',
        icon: 'mdi-store',
        to: '/shop'
      },
      {
        title: 'Ads Gallery',
        icon: 'mdi-view-gallery-outline',
        to: '/ads-gallery'
      },
      {
        title: 'Subscriptions',
        icon: 'mdi-currency-usd',
        to: '/subscriptions'
      },
      {
        title: 'Manage Users',
        icon: 'mdi-account-group',
        to: '/manage-users'
      },
      {
        title: 'Manage Breadcrumbs',
        icon: 'mdi-account-group',
        to: '/home-settings'
      },
      {
        title: 'Success Story Manage',
        icon: 'mdi-account-group',
        to: '/success-story'
      },
      {
        title: 'Site Ads Manage',
        icon: 'mdi-account-group',
        to: '/site-ads'
      },
      {
        title: 'Previous Project Manage',
        icon: 'mdi-account-group',
        to: '/previous-projects'
      }

    ]
  }),
  methods:{
    shouldRestrict(item){
      if(this.$store.state.user.role === 'admin'){
        return true
      } else {
        if(this.restrictedItems.includes(item.to)){
          return false
        } else {
          return true
        }
      }
    }
  },
  mounted() {
      this.sideMenuGym[0].to = '/gyms/' + this.$store.state.user.id + '/details';
      this.sideMenuGym[1].to = '/gyms/' + this.$store.state.user.id + '/finances';
  },
  beforeMount() {
    this.$store.commit('setLocalAuth');
  },
};
</script>

<style scoped lang="scss">
.sideMenu {
  transition: all 0.5s ease;
  border-radius: 32px !important;
  margin: 4px !important;
}

.sideMenu:hover {
  background: #ffa200;
  transition: all 0.5s ease;
  border-radius: 32px !important;
  margin: 4px !important;
}

.sideMenu-active {
  background: #ffa200;
  border-radius: 32px !important;
  transition: all 0.5s ease;
  margin: 4px !important;
}
</style>
