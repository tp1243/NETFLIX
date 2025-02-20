document.addEventListener("DOMContentLoaded", function () {
  const auth = firebase.auth();

  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("register-name").value;
      const email = document.getElementById("register-email").value;
      const password = document.getElementById("register-password").value;

      auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          return userCredential.user.updateProfile({ displayName: name });
        })
        .then(() => {
          alert("Registration successful! Redirecting to login.");
          window.location.href = "signin.html";
        })
        .catch(error => alert(error.message));
    });
  }

  // User Login
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = document.getElementById("login-email").value;
      const password = document.getElementById("login-password").value;

      auth.signInWithEmailAndPassword(email, password)
        .then(() => {
          window.location.href = "index.html";
        })
        .catch(error => alert(error.message));
    });
  }


  // Fetch movies from TMDB API
  async function fetchMovies(category, containerId) {
    const API_KEY = "dcfd3cd4c8725a68f9099e3a301adf61"; // Replace with your TMDB API Key
    const API_URL = `https://api.themoviedb.org/3/movie/${category}?api_key=${API_KEY}`;

    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      const container = document.getElementById(containerId);
      container.innerHTML = data.results
        .slice(0, 6) // Show only 6 movies per category
        .map(movie => `<img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}">`)
        .join('');
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  }

  // Authentication state change
  auth.onAuthStateChanged((user) => {
    const userNameDisplay = document.getElementById("user-name");
    const signInBtn = document.getElementById("sign-in-btn");
    const logoutBtn = document.getElementById("logout-btn");
    const featuresSection = document.getElementById("features-section");
    const moviesSection = document.getElementById("movies-section");

    if (user) {
      userNameDisplay.innerText = `Welcome, ${user.displayName || "User"}`;
      signInBtn.style.display = "none";
      logoutBtn.style.display = "inline-block";

      // Hide Features Section
      featuresSection.style.display = "none";

      // Show Movies Section
      moviesSection.style.display = "block";

      // Fetch movie categories dynamically
      fetchMovies("popular", "popular-movies");
      fetchMovies("now_playing", "trending-movies");
      fetchMovies("top_rated", "top-rated-movies");
    } else {
      userNameDisplay.innerText = "";
      signInBtn.style.display = "inline-block";
      logoutBtn.style.display = "none";
      featuresSection.style.display = "block";
      moviesSection.style.display = "none";
    }
  });

  // Logout functionality
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      auth.signOut().then(() => {
        window.location.href = "signin.html";
      });
    });
  }
});


