<template>
  <div class="md-layout">
    
    <md-dialog-alert
      :md-active.sync="alert"
      md-content="Hai già raggiunto il numero massimo di 5 Digimon per squadra!"
      md-confirm-text="Chiudi"/>  

    <md-card class="md-layout-item md-size-100" v-if="Digimon">

      <md-card-header>
        <md-card-header-text>
          <span class="md-title">{{ Digimon.name }}</span>
        </md-card-header-text>

        <md-card-media class="md-big">
          <img :src="Digimon.img">
        </md-card-media>
      </md-card-header>

      <md-card-content>
        <span>{{ Digimon.level }}</span>
      </md-card-content>
       
      <md-card-actions>

            <md-button class="md-icon-button" @click="likes()" onclick="event.stopPropagation()">
                <md-icon v-if="like==true">favorite</md-icon>
                <md-icon v-else>favorite_border</md-icon>
                <md-tooltip md-direction="bottom">Preferiti</md-tooltip>
            </md-button>
            
            <md-button class="md-icon-button" @click="teams()" onclick="event.stopPropagation()">
                <md-icon v-if="team==true">playlist_add_check</md-icon>
                <md-icon v-else>playlist_add</md-icon> 
                <md-tooltip md-direction="bottom">Squadra</md-tooltip>
            </md-button> 
      
      </md-card-actions>

    </md-card>
  </div>
</template>

<script>
import dataservice from "../dataservice";

export default {
  data: function () {
    return {
      Digimon: null,
      like: false,
      team: false,
      squadra: [],
      alert: false,
    };
  },
  watch: {
    $route: function () {
      this.load();
    },
  },
  created: function () {
    this.load();
  },
  methods: {
    load: function () {
      dataservice.getDigimonInfo(this.$route.params.name).then((data) => {
        this.Digimon = data.data[0];
        console.log(this.Digimon);
      });
      dataservice.controllike().then(data => {
        if (data.includes(this.$route.params.name)) {
          this.like=true
        }
      });
      dataservice.controlteam().then(data => {
        this.squadra = data;
        if (data.includes(this.$route.params.name)) {
          this.team=true
        }
      });
    },
    likes: function () {
      if (this.like === false) {
        dataservice.like(this.$route.params.name);
        this.like=!this.like;
      } else {
        dataservice.removelike(this.$route.params.name);
        this.like=!this.like;
      }   
    },
    teams: function () {
      if (this.team === false) {
        if (this.squadra.length === 5) {
          this.alert=true;
        }
        else {
          dataservice.team(this.$route.params.name)
          this.team=!this.team;
        } 
      } else {
        dataservice.removeteam(this.$route.params.name);
        this.team=!this.team;
      }   
    }
  }
}
</script>

<style>

</style>