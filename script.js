/* 🔥 FIREBASE CONFIG — PASTE YOUR REAL ONE */
const firebaseConfig = {
  apiKey: "PASTE_YOURS",
  authDomain: "PASTE_YOURS",
  projectId: "PASTE_YOURS",
  storageBucket: "PASTE_YOURS",
  messagingSenderId: "PASTE_YOURS",
  appId: "PASTE_YOURS"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

/* SCREENS */
const intro = document.getElementById("intro");
const loginScreen = document.getElementById("login");
const home = document.getElementById("home");
const typewriter = document.getElementById("typewriter");

/* TYPEWRITER */
const text = "ARISE — YOUR AURA AWAITS";
let t = 0;
(function typeEffect() {
  if (t < text.length) {
    typewriter.innerHTML += text.charAt(t++);
    setTimeout(typeEffect, 90);
  }
})();

/* AUTO FLOW */
setTimeout(() => {
  auth.onAuthStateChanged(user => {
    intro.classList.add("hidden");
    if (user) home.classList.remove("hidden");
    else loginScreen.classList.remove("hidden");
  });
}, 4000);

/* LOGIN / SIGNUP */
function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  if (!username || !password) return alert("Fill all fields");

  const email = `${username}@aurax.app`;

  auth.signInWithEmailAndPassword(email, password)
    .catch(() => {
      return auth.createUserWithEmailAndPassword(email, password)
        .then(cred => {
          return db.collection("users").doc(cred.user.uid).set({
            username,
            aura: 0,
            level: 1,
            followers: 0,
            following: 0
          });
        });
    })
    .then(() => {
      loginScreen.classList.add("hidden");
      home.classList.remove("hidden");
    })
    .catch(err => alert(err.message));
}

/* LOAD USER DATA */
auth.onAuthStateChanged(user => {
  if (!user) return;
  db.collection("users").doc(user.uid).get().then(doc => {
    if (doc.exists) {
      document.getElementById("aura").innerText = doc.data().aura;
      document.getElementById("level").innerText = doc.data().level;
    }
  });
});

/* QUISh LOGIC */
const quish = document.querySelectorAll(".quish");
let current = 0;

function updateQuish() {
  quish.forEach((q, i) => q.classList.toggle("active", i === current));
}

/* ZOOM OUT → NEXT */
document.addEventListener("wheel", e => {
  if (e.deltaY > 0 && current < quish.length - 1) {
    current++;
    updateQuish();
  }
});

/* MOBILE SWIPE */
let startY = 0;
document.addEventListener("touchstart", e => startY = e.touches[0].clientY);
document.addEventListener("touchend", e => {
  if (startY - e.changedTouches[0].clientY > 50 && current < quish.length - 1) {
    current++;
    updateQuish();
  }
});
