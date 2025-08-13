"use server";
import { neon } from "@neondatabase/serverless";

// Helper function to get the current time in Nepali Time (NPT)
const getCurrentNepaliTime = () => {
    // NPT is UTC + 5 hours and 45 minutes
    const utcTime = new Date();
    const nepaliOffset = 5.75 * 60 * 60 * 1000;
    const nepaliTime = new Date(utcTime.getTime() + nepaliOffset);

    // Return the time in a format the database can understand (ISO 8601)
    return nepaliTime.toISOString();
};

export async function createTableUsers() {
    const sql = neon(process.env.DATABASE_URL);
    const data = await sql`create table if not exists users (
        id serial primary key,
        username varchar(50) not null unique,
        phone varchar(15) not null unique,
        email varchar(100) not null unique,
        password varchar(255) not null,
        invitation_code varchar(50),
        verified boolean default false,
        verification_code varchar(50),
        created_at timestamp, -- Removed 'default current_timestamp'
        updated_at timestamp -- Removed 'default current_timestamp'
    );`;
    return data;
}

export async function registerUser(username, phone, email, password, invitationCode) {
    createTableUsers();
    const sql = neon(process.env.DATABASE_URL);
    const now = getCurrentNepaliTime();

    const data = await sql`
        INSERT INTO users (
            username, 
            phone, 
            email, 
            password, 
            invitation_code, 
            created_at, 
            updated_at
        ) 
        VALUES (
            ${username}, 
            ${phone}, 
            ${email}, 
            ${password}, 
            ${invitationCode}, 
            ${now}, 
            ${now}
        );
    `;
    return data;
}

export async function loginUsers(phone, password) {
    const sql = neon(process.env.DATABASE_URL);
    const data = await sql`SELECT * FROM users WHERE phone = ${phone} AND password = ${password};`;
    console.log("Login data:", data);
    return data;
}

export async function verifyUser(email, code) {
    const sql = neon(process.env.DATABASE_URL);
    const now = getCurrentNepaliTime();

    // Update the user with the provided phone and code, setting verified to true
    const data = await sql`
        UPDATE users 
        SET verified = true, 
        updated_at = ${now}
        WHERE verification_code = ${code} 
        AND email = ${email}
        RETURNING *;
    `;
    return data;
}
