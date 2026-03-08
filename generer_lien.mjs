import { createClient } from '@supabase/supabase-js';
import * as readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const url = "https://eqcjgucfpmhvxkckokwb.supabase.co";

console.log("\n========================================================");
console.log("   OUTIL POUR DÉPASSER LE BLOCAGE EMAIL DE SUPABASE");
console.log("========================================================\n");

rl.question("1. Allez dans Supabase > Project Settings (la roue crantée en bas à gauche) > API\n2. Descendez à 'Project API keys'\n3. Copiez la clé 'service_role' (secrète) et collez-la ici : ", async (key) => {

    if (!key || key.length < 50) {
        console.log("Clé invalide ! C'est généralement une longue suite de lettres et chiffres commençant par eyJ...");
        process.exit(1);
    }

    const supabase = createClient(url, key.trim(), {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });

    console.log("\nGénération du lien magique pour guillaumephilippe@me.com en cours...\n");

    const { data, error } = await supabase.auth.admin.generateLink({
        type: 'magiclink',
        email: 'guillaumephilippe@me.com',
    });

    if (error) {
        console.log("❌ Erreur :", error.message);
    } else {
        console.log("✅ SUCCESS ! VOICI VOTRE LIEN MAGIQUE DIRECT :");
        console.log("----------------------------------------------------------------");
        console.log(data.properties.action_link);
        console.log("----------------------------------------------------------------");
        console.log("➡️ Copiez le lien ci-dessus et ouvrez-le dans le même navigateur que votre application.");
    }
    process.exit();
});
