import {serve} from '@hono/node-server'
import {Hono} from 'hono'
import {cors} from 'hono/cors';
import {Resend} from "resend";
import 'dotenv/config';


const app = new Hono();
app.use('*', cors());

serve({
    fetch: app.fetch,
    port: process.env.PORT ? Number(process.env.PORT) : 3000,
}, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
})

const resend = new Resend(process.env.RESEND_APY_KEY);
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

app.post('/subscribe', async (c) => {
    const {email} = await c.req.json();

    if (!email || !email.includes('@')) {
        return c.json({message: 'Insert a valid email address.'}, 422);
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
            html: `<div style="
             font-family: 'Segoe UI', sans-serif;
             padding: 2rem;
             background-color: #0f0f11;
             color: #e5e5e5;
             text-align: center;
             ">
               <img src="https://raw.githubusercontent.com/C0MPL3XDEV/newsletter-ai-backend/main/src/images/svgviewer-png-output(2).png" alt="codexpulse" height="30" width="30">      
               <h1 style="
                  font-size: 1.75rem;
                  font-weight: bold;
                  background: linear-gradient(to right, #ec4899, #8b5cf6);
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                  margin-bottom: 1rem;
                  ">
                  Thank you for signing up!
               </h1>
               <p style="margin-bottom: 1rem;">
                  You'll receive updates soon on the launch of our AI-powered newsletter focused on tech, dev, and cybersecurity.
               </p>
               <p style="margin-top: 1rem;">In the meantime, follow us on:</p>
               <div style="margin-top: 0.5rem;">
                  <a href="https://github.com/C0MPL3XDEV" style="margin: 0 10px;" target="_blank" rel="noopener">
                    <img src="https://raw.githubusercontent.com/C0MPL3XDEV/newsletter-ai-backend/main/src/images/github.png" alt="github" width="30" height="30">
                  </a>
                  <a href="https://instagram.com/carmine.developer" style="margin: 0 5px;" target="_blank" rel="noopener">
                    <img src="https://raw.githubusercontent.com/C0MPL3XDEV/newsletter-ai-backend/main/src/images/svgviewer-png-output.png" alt="instagram" width="30" height="30">
                  </a>
               </div>
               <footer style="margin-top: 2rem; font-size: 0.85rem; color: #888;">
                  You received this email because you signed up for our newsletter.
               </footer>
            </div>`,
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
