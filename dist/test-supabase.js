"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_js_1 = require("@supabase/supabase-js");
async function testSupabase() {
    const supabaseUrl = "https://rygtyzwkhcuiwxzqmmlo.supabase.co";
    const supabaseAnonKey = "sb_publishable_6OJmArhZRC4HcHd_IBFbmw_7hpaYGHO";
    const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseAnonKey);
    console.log("Attempting to sign up user...");
    const { data, error } = await supabase.auth.signUp({
        email: 'sachinsinghtomar575@gmail.com',
        password: 'password123',
        options: {
            data: {
                firstName: 'Sachin',
                lastName: 'Singh',
                role: 'TEACHER',
            }
        }
    });
    if (error) {
        console.error("Supabase Error:", error);
    }
    else {
        console.log("Success! Data:", JSON.stringify(data, null, 2));
    }
}
testSupabase().catch(console.error);
//# sourceMappingURL=test-supabase.js.map