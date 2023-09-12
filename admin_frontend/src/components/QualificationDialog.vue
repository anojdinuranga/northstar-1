<template>
    <div>
        <v-card  class="mb-4">
            <v-card-title>Add Qualifications</v-card-title>
            <v-card-text>
                <v-text-field v-model="title" label="Title"></v-text-field>
                <v-textarea class="mx-2" label="Qualification" rows="2" v-model="description"></v-textarea>
                <v-btn @click="addField">Add Field</v-btn>
            </v-card-text>
        </v-card>
      
  
      <v-card v-for="(field, index) in fields" :key="index" class="mb-4">
        <v-card-title>
          {{ field.title }}
          <v-spacer></v-spacer>
          <v-btn @click="editField(index)">Edit</v-btn>
          <v-btn @click="deleteField(index)">Delete</v-btn>
        </v-card-title>
        <v-card-text>
          {{ field.description }}
        </v-card-text>
      </v-card>
    </div>
  </template>
  
  <script>
  export default {
    name: "QualificationDialog",
    props: {
      edited: Boolean,
      feild_data: Array,
  },
    data() {
      return {
        title: "",
        description: "",
        fields: []
      };
    },
    methods: {
      addField() {
        if (this.title && this.description) {
          this.fields.push({
            title: this.title,
            description: this.description
          });
          this.title = "";
          this.description = "";
          this.$emit('qualification-emitted', this.fields);
        }
      },
      editField(index) {
        const field = this.fields[index];
        this.title = field.title;
        this.description = field.description;
        this.deleteField(index);
      },
      deleteField(index) {
        this.fields.splice(index, 1);
        this.$emit('qualification-emitted', this.fields);
      },
    
    },
    mounted() {
      setTimeout(() => {
      if(this.edited){
        this.fields = this.feild_data
    }
      }, 200);
     
  }
  };
  </script>
  
  <style>
  /* Add your styles here */
  </style>
  