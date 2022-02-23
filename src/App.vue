<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <!-- <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        /> -->
        <span>麻雀計算結果</span>
      </div>

      <v-spacer></v-spacer>
      <!-- TODO 部屋番号を入力値と一致させる -->
      <v-btn
        href="https://tenhou.net/3/?L5122"
        target="_blank"
        text
      >
        <span class="mr-2">対局部屋</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <v-row>
          <v-col>
            <v-text-field
              v-model="firstname"
              :rules="nameRules"
              label="部屋番号"
              required
            />
          </v-col>
          <v-col>
            <v-menu
              ref="menu"
              v-model="menu"
              __:return-value.sync="date"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="date"
                  label="開始日付"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="date"
                no-title
                scrollable
              >
                <v-spacer></v-spacer>
                <v-btn
                  text
                  color="primary"
                  @click="$refs.menu.save(date)"
                >
                  OK
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="menu = false"
                >
                  Cancel
                </v-btn>
              </v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn block>
              結果表示
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols=4>
            <v-card>
              <v-list>
                <v-list-item
                  v-for="(user, i) in Object.keys(totalResults)"
                  :key="i"
                >
                  <v-list-item-content v-text="user" />
                  <v-list-item-content v-text="totalResults[user]" />
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
          <v-col cols=8>
            <v-card>
              <v-list>
                <v-list-item
                  v-for="(user, i) in Object.keys(totalResults)"
                  :key="i"
                >
                  <v-list-item-content v-text="'user1がuser2にXX'" />
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card>
              <v-data-table
                  v-bind:headers="headers"
                  v-bind:items="results"
                  v-bind:disable-sort="true"
                  v-bind:disable-pagination="true"
                  v-bind:hide-default-footer="true"
                  class="elevation-1"
                >

              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <!-- <HelloWorld/> -->


    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
// import HelloWorld from './components/HelloWorld.vue';

const mockData = {
  roomNumber: 5122,
  startDate: 20220222,
  endDate: 20220223,
}

const results = [
  { "times": 1, "user1": 53.1, "user2": -16, "user3": -37.1 },
  { "times": 2, "user1": 40.3, "user2": -4.1, "user3": -36.2 },
  { "times": 3, "user1": 52.8, "user2": -61.2, "user3": 8.4 },
  { "times": 4, "user1": -17.6, "user2": 58.9, "user3": -41.3 },
  { "times": 5, "user1": -51.5, "user2": 65.1, "user3": -13.6 },
  { "times": 6, "user1": -43.1, "user2": 60.5, "user3": -17.4 },
  { "times": 7, "user1": -73, "user2": -6, "user3": 79 },
  { "times": 8, "user1": 36.5, "user2": 0, "user3": -36.5 },
  { "times": 9, "user1": -48, "user2": -3.9, "user3": 51.9 },
  { "times": 10, "user1": 9.9, "user2": -61.8, "user3": 51.9 },
  { "times": 11, "user1": 3.4, "user2": 51.8, "user3": -55.2 },
  { "times": 12, "user1": -5.9, "user2": -33.6, "user3": 39.5 },
  { "times": 13, "user1": -61, "user2": 88, "user3": -27 },
  { "times": 14, "user1": -16.7, "user2": 74.6, "user3": -57.9 },
  { "times": 15, "user1": -13.9, "user2": 49.5, "user3": -35.6 },
  { "times": 16, "user1": 56.4, "user2": -39.9, "user3": -16.5 },
  { "times": 17, "user1": 58.9, "user2": -55.4, "user3": -3.5 },
  { "times": 18, "user1": -5, "user2": -62.2, "user3": 67.2 },
  { "times": 19, "user1": 50.2, "user2": 10.9, "user3": -61.1 },
  { "times": 20, "user1": -33.8, "user2": -7, "user3": 40.8 },
  { "times": 21, "user1": -5, "user2": -42.9, "user3": 47.9 },
  { "times": "ex", "user1": -20, "user2": 0, "user3": 20 },
  // { "times": "sum", "user1": -33, "user2": 65.3, "user3": -32.3 },
];

const totalResults = {
  user1: 0,
  user2: 0,
  user3: 0,
}

results.forEach(res => {
  totalResults.user1 += res.user1;
  totalResults.user2 += res.user2;
  totalResults.user3 += res.user3;
});

// TODO 小数点の修正をする
totalResults.user1 = -3300;
totalResults.user2 = 6530;
totalResults.user3 = -3230;

export default Vue.extend({
  name: 'App',

  components: {
    // HelloWorld
  },

  data: () => ({
    results,
    totalResults
  }),
  computed: {
    headers: () => ['times', 'user1', 'user2', 'user3']
      .map(item => ({
        text: item,
        value: item,
      }))
  },
});
</script>
