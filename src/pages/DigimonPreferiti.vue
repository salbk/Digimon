<template>
  <div>
    
      <md-dialog-alert
      :md-active.sync="alert"
      md-content="Hai già raggiunto il numero massimo di 5 Digimon per squadra!"
      md-confirm-text="Chiudi"/>  

    <md-empty-state
      md-rounded
      md-icon="favorite"
      md-label="Nessun preferito"
      md-description="Ops! Non hai ancora aggiunto alcun preferito!"
      v-if="likes == 0">
    </md-empty-state>

    <div v-if="likes != 0" class="md-layout md-gutter">

      <div
        class="md-layout-item md-size-25 md-medium-size-33 md-small-size-50 md-xsmall-size-100"
        v-for="like in likes"
        :key="like.name"
        @click="DigimonInfo(like.name)">

        <md-card md-with-hover>

          <md-card-media>
            <img :src="like.img" />
          </md-card-media>

          <md-card-header>
            <div class="md-title">{{ like.name }}</div>
            <div class="md-subhead">{{ like.level }}</div>
          </md-card-header>

          <md-card-actions>
            <md-button class="md-icon-button" @click="liked(like.name)" onclick="event.stopPropagation()">
              <md-icon>favorite</md-icon>
              <md-tooltip md-direction="bottom">Preferiti</md-tooltip>
            </md-button>
            
            <md-button class="md-icon-button" @click="team(like.name)" onclick="event.stopPropagation()">
                <md-icon v-if="teams.includes(like.name)">playlist_add_check</md-icon>
                <md-icon v-else>playlist_add</md-icon>
                <md-tooltip md-direction="bottom">Squadra</md-tooltip>
            </md-button>
          </md-card-actions>

        </md-card>
        
      </div>
    </div>
  </div>
</template>

<script>
import dataservice from "../dataservice";
export default {
  //name: 'EmptyStateRounded',
  data: function () {
    return {
      likes: [],
      teams: [],
      alert: false,
    };
  },
  created: function () {
    this.load();
  },
  methods: {
    load() {
      this.likes = [];
      dataservice.controllike().then((data) => {
        data.forEach((element) => {
          dataservice.getDigimonInfo(element).then((data) => {
            this.likes.push(data.data[0]);
          });
        });
      });
      this.teams = [];
      dataservice.controlteam().then((data) => {
        data.forEach((element) => {
          dataservice.getDigimonInfo(element).then((data) => {
            this.teams.push(data.data[0].name);
          });
        });
      });
    },
    liked(name) {
      dataservice.removelike(name);
      setTimeout(() => {
        this.load();
      }, 500)
    },
    team(name){
      if (this.teams.includes(name)) {
        dataservice.removeteam(name)
        this.load()
      }
      else {
        if (this.teams.length === 5) {
          this.alert=true;
        }
        else {
          dataservice.team(name)
          this.controlteam()
        } 
      }
    }
  },
};
</script>

<style>
.md-card {
  margin: 10px;
}
</style>