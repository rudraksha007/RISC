// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import {prisma} from '@/lib/prisma'; // Assuming you have a Prisma client set up

// Define validation schema for signup data
const signupSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters')
        .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}$/, 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number"'),
    regno: z.number().min(1000, 'Registration number must be at least 4 digits')
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const result = signupSchema.safeParse(body);
        if (!result.success) {
            console.log('Validation failed:', result.error.errors);
            
            return NextResponse.json(
                {
                    success: false,
                    message: 'Validation failed',
                    errors: result.error.errors
                },
                { status: 400 }
            );
        }

        const { name, email, password, regno } = result.data;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'User with this email already exists'
                },
                { status: 409 }
            );
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // // Create new user
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                regno, 
                password: hashedPassword,
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                // Do not select password
            }
        });
        console.log('done');
        

        // Return success response with user data (excluding password)
        return NextResponse.json(
            {
                success: true,
                message: 'User registered successfully',
                // user: newUser
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Signup error:', error);

        return NextResponse.json(
            {
                success: false,
                message: 'An error occurred during registration',
            },
            { status: 500 }
        );
    }
}