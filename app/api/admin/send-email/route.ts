import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
// @ts-ignore
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { recipients, subject, message, template } = await request.json();

    // For new-products template, use hardcoded subject and message
    const actualSubject = subject || (template === "new-products" ? "New Products Just Dropped! ✨" : undefined);
    const actualMessage = message || (template === "new-products" ? "Exciting news! We've just added some amazing new products to our collection." : undefined);

    if (!actualSubject || !actualMessage) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // If recipients is "all", get all users who want new product notifications
    let recipientEmails: string[];
    if (recipients === "all") {
      const usersWithNotifications = await prisma.user.findMany({
        where: { notifyNewArrivals: true },
        select: { email: true },
      });
      recipientEmails = usersWithNotifications.map(u => u.email);
    } else if (Array.isArray(recipients)) {
      recipientEmails = recipients;
    } else {
      return NextResponse.json({ error: "Invalid recipients" }, { status: 400 });
    }

    if (recipientEmails.length === 0) {
      return NextResponse.json({ error: "No recipients found" }, { status: 400 });
    }
  
  

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const createEmailHtml = (content: string, userName?: string) => {
      const greeting = userName ? `Dear ${userName},` : "Hello,";
      return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>
        body { margin: 0; padding: 0; font-family: Georgia, serif; background-color: #f5f0eb; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background: linear-gradient(135deg, #533a00 0%, #3d2b1f 100%); padding: 40px 30px; text-align: center; }
        .logo { display: inline-flex; align-items: center; gap: 10px; margin-bottom: 20px; }
        .logo-circle { width: 45px; height: 45px; border-radius: 50%; background-color: white; display: flex; align-items: center; justify-content: center; }
        .logo-text { color: white; font-family: Georgia, serif; font-size: 24px; font-weight: bold; }
        .logo-text span { font-weight: normal; font-style: italic; }
        .tagline { color: #e8dfd3; font-family: Arial, sans-serif; font-size: 14px; margin-top: 10px; }
        .content { padding: 40px 30px; color: #1a120b; font-family: Arial, sans-serif; line-height: 1.6; }
        .greeting { font-size: 18px; font-weight: bold; color: #533a00; margin-bottom: 20px; }
        .body-text { font-size: 15px; color: #3d2b1f; white-space: pre-line; }
        .cta { display: inline-block; margin: 25px 0; padding: 14px 30px; background-color: #533a00; color: white; text-decoration: none; border-radius: 4px; font-size: 14px; font-weight: bold; }
        .footer { background-color: #faf7f2; padding: 30px; text-align: center; border-top: 2px solid #e8dfd3; }
        .footer-text { color: #8a7a6a; font-size: 12px; font-family: Arial, sans-serif; }
        .social-links { margin: 15px 0; }
        .social-links a { margin: 0 8px; color: #533a00; text-decoration: none; font-size: 13px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">
                <div class="logo-circle">
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 3C14 3 8 7 8 13C8 16 10 19 14 22C18 19 20 16 20 13C20 7 14 3 14 3Z" fill="#533a00" opacity="0.9"/>
                        <path d="M14 8C14 8 11 10 11 13.5C11 15.5 12.5 18 14 20C15.5 18 17 15.5 17 13.5C17 10 14 8 14 8Z" fill="white" opacity="0.35"/>
                    </svg>
                </div>
                <div class="logo-text">Mariéa <span>Hair Co.</span></div>
            </div>
            <div class="tagline">Natural Hair Care Products</div>
        </div>
        <div class="content">
            <div class="greeting">${greeting}</div>
            <div class="body-text">${content}</div>
            <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://marieahairco.com'}" class="cta">Shop Now</a>
            </div>
        </div>
        <div class="footer">
            <p class="footer-text">© ${new Date().getFullYear()} Mariéa Hair Co. All rights reserved.<br>Lagos, Nigeria</p>
            <div class="social-links"><a href="#">Instagram</a> • <a href="#">Facebook</a> • <a href="#">Twitter</a></div>
            <p class="footer-text" style="margin-top: 15px;">You received this email because you signed up for updates from Mariéa Hair Co.</p>
        </div>
    </div>
</body>
</html>`;
    };

    const createCatalogHtml = async (content: string, userName?: string) => {
      const greeting = userName ? `Dear ${userName},` : "Hello,";

      const users = await prisma.user.findMany({
        where: { email: { in: recipientEmails }, notifyNewArrivals: true },
        select: { email: true, lastNotifiedAt: true },
      });

      const oldestNotified = users
        .map((u) => u.lastNotifiedAt)
        .filter((d): d is Date => d !== null)
        .sort((a, b) => a.getTime() - b.getTime())[0];

      const newProducts = await prisma.product.findMany({
        where: oldestNotified ? { createdAt: { gt: oldestNotified } } : undefined,
        include: { category: true },
        orderBy: { createdAt: "desc" },
        take: 20,
      });

      const productCards = newProducts
        .map(
          (product) => `
            <div style="display: inline-block; width: 48%; margin: 1%; vertical-align: top; border: 1px solid #e8dfd3; border-radius: 8px; overflow: hidden; background: white;">
              ${product.image ? `<img src="${product.image}" alt="${product.name}" style="width: 100%; height: 200px; object-fit: cover; display: block;" />` : ""}
              <div style="padding: 15px;">
                <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #8a7a6a; margin-bottom: 5px;">${product.category?.name || "New Arrival"}</div>
                <h3 style="margin: 0 0 8px; font-size: 16px; color: #1a120b; font-family: Georgia, serif;">${product.name}</h3>
                ${product.tagline ? `<p style="margin: 0 0 10px; font-size: 13px; color: #6a5a4a; font-family: Arial, sans-serif;">${product.tagline}</p>` : ""}
                <div style="font-size: 18px; font-weight: bold; color: #533a00;">$${Number(product.price).toFixed(2)}</div>
              </div>
            </div>
          `
        )
        .join("");

      const productsSection = newProducts.length
        ? `<div style="margin-top: 30px; text-align: center;">
            <h2 style="font-family: Georgia, serif; color: #533a00; font-size: 20px; margin-bottom: 5px;">New Arrivals</h2>
            <p style="color: #8a7a6a; font-size: 13px; margin-bottom: 20px;">Discover our latest products</p>
            <div style="text-align: left;">${productCards}</div>
           </div>`
        : "";

      return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>
        body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f0eb; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background: linear-gradient(135deg, #533a00 0%, #3d2b1f 100%); padding: 40px 30px; text-align: center; }
        .logo { display: inline-flex; align-items: center; gap: 10px; margin-bottom: 15px; }
        .logo-circle { width: 45px; height: 45px; border-radius: 50%; background-color: white; display: flex; align-items: center; justify-content: center; }
        .logo-text { color: white; font-family: Georgia, serif; font-size: 24px; font-weight: bold; }
        .logo-text span { font-weight: normal; font-style: italic; }
        .tagline { color: #e8dfd3; font-family: Arial, sans-serif; font-size: 14px; margin-top: 10px; }
        .content { padding: 40px 30px; color: #1a120b; font-family: Arial, sans-serif; line-height: 1.6; }
        .greeting { font-size: 18px; font-weight: bold; color: #533a00; margin-bottom: 20px; font-family: Georgia, serif; }
        .body-text { font-size: 15px; color: #3d2b1f; white-space: pre-line; }
        .cta { display: inline-block; margin: 25px 0; padding: 14px 30px; background-color: #533a00; color: white; text-decoration: none; border-radius: 4px; font-size: 14px; font-weight: bold; }
        .footer { background-color: #faf7f2; padding: 30px; text-align: center; border-top: 2px solid #e8dfd3; }
        .footer-text { color: #8a7a6a; font-size: 12px; font-family: Arial, sans-serif; }
        .social-links { margin: 15px 0; }
        .social-links a { margin: 0 8px; color: #533a00; text-decoration: none; font-size: 13px; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">
                <div class="logo-circle">
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 3C14 3 8 7 8 13C8 16 10 19 14 22C18 19 20 16 20 13C20 7 14 3 14 3Z" fill="#533a00" opacity="0.9"/>
                        <path d="M14 8C14 8 11 10 11 13.5C11 15.5 12.5 18 14 20C15.5 18 17 15.5 17 13.5C17 10 14 8 14 8Z" fill="white" opacity="0.35"/>
                    </svg>
                </div>
                <div class="logo-text">Mariéa <span>Hair Co.</span></div>
            </div>
            <div class="tagline">✨ Just Launched</div>
        </div>
        <div class="content">
            <div class="greeting">${greeting}</div>
            <div class="body-text">${content}</div>
            ${productsSection}
            <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://marieahairco.com'}" class="cta">Shop Now</a>
            </div>
        </div>
        <div class="footer">
            <p class="footer-text">© ${new Date().getFullYear()} Mariéa Hair Co. All rights reserved.<br>Lagos, Nigeria</p>
            <div class="social-links"><a href="#">Instagram</a> • <a href="#">Facebook</a> • <a href="#">Twitter</a></div>
            <p class="footer-text" style="margin-top: 15px;">You received this email because you signed up for updates from Mariéa Hair Co.</p>
        </div>
    </div>
</body>
</html>`;
    };

    for (const email of recipientEmails) {
      let personalizedMessage = actualMessage;
      const user = await prisma.user.findUnique({
        where: { email },
        select: { name: true, lastNotifiedAt: true },
      });
      const userName = user?.name;
      if (userName) {
        personalizedMessage = actualMessage.replace(/\{name\}/g, userName);
      }

      const html =
        template === "new-products"
          ? await createCatalogHtml(personalizedMessage, userName || undefined)
          : createEmailHtml(personalizedMessage, userName || undefined);

      await transporter.sendMail({
        from: `"Mariéa Hair Co." <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: actualSubject,
        text: personalizedMessage,
        html,
      });

      if (template === "new-products" && user) {
        await prisma.user.update({
          where: { email },
          data: { lastNotifiedAt: new Date() },
        });
      }
    }
  

    return NextResponse.json({ success: true, message: `Email sent to ${recipientEmails.length} recipient(s)` });
  } catch (error) {
  
    console.error("Send email error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}