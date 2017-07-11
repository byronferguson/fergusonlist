import Firebase from 'firebase'

const config = {
    apiKey: "AIzaSyB-P1CUS9O1gw0ToxAlm8GiCiApvEZFyyE",
    authDomain: "shoppinglist-4b9d2.firebaseapp.com",
    databaseURL: "https://shoppinglist-4b9d2.firebaseio.com",
    projectId: "shoppinglist-4b9d2",
    storageBucket: "shoppinglist-4b9d2.appspot.com",
    messagingSenderId: "449400420446"
  };

const firebaseApp = Firebase.initializeApp(config)

// Export the database for components to use.
// If you want to get fancy, use mixins or provide / inject to avoid redundant imports.
export const db = firebaseApp.database();