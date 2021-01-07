<template>
<div>

  <div>
    <md-empty-state
      md-rounded
      md-icon="groups"
      md-label="Nessuna Squadra"
      md-description="Ops! Non hai ancora creato la tua squadra!"
      v-if="teams == 0" > 
    </md-empty-state>

  <div v-if="teams != 0" class="md-layout md-gutter">
      <div
        class="md-layout-item md-size-25 md-medium-size-33 md-small-size-50 md-xsmall-size-100"
        v-for="team in teams"
        :key="team.name"
        @click="DigimonInfo(team.name)">

        <md-card md-with-hover>
          <md-card-media>
            <img :src="team.img" />
          </md-card-media>

          <md-card-header>
            <div class="md-title">{{ team.name }}</div>
            <div class="md-subhead">{{ team.level }}</div>
          </md-card-header>

          <md-card-actions>
            <md-button class="md-icon-button" @click="like(team.name)" onclick="event.stopPropagation()">
                <md-icon v-if="likes.includes(team.name)">favorite</md-icon>
                <md-icon v-else>favorite_border</md-icon>
                <md-tooltip md-direction="bottom">Preferiti</md-tooltip>
              </md-button>
            
              <md-button class="md-icon-button" @click="added(team.name)" onclick="event.stopPropagation()">
                <md-icon>playlist_add_check</md-icon>
                <md-tooltip md-direction="bottom">Squadra</md-tooltip>
              </md-button> 
          </md-card-actions>
        </md-card>
      </div> 
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
      teams: [],
      likes: [],
      loading: false,
    };
  },
  created: function () {
    this.load();
  },
  methods: {
    load() {
      this.teams = [];
      dataservice.controlteam().then((data) => {
        data.forEach((element) => {
          dataservice.getDigimonInfo(element).then((data) => {
            this.teams.push(data.data[0]);
          });
        });
      });
      this.likes = [];
        dataservice.controllike().then((data) => {
          data.forEach((element) => {
            dataservice.getDigimonInfo(element).then((data) => {
              this.likes.push(data.data[0].name);
          });
        });
      });
    },
    added(name) {
      dataservice.removeteam(name);
      setTimeout(() => {
        this.load();
      }, 500)
    },
     like(name){
      if (this.likes.includes(name)) {
        dataservice.removelike(name)
        this.load()
      }
      else {
        dataservice.like(name)
        this.load()
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  .md-card {
  margin: 10px;
  }
</style>