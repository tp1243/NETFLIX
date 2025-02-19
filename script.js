document.addEventListener("DOMContentLoaded", function () {
    const auth = firebase.auth();
  
    // Registration
    const registerForm = document.getElementById("register-form");
    if (registerForm) {
      registerForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const name = document.getElementById("register-name").value;
        const email = document.getElementById("register-email").value;
        const password = document.getElementById("register-password").value;
  
        auth.createUserWithEmailAndPassword(email, password)
          .then((userCredential) => {
            // Update display name
            return userCredential.user.updateProfile({
              displayName: name
            });
          })
          .then(() => {
            alert("Registration successful! Redirecting to login.");
            window.location.href = "signin.html";
          })
          .catch(error => alert(error.message));
      });
    }
  
    // Login
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
  
    // Auth state changes (for index.html)
    auth.onAuthStateChanged((user) => {
      const userNameDisplay = document.getElementById("user-name");
      const signInBtn = document.getElementById("sign-in-btn");
      const logoutBtn = document.getElementById("logout-btn");
  
      if (user) {
        // Show "Welcome, user" and Logout button, hide Sign In
        if (userNameDisplay) userNameDisplay.innerText = `Welcome, ${user.displayName || "User"}`;
        if (signInBtn) signInBtn.style.display = "none";
        if (logoutBtn) logoutBtn.style.display = "inline-block";
      } else {
        // No user -> hide logout & welcome, show Sign In
        if (userNameDisplay) userNameDisplay.innerText = "";
        if (signInBtn) signInBtn.style.display = "inline-block";
        if (logoutBtn) logoutBtn.style.display = "none";
      }
    });
  
    // Logout
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", function () {
        auth.signOut().then(() => {
          window.location.href = "signin.html";
        });
      });
    }
  });
  