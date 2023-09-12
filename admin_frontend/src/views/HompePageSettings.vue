  <template>
    <v-container>
      <Breadcrumb breadcrumb_key='breadcrumb_section_01' title_head="Personal Trainer Breadcrumb" />
      <Breadcrumb breadcrumb_key='breadcrumb_section_02' title_head="Success Stories Breadcrumb"  />
      <Breadcrumb breadcrumb_key='breadcrumb_section_03' title_head="Fitness Center Breadcrumb" />
    </v-container>
  </template>
  
  <script>
  import {authClient} from "@/plugins/http";
  import Breadcrumb from "@/components/Breadcrumb.vue";
  
  export default {
    name: "HomeSettings",
    components: {Breadcrumb},
    
    mounted() {
      // this.loadData();
    }
  }
  </script>
  
  <style scoped>
  
  </style>
  
  <style>
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
    }

    .loading-spinner {
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3498db;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 2s linear infinite;
    }

    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  </style>