import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { Resend } from "resend";
import { randomBytes } from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = signupSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    const verificationToken = randomBytes(32).toString("hex");
    const hashedPassword = await hash(validatedData.password, 12);

    // Create user with verification token
    await prisma.user.create({
      data: {
        email: validatedData.email,
        name: validatedData.name,
        password: hashedPassword,
        emailVerificationToken: verificationToken,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    // Send verification email
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify-email?token=${verificationToken}`;

    await resend.emails.send({
      from: "test@resend.dev",
      // to: validatedData.email,
      to: "jaymehta002@gmail.com",
      subject: "Verify your email",
      html: `
        <h1>Welcome to Your App!</h1>
        <p>Click the link below to verify your email address:</p>
        <a href="${verificationUrl}">Verify Email</a>
      `,
    });

    return NextResponse.json(
      { message: "Please check your email to verify your account" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.errors[0].message }, { status: 400 });
    }

    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
