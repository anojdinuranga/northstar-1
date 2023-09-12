import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import Home from '@/views/Home.vue'
import Auth from "@/auth/Auth";
import FoodData from "@/views/FoodData";
import ExerciseBank from "@/views/ExerciseBank";
import Resources from "@/views/Resources";
import AddResourceView from "@/components/AddResourceView";
import Doctors from "@/views/Doctors";
import DoctorDetails from "@/views/DoctorDetails";
import Members from "@/views/Members";
import MemberDetails from "@/views/MemberDetails";
import Trainers from "@/views/Trainers";
import TrainerDetails from "@/views/TrainerDetails";
import ExclusiveGyms from "@/views/ExclusiveGyms";
import CommercialGyms from "@/views/CommercialGyms";
import GymDetails from "@/components/GymDetails";
import ShopManager from "@/views/ShopManager";
import ShopCategoryManager from "@/views/ShopCategoryManager";
import NewDoctors from "@/views/NewDoctors";
import SubscriptionsManager from "@/views/SubscriptionsManager";
import ManageUsers from "@/views/ManageUsers.vue";
import Newsletters from "@/views/Newsletters.vue";
import AddNewsletterView from "@/components/AddNewsletterView.vue";
import AdsManager from "@/views/AdsManager.vue";
import GymFinances from "@/components/GymFinances.vue";
import HomeSettings from "@/views/HompePageSettings.vue";
import SuccessStory from "@/views/SuccessStory.vue";
import SiteAd from "@/views/SiteAd.vue";
import PreviousProject from "@/views/PreviousProject.vue";
import ManageTherapy from "@/views/MangeTherapy.vue";
import TherapyProfile from "@/views/TherapyProfile.vue";
import TherapyHoldUser from "@/views/TherapyHoldUser.vue";

Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/auth', name: 'Auth', component: Auth },
  { path: '/members', name: 'Members', component: Members },
  { path: '/members/member-details', name: 'Member Profile Overview', component: MemberDetails, props: true },
  { path: '/trainers', name: 'Trainers', component: Trainers },
  { path: '/trainers/trainer-details', name: 'Trainer Profile Overview', component: TrainerDetails, props: true },
  { path: '/doctors', name: 'Medical Professionals', component: Doctors},
  { path: '/doctors/doctor-details', name: 'Medical Professionals Profile Overview', component: DoctorDetails, props: true},
  { path: '/doctors/new-doctors', name: 'New Medical Professionals', component: NewDoctors},
  { path: '/food-data', name: 'Food Data', component: FoodData },
  { path: '/exercise-bank', name: 'Exercise Bank', component: ExerciseBank },
  { path: '/resources', name: 'Resources', component: Resources },
  { path: '/resources/add-resources', name: 'Add Resource', component: AddResourceView, props: true },
  { path: '/newsletters', name: 'Newsletters', component: Newsletters },
  { path: '/newsletters/add-newsletter', name: 'Add Newsletter', component: AddNewsletterView, props: true },
  { path: '/exclusive-gyms', name: 'Exclusive Gyms', component: ExclusiveGyms},
  { path: '/commercial-gyms', name: 'Commercial Gyms', component: CommercialGyms},
  { path: '/gyms/:id/details', name: 'Gym Overview', component: GymDetails, props: true},
  { path: '/gyms/:id/finances', name: 'Gym Finances', component: GymFinances, props: true},
  { path: '/shop', name: 'Shop', component: ShopManager},
  { path: '/shop/categories', name: 'Shop Categories', component: ShopCategoryManager},
  { path: '/shop/orders', name: 'Orders', component: GymDetails},
  { path: '/subscriptions', name: 'Subscriptions', component: SubscriptionsManager},
  { path: '/ads-gallery', name: 'Ads Gallery', component: AdsManager},
  { path: '/manage-users', name: 'Manage Users', component: ManageUsers},
  { path: '/home-settings', name: 'Breadcrumb Manage', component: HomeSettings},
  { path: '/success-story', name: 'Success Story Manage', component: SuccessStory},
  { path: '/site-ads', name: 'Site Ads Manage', component: SiteAd},
  { path: '/previous-projects', name: 'Previous Project Manage', component: PreviousProject},
  { path: '/therapy-manage', name: 'Physio Therapy Manage', component: ManageTherapy},
  { path: '/therapy-profile', name: 'Therapy Profile', component: TherapyProfile,beforeEnter: (to, from, next) => {
    // Check if the user is allowed to access this route
        therapyGuard(next)
      }
    },
    { path: '/user-hold', name: 'User Hold', component: TherapyHoldUser,beforeEnter: (to, from, next) => {
      // Check if the user is allowed to access this route
          therapyGuard(next)
        }
      },
]

function therapyGuard(next){
  let current_user = window.localStorage.getItem('user')
        if( current_user !== null){
          try {
            if (['therapy'].includes( JSON.parse(current_user).role)) {
              next(); // Allow access
            } else {
              store.commit('deAuth')
              next('/auth'); // Redirect to the auth page
            }
          } catch (error) {
            store.commit('deAuth')
            next('/auth');
          }

        }else{
          store.commit('deAuth')
          next('/auth')
        }
}

const router = new VueRouter({
  routes,
});

export default router
