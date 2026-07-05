"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding SUPER_ADMIN...');
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;
    if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing Supabase URL or Key in .env');
    }
    const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
    const email = 'admin@school-os.com';
    const password = 'SuperAdminPassword123!';
    console.log(`1. Creating Supabase Auth User: ${email}`);
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                firstName: 'System',
                lastName: 'Admin',
                role: 'SUPER_ADMIN',
            },
        },
    });
    if (authError) {
        if (authError.message.includes('already registered')) {
            console.log('Auth user already exists in Supabase. Proceeding to Prisma sync...');
        }
        else {
            throw new Error(`Supabase Auth Error: ${authError.message}`);
        }
    }
    else {
        console.log('Supabase Auth User created successfully!');
    }
    console.log('2. Creating SUPER_ADMIN role in Database');
    let role = await prisma.role.findFirst({
        where: { name: 'SUPER_ADMIN', schoolId: null },
    });
    if (!role) {
        role = await prisma.role.create({
            data: {
                name: 'SUPER_ADMIN',
                description: 'System Administrator with full access to the platform',
                isSystem: true,
            },
        });
        console.log('Role SUPER_ADMIN created.');
    }
    else {
        console.log('Role SUPER_ADMIN already exists.');
    }
    console.log('3. Linking User Profile in Database');
    const existingUser = await prisma.user.findFirst({
        where: { email },
    });
    if (!existingUser) {
        await prisma.user.create({
            data: {
                email,
                passwordHash: password,
                firstName: 'System',
                lastName: 'Admin',
                roleId: role.id,
            },
        });
        console.log(`User profile for ${email} created successfully!`);
    }
    else {
        console.log('User profile already exists in DB.');
    }
    console.log('\n✅ SEED COMPLETE. You can now login with:');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed-superadmin.js.map