import {serve} from '@hono/node-server'
import {Hono} from 'hono';
import {Resend} from "resend";
import 'dotenv/config';
import {cors} from 'hono/cors';


const app = new Hono();
app.use('*', cors(), (c, next) => {
    c.res.headers.set('Content-Security-Policy',
        "default-src 'self'; " +
        "script-src 'self' https://www.google.com https://www.gstatic.com; " +
        "frame-src https://www.google.com https://www.gstatic.com; " +
        "style-src 'self' 'unsafe-inline'; " +
        "object-src 'none'; " +
        "base-uri 'none'"
    );
    return next();
});

serve({
    fetch: app.fetch,
    port: process.env.SERVE_PORT ? Number(process.env.SERVE_PORT) : 3000,
}, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
})

const resend = new Resend(process.env.RESEND_APY_KEY);
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;
const RECAPTCHA_SECRET_KEY = process.env.CAPTCHA_SECRET_KEY;


async function verifyRecaptcha(token: string) {
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `secret=${RECAPTCHA_SECRET_KEY}&response=${token}`
    });

    const data = await res.json();
    console.log('Google Verify', data);
    return data.success && data.score > 0.5;
}

function isValidEmail(email: string): boolean {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
}

app.post('/subscribe', async (c) => {
    const {email, recaptchaToken} = await c.req.json();

    if (!email || !recaptchaToken) {
        return c.json({error: 'Email or token missing'}, 400);
    }

    if (!isValidEmail(email)) {
        return c.json({message: 'Insert a valid email address.'}, 422);
    }

    const isValid = await verifyRecaptcha(recaptchaToken);
    if (!isValid) {
        return c.json({error: 'Invalid captcha'}, 400);
    }

    try {
        await resend.contacts.create({
            email,
            audienceId: AUDIENCE_ID ?? "",
        });

        await resend.emails.send({
            from: 'CodexPulse <codexpulse@newsletter.carminedeveloper.it>',
            to: [email],
            subject: 'Welcome to CodexPulse!',
            html: `<!DOCTYPE html>
                   <html lang="en">
                   <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Welcome in CodexPulse</title>
                        <!--[if mso]>
                            <style type="text/css">
                                .gradient-text {color: #3b82f6 !important;}
                            </style>
                        <![endif]-->    
                   </head>
                   <body style="margin: 0; padding: 0; background: #0f172a; font-family: 'Inter', Arial, sans-serif; color: #f8fafc;">
                        <table role="presentation" cellpadding="0" width="100%" style="background: #0f172a; padding: 20px 0; margin: 0;">
                            <tr>
                                <td align="center">
                                    <!--[if (gte mso 9)|(IE)]>
                                        <table align="center" border="0" cellspacing="0" cellpadding="0" width="600">
                                        <tr>
                                        <td align="center" valign="top" width="600">
                                        </table>
                                    <![endif]-->    
                                    <table cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background: #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
                                        <!--Header-->
                                        <tr>
                                           <td align="center" style="padding: 40px 20px 20px;">
                                                <div style="font-size: 32px; font-weight: 800; background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; display: inline-block; mso-color-alt: #3b82f6;" class="gradient-text">
                                                    Welcome to CodexPulse!
                                                </div>
                                           </td>
                                        </tr>
                                        <!--Hero Icon-->
                                        <tr>
                                            <td align="center" style="padding: 10px 0 20px;">
                                                <img src="https://raw.githubusercontent.com/C0MPL3XDEV/newsletter-ai-backend/main/src/images/fluent-emoji--rocket.png" width="80" height="80" alt="CodexPulse Launch" style="display: block; width: 80px; height: auto;">
                                            </td>
                                        </tr>
                                        <!--Content-->
                                        <tr>
                                            <td style="padding: 0 30px 20px; color: #e2e8f0; font-size: 16px; line-height: 1.7;">
                                                <p>✨ <strong>You're in!</strong> We're thrilled to welcome you to our community.</p>
                                                <p style="margin: 0 0 20px;">Expect cutting-edge insights on:</p>
                                                <ul style="margin: 0 0 20px; padding-left: 20px">
                                                    <li style="margin-bottom: 8px">🤖 AI breakthroughs & app</li>
                                                    <li style="margin-bottom: 8px">💻 Developer tools & best practices</li>
                                                    <li style="margin-bottom: 8px">🔐 Cybersecurity trends & protections</li>
                                                </ul>
                                                <p style="margin: 0 0 20px">All driven by the AI</p>
                                                <p style="margin: 0 0 20px"><strong>Our inaugural edition will launch in your inbox soon!</strong></p>
                                            </td>
                                        </tr>
                                        <!--Social Section-->
                                        <tr>
                                            <td align="center" style="padding:10px 0 30px;">
                                                <p style="color:#cbd5e1;font-size:16px;margin:0 0 15px;">Join our community now:</p>
                                                <div style="display:flex;justify-content:center;gap:24px;">
                                                    <a href="https://github.com/C0MPL3XDEV" target="_blank" style="display:inline-block;transition:transform 0.3s;">
                                                      <img src="https://cdn-icons-png.flaticon.com/512/733/733553.png" width="36" height="36" alt="GitHub" style="display:block;width:36px;height:auto;">
                                                    </a>
                                                    <a href="https://instagram.com/carmine.developer" target="_blank" style="display:inline-block;transition:transform 0.3s;">
                                                      <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" width="36" height="36" alt="Instagram" style="display:block;width:36px;height:auto;">
                                                    </a>
                                                    <a href="https://www.linkedin.com/in/carmine-giuseppe-chessa-018750261/" target="_blank" style="display:inline-block;transition:transform 0.3s;">
                                                      <img src="https://cdn-icons-png.flaticon.com/512/3536/3536505.png" width="36" height="36" alt="LinkedIn" style="display:block;width:36px;height:auto;">
                                                    </a>
                                                </div>
                                            </td>
                                        </tr>
                                        <!--Footer-->
                                        <tr>
                                            <td style="background:#0f172a;padding:25px 30px;color:#94a3b8;font-size:13px;line-height:1.5;">
                                                <p style="margin:0 0 8px;">You received this email because you signed up at CodexPulse</p>
                                                <p style="margin:0 0 8px;">
                                                    <a href="#" style="color:#60a5fa;text-decoration:none;">Unsubscribe</a>
                                                </p>
                                                <p style="margin:15px 0 0;">© 2025 CodexPulse. All rights reserved.</p>
                                            </td>
                                        </tr>
                                    </table>
                                    <!--[if (gte mso 9)|(IE)]>
                                        </td>
                                        </tr>
                                        </table>
                                    <![endif]-->
                                </td>
                            </tr>
                        </table>
                        <!-- Fallback for Outlook gradient text -->
                        <!--[if mso]>
                            <style>
                              .gradient-text {
                                color: #3b82f6 !important;
                                background: none !important;
                              }
                            </style>
                        <![endif]-->
                   </body>
                   </html>`,
            text: `
                Thank you for signing up to CodexPulse!
    
                You'll receive updates soon on the launch of our AI-powered newsletter focused on tech, dev, and cybersecurity.
                        
                Follow us on:
                GitHub: https://github.com/C0MPL3XDEV
                Instagram: https://instagram.com/carmine.developer
                        
                You received this email because you signed up for our newsletter.
            `
        });
        return c.json({success: true, message: 'Email successfully registered.'});
    } catch (err) {
        console.log(err);
        return c.json({error: 'Error while register the email'}, 500);
    }
})

app.get('/', (c) => {
    return c.text('Hello Hono!')
})

app.get('/test-call', (c) => {
    return c.json({success: true, message: 'TEST_CALL'});
})

export default app;
