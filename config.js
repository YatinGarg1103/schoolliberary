import firebase from 'firebase'


const firebaseConfig = {
  apiKey: "AIzaSyC35ivL5zYDmoTSujq4MuYbNxXcoG77CQg",
  authDomain: "school-wireless-library.firebaseapp.com",
  projectId: "school-wireless-library",
  storageBucket: "school-wireless-library.appspot.com",
  messagingSenderId: "89751401120",
  appId: "1:89751401120:web:033b3195bd9859e95f8fc5"
};


  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore()