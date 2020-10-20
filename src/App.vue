<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-toolbar-title>Driver Trip Tracker</v-toolbar-title>
      </div>

      <v-spacer></v-spacer>

      <input type="file" @change="upload" ref="file" style="display: none" accept="text/plain">
      <v-btn
        text
        @click="$refs.file.click()"
        :disabled="loading"
      >
        <span class="mr-2">Upload</span>
        <v-icon>mdi-cloud-upload</v-icon>
      </v-btn>
      <v-btn
        text
        @click="clear"
        color="error"
        :disabled="loading"
      >
        <span class="mr-2">Clear</span>
        <v-icon>mdi-delete-forever</v-icon>
      </v-btn>
    </v-app-bar>
    

    <v-main>
      <v-expand-transition>
      <v-alert
        dense
        text
        v-if="message.text"
        :type="message.type"
      >
        <v-row align="center" no-gutters >
          <v-col class="grow"> {{ message.text }} </v-col>
          <v-spacer></v-spacer>
          <v-col class="shrink">
            <v-btn @click="message = {}" :color="message.type" outlined >
              Okay
            </v-btn>
          </v-col>
        </v-row>
      </v-alert>
      </v-expand-transition>

      <div style="min-height: 4px;">
      <v-progress-linear
          indeterminate
          v-if="loading"
          color="yellow darken-2"
          :active="loading"
        ></v-progress-linear>
      </div>

      <div class="pa-6">
        <v-row no-gutters>
          <v-col cols="6" class="pl-6"><h3>Name</h3></v-col>
          <v-col cols="2"><h3>Time</h3></v-col>
          <v-col cols="2"><h3>Distance</h3></v-col>
          <v-col cols="2"><h3>Speed</h3></v-col>
        </v-row>
        <v-expansion-panels
          multiple
          v-for="userTrips in allTrips"
          :key="userTrips._id"
          :readonly="userTrips.trips.length <= 0"
        >
          <v-expansion-panel>
            <v-expansion-panel-header>
              <v-row>
                <v-col cols="6">{{ userTrips.name }}</v-col>
                <v-col cols="2" class="pl-6">{{ userTrips.totalTripTime + ' hour(s)' || 0}}</v-col>
                <v-col cols="2" class="pl-6">{{ userTrips.totalDistance + ' miles' || 0}}</v-col>
                <v-col cols="2" class="pl-8">{{ userTrips.totalSpeed + ' mph' || 0}}</v-col>
              </v-row>
            </v-expansion-panel-header>
            <v-expansion-panel-content v-if="userTrips.trips.length > 0">
              <v-simple-table>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">
                        Trip Start Time
                      </th>
                      <th class="text-left">
                        Trip End Time
                      </th>
                      <th class="text-left">
                        Time
                      </th>
                      <th class="text-left">
                        Distance
                      </th>
                      <th class="text-left">
                        Speed
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="trip in userTrips.trips"
                      :key="trip._id"
                    >
                      <td>{{ trip.startTime }}</td>
                      <td>{{ trip.endTime }}</td>
                      <td>{{ trip.time + ' hour(s)'}}</td>
                      <td>{{ trip.distance + ' miles'}}</td>
                      <td>{{ trip.speed + ' mph' }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios';

export default {
  name: 'App',

  components: {
  },

  data () {
    return {
      allTrips: null,
      message: {
        type: '',
        text: ''
      },
      loading: false
    }
  },
  mounted () {
    this.trips();
  },
  methods: {
    upload (event) {
      this.loading = true;
      const formData = new FormData();
      const tripFile = event.target.files[0];
      formData.append("file", tripFile);
      axios
        .post(process.env.VUE_APP_API_HOST + 'trips/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' }})
        .then(response => {
          this.trips();
          this.message.type = 'success';
          this.message.text = response.data.message;
          this.loading = false;
          this.$refs.file.value = null;
        })
        .catch(err => {
          console.log(err);
          this.message.type = 'error';
          this.message.text = 'Sorry, unable to process your upload.';
          this.loading = false;
        });
    },
    trips () {
      this.loading = true;
      axios
      .get(process.env.VUE_APP_API_HOST + 'trips')
      .then(response => {
        this.allTrips = response.data;
        this.loading = false;
      })
      .catch(err => {
        console.log(err);
        this.message.type = 'error';
        this.message.text = 'Sorry, unablt to fetch trips.';
        this.loading = false;
      });
    },
    clear () {
      this.loading = true;
      axios
      .delete(process.env.VUE_APP_API_HOST + 'trips')
      .then(response => {
        this.trips();
        this.message.type = 'success';
        this.message.text = response.data.message;
        this.loading = false;
      })
      .catch(err => {
        console.log(err);
        this.message.type = 'error';
        this.message.text = 'Sorry, unablt to fetch trips.';
        this.loading = false;
      });
    }
  }
};
</script>
<style scope>
  .v-expansion-panel--active {
    background-color: #eee !important;
  }
</style>