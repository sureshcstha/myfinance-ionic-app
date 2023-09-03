import { defineStore} from "pinia";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

import { setDoc, doc } from "firebase/firestore";
import { dataBase, auth } from '@/firebase.js'
import { userStore } from "@/store/user";


export const useAuthStore = defineStore('auth', {
    state: () => ({
        isLoggedIn: false,
    }),

    actions: {
        register(user: any) {
            // console.log('Register!')
            createUserWithEmailAndPassword(auth, user.email, user.password)
                .then(async (userCredential) => {
                    // Signed in
                    const user = userCredential.user;
                    this.isLoggedIn = true

                    // Add a new document in collection "users"
                    await setDoc(doc(dataBase, "users", userCredential.user.uid), {
                        records: []
                    });
                    // ...
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    // ..
                });
        },

        login(user: any) {
            // console.log('Login!')
            signInWithEmailAndPassword(auth, user.email, user.password)
                .then(async (userCredential) => {
                    // Signed in
                    const user = userCredential.user;
                    this.isLoggedIn = true

                    const store = userStore()
                    await store.clearData()
                    await store.fetchDataFromDB()
                    // ...
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                });
        },

        logout() {
            // console.log('Logout!')
            signOut(auth)
                .then(async () => {
                    // Sign-out successful.
                    this.isLoggedIn = false
                })
                .catch((error) => {

                });
        },
    }
})