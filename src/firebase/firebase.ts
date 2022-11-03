import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "./config";

const provider = new GoogleAuthProvider();

// provider.addScope("https://www.googleapis.com/auth/contacts.readonly");

const auth = getAuth(app);
auth.languageCode = "en";

export const signinWithGoogle = () => {
  return new Promise((resolve, reject) => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const cred = GoogleAuthProvider.credentialFromResult(result);

        const token = cred?.accessToken;
        const user = result.user;
        console.log(user);
        console.log("signin successfull");
        resolve(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        reject(error);
      });
  });
};
