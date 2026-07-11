// ======================================================
// Route Guard
// ======================================================

const LOGIN_PAGE = "index.html";

document.addEventListener("DOMContentLoaded", async () => {

    const user = await requireLogin();

    if (user) {

        initializeUserBar(user);

    }

});


async function requireLogin() {

    try {

        const {

            data: { session }

        } = await window.supabaseClient.auth.getSession();

        if (!session) {

            window.location.replace(LOGIN_PAGE);

            return null;

        }

        return session.user;

    }
    catch (err) {

        console.error(err);

        window.location.replace(LOGIN_PAGE);

        return null;

    }

}


function initializeUserBar(user) {

    const email = document.getElementById("userEmail");

    const logoutButton =
        document.getElementById("logoutBtn");

    if (email) {

        email.textContent = user.email;

    }

    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            logout
        );

    }

}


async function logout() {

    const confirmed = confirm(
        "Are you sure you want to logout?"
    );

    if (!confirmed)
        return;

    await window.supabaseClient.auth.signOut();

    window.location.replace(LOGIN_PAGE);

}