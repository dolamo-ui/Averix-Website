# Edit the News page yourself (Firebase)

The site has a private page at **/admin** where you sign in and add, edit or delete News posts.
Until Firebase is connected, the site shows built-in sample posts, so nothing breaks.

## 1. Create the Firebase project
1. Go to https://console.firebase.google.com and sign in with a Google account.
2. Click **Create a project**, name it `averix-games`, and finish the steps (Google Analytics is not needed).

## 2. Register the website and copy the keys
1. On the project home, click the web icon `</>` (Add app). Nickname: `Averix Website`. Do not tick Hosting.
2. Firebase shows a block called `firebaseConfig`. Copy these four values: `apiKey`, `authDomain`, `projectId`, `appId`.
3. In the project, copy `.env.example` to `.env.local` and paste them in:
```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```
(These keys are not secrets. The rules in step 5 are what protect your data.)

## 3. Turn on the database
Build > **Firestore Database** > **Create database** > choose a location near your users (for South Africa: `europe-west1` or `africa-south1` if offered) > **Start in production mode**.

## 4. Turn on sign-in and create the admin account
1. Build > **Authentication** > **Get started** > **Email/Password** > Enable > Save.
2. Open the **Users** tab > **Add user**. Enter the admin's email and a strong password. Do this for each person who may edit.
3. Copy each person's **User UID** (the long code in the Users table).

## 5. Lock the database (important)
Firestore > **Rules** tab. Replace everything with the contents of `firestore.rules` in this project, and replace `PASTE_ADMIN_USER_UID_HERE` with the UID(s) from step 4 (several: `'uid1', 'uid2'`). Click **Publish**.
This lets everyone read the news but only your admins change it.

## 6. Put the site online with the keys
In Netlify: Site settings > Environment variables > add the same four `NEXT_PUBLIC_FIREBASE_...` values, then redeploy.

## 7. Use it
1. Go to `your-site/admin` and sign in.
2. First time: click **Add the 6 sample posts** to load the current posts (or start fresh with **New post**).
3. **New post** > fill in the form > **Publish**. It shows on the News page within about a minute. No redeploy needed.

## Notes
- Keep the "Link name" of `discord-open` and `project-status` unchanged: the home page links to them (`/news#discord-open`).
- Paragraphs: leave a blank line between them in "Full update".
- `/admin` is hidden from Google and not in the menu. Only people you added in step 4 can use it.
- If you see "Could not save", the UID in the rules does not match the signed-in user.

---

# Events and ticket links (Computicket)

The same `/admin` page has an **Events** tab. Each event can have a **Ticket link**; when it is filled in, the event panel on the Events page shows a **Buy ticket on Computicket** button that opens that page in a new tab. Payment happens on Computicket, never on the Averix site.

## One-time: update the rules
Firestore > **Rules**. Use the latest `firestore.rules` from this project. It now has two blocks, `newsPosts` and `events`. Put your admin UID in **both** places (replace `PASTE_ADMIN_USER_UID_HERE`) and click **Publish**. Without this, saving an event says "Could not save".

## Add an event
1. Go to `/admin`, sign in, open the **Events** tab, click **New event**.
2. Fill in: name, type, date, start time (South African time), length in hours, entry fee, prize, participants, format, platform and ticket status.
3. **Ticket link:** paste the full web address (starting with `https://`) of the event's page on Computicket. Leave it empty if tickets are not on sale yet. Set **Ticket status** to "Open" when tickets are on sale.
4. Click **Publish**. It shows on the Events page within about a minute.

## Getting the Computicket link
1. The event must first be listed on Computicket. Computicket has a self-service "Box Office" for organisers: see https://www.computicket.com (look for "Sell your event") or email salesinfo@computicket.com.
2. When the event is live there, open its page on computicket.com, copy the address from the browser bar, and paste it into **Ticket link**.

## Good to know
- Once Firebase is connected, the Events page shows **only the events you add** (the sample events disappear). Until you add one, the page shows "No events match".
- Past events stay on the page under "Past" with a "Completed" label and no ticket button.
- Only `https://` links are accepted; anything else is ignored for safety.
- The **Home page** shows the next two upcoming events, and the **Community page** shows the match schedule (up to 6 upcoming events) with a countdown. Both come from the same Events tab, so you only enter an event once.
- If an event has a Ticket link, its Home card and Community card get a **Buy ticket on Computicket** button.
- With no upcoming events, these sections show a short "no events yet, join the Discord" message.

---

# Enquiry form saves to the admin (Enquiries tab)

When someone sends the Partnerships form, the message is now **saved in your Firebase database** and shows in `/admin` > **Enquiries**.

## One-time: replace the rules again (important)
`firestore.rules` changed. It now lists the admin UID in **one place** (the `isAdmin()` function at the top) and adds an `enquiries` block. Firestore > **Rules**: paste the whole new file, put your UID in `PASTE_ADMIN_USER_UID_HERE`, **Publish**.
Without this, the form shows "could not save" for visitors and falls back to copying the message.

## Using the inbox
- Open `/admin` > **Enquiries**. New messages have a **NEW** badge, and the tab shows how many are new once you have opened it.
- Click a row to read it. **Reply by email** opens your email app. **Mark as handled** moves it out of "New only". **Delete** removes it.

## Spam protection included
A hidden trap field catches simple bots, a visitor must wait 30 seconds between sends, and the rules only accept messages of the expected shape and size. For stronger protection later, turn on Firebase **App Check**.

## Later: automation (Make): alert the admin + save to Google Sheets
The site is already prepared. When you are ready:
1. In Make.com create a scenario that starts with **Webhooks > Custom webhook**. Copy the webhook URL.
2. Add the modules **Google Sheets > Add a row** (map: type, name, email, org, message, sentAt) and **Gmail/Email > Send an email** to the admin.
3. Put the URL in `.env.local` and in Netlify as `NEXT_PUBLIC_ENQUIRY_WEBHOOK_URL=...`, then redeploy.
Every new enquiry is then also sent to Make. Leave it empty to keep the automation off.
Note: the webhook URL is visible in the page code, so if you ever see junk entries, replace the URL in Make and Netlify with a new one.
