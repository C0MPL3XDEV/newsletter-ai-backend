import {serve} from '@hono/node-server'
import {Hono} from 'hono'
import {cors} from 'hono/cors';
import {Resend} from "resend";
import 'dotenv/config';

const app = new Hono();
app.use('*', cors());

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
            from: 'Newsletter <no-reply@newsletter.carminedeveloper.it>',
            to: [email],
            subject: 'Welcome to CodexPulse!',
            html: `<div style="
             font-family: 'Segoe UI', sans-serif;
             padding: 2rem;
             background-color: #0f0f11;
             color: #e5e5e5;
             text-align: center;
             ">
               <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 20 20">
                  <path fill="#fff" d="m14.878.282l.348 1.071a2.2 2.2 0 0 0 1.399 1.397l1.071.348l.021.006a.423.423 0 0 1 0 .798l-1.071.348a2.2 2.2 0 0 0-1.399 1.397l-.348 1.07a.423.423 0 0 1-.798 0l-.349-1.07a2.2 2.2 0 0 0-.532-.867a2.2 2.2 0 0 0-.866-.536l-1.071-.348a.423.423 0 0 1 0-.798l1.071-.348a2.2 2.2 0 0 0 1.377-1.397l.348-1.07a.423.423 0 0 1 .799 0m4.905 7.931l-.766-.248a1.58 1.58 0 0 1-.998-.999l-.25-.764a.302.302 0 0 0-.57 0l-.248.764a1.58 1.58 0 0 1-.984.999l-.765.248a.303.303 0 0 0 0 .57l.765.249a1.58 1.58 0 0 1 1 1.002l.248.764a.302.302 0 0 0 .57 0l.249-.764a1.58 1.58 0 0 1 .999-.999l.765-.248a.303.303 0 0 0 0-.57zM17.502 12a1.33 1.33 0 0 1-.746-.23c-.22-.16-.38-.371-.48-.621l-.26-.802a.5.5 0 0 0-.14-.22a.6.6 0 0 0-.22-.14l-.762-.25c-.27-.1-.49-.261-.65-.481s-.24-.481-.24-.752c0-.19.04-.38.12-.55q-.24-.06-.45-.21a1.5 1.5 0 0 1-.521-.692l-.36-1.092c-.09-.23-.18-.36-.29-.47a1.3 1.3 0 0 0-.471-.291l-1.061-.35a1.4 1.4 0 0 1-.471-.267v12.67a2.973 2.973 0 0 0 4.888-1.64l.037-.187a3.25 3.25 0 0 0 2.56-3.498a1.5 1.5 0 0 1-.483.073M9.5 2.462a2.423 2.423 0 0 0-3.8 1.486l-.125.627l-.406.081A2.7 2.7 0 0 0 3 7.302V7.5c0 .726.31 1.38.805 1.837a3.248 3.248 0 0 0 .77 6.088l.037.185A2.973 2.973 0 0 0 9.5 17.251z" />
               </svg>       
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 48 48">
                        <path fill="none" stroke="#fff" stroke-linecap="round" stroke-width="4" d="M29.344 30.477c2.404-.5 4.585-1.366 6.28-2.638C38.52 25.668 40 22.314 40 19c0-2.324-.881-4.494-2.407-6.332c-.85-1.024 1.636-8.667-.573-7.638c-2.21 1.03-5.45 3.308-7.147 2.805A20.7 20.7 0 0 0 24 7c-1.8 0-3.532.223-5.147.634C16.505 8.232 14.259 6 12 5.03c-2.26-.97-1.026 6.934-1.697 7.765C8.84 14.605 8 16.73 8 19c0 3.314 1.79 6.668 4.686 8.84c1.93 1.446 4.348 2.368 7.054 2.822m0 0q-1.738 1.913-1.738 3.632v8.717m11.343-12.534q1.646 2.16 1.646 3.88v8.654M6 31.216q1.349.165 2 1.24c.652 1.074 3.074 5.062 5.825 5.062h4.177" />
                    </svg>
                  </a>
                  <a href="https://instagram.com/carmine.developer" style="margin: 0 5px;" target="_blank" rel="noopener">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
                      <path fill="#fff" d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3" />
                    </svg>
                  </a>
               </div>
               <footer style="margin-top: 2rem; font-size: 0.85rem; color: #888;">
                  You received this email because you signed up for our newsletter.
               </footer>
            </div>`
        });
        return c.json({success: true, message: 'Email registrata con successo'});
    } catch (err) {
        console.log(err);
        return c.json({error: 'Errore durante la registrazione'}, 500);
    }
})

app.get('/', (c) => {
    return c.text('Hello Hono!')
})

export default app;

serve({
    fetch: app.fetch,
    port: 8000
}, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
})
