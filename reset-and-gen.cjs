const { createClient } = require('@supabase/supabase-js');

const url = "https://eqcjgucfpmhvxkckokwb.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxY2pndWNmcG1odnhrY2tva3diIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDY3MTQyMCwiZXhwIjoyMDg2MjQ3NDIwfQ.t01nN64orujOvqWdQEt6gXp59qkWTrmGuwZU5Jo1708";

const supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false }
});

async function main() {
    try {
        console.log("Resetting device IDs...");
        const { data: updateData, error: updateError } = await supabase
            .from('profiles')
            .update({ device_id: null })
            .in('email', ['guillaumephilippe@me.com', 'guillaumephilippe1968@gmail.com']);

        if (updateError) {
            console.error("Update error:", updateError.message);
            return;
        }

        console.log("Device IDs reset. Generating link for mobile (gmail)...");

        const { data, error } = await supabase.auth.admin.generateLink({
            type: 'magiclink',
            email: 'guillaumephilippe1968@gmail.com',
            options: { redirectTo: 'https://embryologie-app.vercel.app' }
        });

        if (error) {
            console.error("Link error:", error.message);
        } else {
            console.log();
            console.log("NEW_LINK=" + data.properties.action_link);
            console.log();
        }
    } catch (e) {
        console.error("Caught exception:", e);
    }
}
main();
