import axios from "axios";
import firebase from "@firebase/app";
import "@firebase/firestore";
var firebaseConfig = {
  apiKey: "AIzaSyCDOdySJCWsgjWNG28modwC20YC5QUHwfs",
  authDomain: "digimon-55479.firebaseapp.com",
  projectId: "digimon-55479",
  storageBucket: "digimon-55479.appspot.com",
  messagingSenderId: "649353348077",
  appId: "1:649353348077:web:04f91e8540ecd1d1769de4",
  measurementId: "G-0KT7WJ7VVJ"
};
// Initialize Firebase
!firebase.apps.length
  ? firebase.initializeApp(firebaseConfig).firestore()
  : firebase.app().firestore();

var db = firebase.firestore();

var User="";
export default {
  isAuthenticated() {
    return !!localStorage.getItem("username");
  },
  login(username) {
    localStorage.setItem("username", username);
  },
  logout() {
    localStorage.removeItem("username");
  },
  getDigimon() {
    return axios.get("https://digimon-api.vercel.app/api/digimon");
  },
  getDigimonInfo(name) {
    return axios.get("https://digimon-api.vercel.app/api/digimon/name/" + name);
  },
  searchDigimon(text) {
    if (!text || text.lenght < 3) {
      return new Promise((resolve) => {
        resolve([]);
      });
    }
    return axios
      .get("https://digimon-api.vercel.app/api/digimon/?offset=0&limit=1000")
      .then((data) => {
        return data.data
          .filter((element) => element.name.indexOf(text) >= 0)
          .map((element) => element.name);
      });
  },
  getUsername() {
    User=localStorage.getItem("username");
  },
  like(name) {
    this.getUsername();
    return db.collection("likes").doc(name+"-"+User).set({ name:name, user:User });
  },
  removelike(name) {
    this.getUsername();
    db.collection("likes").doc(name+"-"+User).delete();
  },
  controllike() {
    this.getUsername();
    return db.collection("likes").where("user", "==", User).get().then(data =>  {
      return data.docs.map(doc => doc.data().name)
    })
  },
  team(name) {
    this.getUsername();
    return db.collection("teams").doc(name+"-"+User).set({ name:name, user:User });
  },
  removeteam(name) {
    this.getUsername();
    db.collection("teams").doc(name+"-"+User).delete();
  },
  controlteam() {
    this.getUsername();
    return db.collection("teams").where("user", "==", User).get().then(data =>  {
      return data.docs.map(doc => doc.data().name)
    })
  }
}; 

