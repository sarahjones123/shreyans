// ======================================================
// Authentication Module
// ======================================================

const APP_PAGE = "app.html";
const LOGIN_PAGE = "index.html";

/**
 * Runs when the page loads.
 */
document.addEventListener("DOMContentLoaded", () => {

    console.log("Auth.js loaded");

    // Make sure Supabase is available
    if (!window.supabaseClient) {
        console.error("Supabase client not initialized.");
        return;
    }

    // Attach Login button event
    const loginButton = document.getElementById("loginBtn");

    if (loginButton) {
        loginButton.addEventListener("click", login);
    }

    // Allow Enter key to submit login
    document.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            login();
        }
    });

    // Check if already logged in
    checkSession();

});


/**
 * Login using email and password.
 */
async function login() {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");
    const loginButton = document.getElementById("loginBtn");

    message.textContent = "";
    message.style.color = "red";

    if (!email || !password) {
        message.textContent = "Please enter your email and password.";
        return;
    }

    try {

        loginButton.disabled = true;
        loginButton.textContent = "Signing In...";

        const { error } =
            await window.supabaseClient.auth.signInWithPassword({

                email: email,

                password: password

            });

        if (error) {

            message.textContent = error.message;

            return;

        }

        message.style.color = "green";
        message.textContent = "Login successful.";

        setTimeout(() => {

            window.location.href = APP_PAGE;

        }, 500);

    }
    catch (err) {

        console.error(err);

        message.textContent =
            "Unable to connect to Supabase.";

    }
    finally {

        loginButton.disabled = false;
        loginButton.textContent = "Login";

    }

}


/**
 * Redirect logged-in users directly to the application.
 */
async function checkSession() {

    try {

        const {

            data: { session },

            error

        } = await window.supabaseClient.auth.getSession();

        if (error) {

            console.error(error);

            return;

        }

        if (session) {

            console.log("User already logged in.");

            window.location.href = APP_PAGE;

        }

    }
    catch (err) {

        console.error(err);

    }

}


/**
 * Logout current user.
 */
async function logout() {

    await window.supabaseClient.auth.signOut();

    window.location.href = LOGIN_PAGE;

}


/**
 * Get currently logged-in user.
 */
async function getCurrentUser() {

    const {

        data: { user }

    } = await window.supabaseClient.auth.getUser();

    return user;

}