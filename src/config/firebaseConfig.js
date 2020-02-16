import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyCyqngK1oRjTLl4JNFUn94cMDnpU6gjy7g",
    authDomain: "money-saver-ff281.firebaseapp.com",
    databaseURL: "https://money-saver-ff281.firebaseio.com",
    projectId: "money-saver-ff281",
    storageBucket: "money-saver-ff281.appspot.com",
    messagingSenderId: "19846972859",
    appId: "1:19846972859:web:89444c492c62425e91309e"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.firestore().settings({ timestampsInSnapshots: true });

export const db = firebase.firestore(firebase);

export default firebase;