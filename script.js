// FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyDDdR6_bwmdjO3KRGXSCoowgKVoA7bTADc",
  authDomain: "aurax-3b53f.firebaseapp.com",
  projectId: "aurax-3b53f",
  storageBucket: "aurax-3b53f.appspot.com",
  messagingSenderId: "518223462689",
  appId: "1:518223462689:web:eda88815480186f26b7e60"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// INTRO TYPEWRITER
const captionText = "You have been selected.";
let i = 0;
const caption = document.getElementById("caption");

function typeText() {
  if (i < captionText.length) {
    caption.textContent += captionText[i++];
    setTimeout(typeText, 80);
  }
}
typeText();

setTimeout(() => {
  intro.classList.add("hidden");
  auth.onAuthStateChanged(user => {
    if (user) showHome(user);
    else authSection.classList.remove("hidden");
  });
}, 2500);

// AUTH
function signup() {
  auth.createUserWithEmailAndPassword(email.value, password.value)
    .then(res => {
      db.collection("users").doc(res.user.uid).set({ aura: 0 });
    });
}

function login() {
  auth.signInWithEmailAndPassword(email.value, password.value);
}

function logout() {
  auth.signOut();
  location.reload();
}

// HOME
function showHome(user) {
  authSection.classList.add("hidden");
  home.classList.remove("hidden");

  db.collection("users").doc(user.uid)
    .onSnapshot(doc => auraCount.textContent = doc.data().aura);

  loadPosts();
}

// POSTS
function createPost() {
  const file = postImage.files[0];
  if (!file) return;

  const ref = storage.ref("posts/" + Date.now());
  ref.put(file).then(snap =>
    snap.ref.getDownloadURL().then(url => {
      db.collection("posts").add({
        text: postText.value,
        image: url,
        aura: 0,
        time: Date.now()
      });
      postText.value = "";
      postImage.value = "";
    })
  );
}

function loadPosts() {
  db.collection("posts")
    .orderBy("time", "desc")
    .onSnapshot(snap => {
      feed.innerHTML = "";
      snap.forEach(doc => {
        const p = doc.data();
        feed.innerHTML += `
          <div class="post">
            <p>${p.text}</p>
            <img src="${p.image}">
            <button onclick="giveAura('${doc.id}')">+ Aura (${p.aura})</button>
          </div>
        `;
      });
    });
}

function giveAura(id) {
  db.collection("posts").doc(id).update({
    aura: firebase.firestore.FieldValue.increment(1)
  });
}

// ELEMENTS
const intro = document.getElementById("intro");
const authSection = document.getElementById("auth");
const home = document.getElementById("home");
