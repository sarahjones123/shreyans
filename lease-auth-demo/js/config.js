
// ======================================================
// Supabase Configuration
// ======================================================

const CONFIG = {

    SUPABASE_URL: "https://plblaxdikvkxarjzpjsy.supabase.co",

    SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYmxheGRpa3ZreGFyanpwanN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3ODk1OTAsImV4cCI6MjA5OTM2NTU5MH0.5bZ8KI_bMMg9L0iK3N_X0twMVedu3tXaqiezd2zfGso"

};

// Create the client
window.supabaseClient = window.supabase.createClient(
    CONFIG.SUPABASE_URL,
    CONFIG.SUPABASE_ANON_KEY
);

console.log("✅ Supabase initialized");

console.log(window.supabaseClient);