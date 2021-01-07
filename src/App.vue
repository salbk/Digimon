<template>
  <div id="app" class="page-container">
    <md-app md-waterfall md-mode="fixed">
      <md-app-toolbar class="md-primary">
        <md-button class="md-icon-button" @click="menuVisible = !menuVisible" v-if="authenticated">
          <md-icon>menu</md-icon>
        </md-button>
        <span @click="homepage()">
          <img src="./assets/logoDigimon.png" width="100" />
        </span>

        <div class="md-toolbar-section-end" v-if="authenticated">
          <md-autocomplete
            class="searchbar"
            md-layout="box"
            v-model="selectedDigimon"
            :md-options="searchOptions"
            @md-changed="search"
            @md-selected="select">

            <label> 
              <md-icon>search</md-icon>
               Cerca Digimon 
            </label>

          </md-autocomplete>
        </div>
      </md-app-toolbar>

      <md-app-drawer :md-active.sync="menuVisible" class="drawer">
        <md-toolbar class="md-transparent" md-elevation="0">
          <b>Ciao, {{username}}! </b>
        </md-toolbar>

        <md-list>
          <md-list-item to="/#">
            <md-icon>list_alt</md-icon>
            <span class="md-list-item-text">Lista Digimon</span>
          </md-list-item>

          <md-list-item to="/Squadra">
            <md-icon>groups</md-icon>
            <span class="md-list-item-text">Squadra</span>
          </md-list-item>

          <md-list-item to="/Preferiti">
            <md-icon>favorite</md-icon>
            <span class="md-list-item-text">Preferiti</span>
          </md-list-item>

          <md-list-item to="/AboutDigimon">
            <md-icon>info</md-icon>
            <span class="md-list-item-text">About Digimon</span>
          </md-list-item>

          <br>
          <md-divider></md-divider>
          <br>

          <md-list-item @click="logout()">
            <md-icon>logout</md-icon>
            <span class="md-list-item-text">Logout</span>
          </md-list-item>
        </md-list>
      </md-app-drawer>

      <md-app-content class="md-accent"> <router-view></router-view> </md-app-content>
    </md-app>
  </div>
</template>

<script>
import dataservice from "./dataservice";
export default {
  name: "App",
  data: function () {
    return {
      authenticated: dataservice.isAuthenticated(),
      selectedDigimon: null,
      searchOptions: [],
      menuVisible: false,
      username: "",
    };
  },
  watch: {
    $route: function () {
      this.authenticated = dataservice.isAuthenticated();
    },
  },
  components: {},
  methods: {
    search: function (term) {
      this.searchOptions = dataservice.searchDigimon(term);
    },
    select: function (selected) {
      if (selected === this.$route.params.name) return;
      this.$router.push({
        path: "/info/" + selected,
      });
    },
    logout: function () {
      dataservice.logout();
      this.$router.push({
        path: "/login",
      });
    },
    homepage: function () {
      if (dataservice.isAuthenticated()){
        this.$router.push({
        path: "/#",
        });
      }
      
    },
  },
  mounted() {
    this.username="";
    this.username=localStorage.getItem("username");
  },
};
</script>

<style lang="scss">
@import "~vue-material/dist/theme/engine"; // Import the theme engine

@include md-register-theme(
  "default",
  (
    primary: #ec7200,
    // The primary color of your application
      accent: #A7DBE8 ,// The accent or secondary color
      
  )
);

@import "~vue-material/dist/theme/all"; // Apply the theme
.searchbar {
  max-width: 200px;
}
.drawer {
  width: 200px;

}
.md-app {
  height: 100vh;
}

</style>
