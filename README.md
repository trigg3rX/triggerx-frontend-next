# triggerx-frontend

Next App for TriggerX

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Dependencies

- Node v20

## Getting Started

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## File Structure

```
triggerx-frontend-next/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # Create API page
│   │   ├── createjob/            # Job Creation page
│   │   ├── dashboard/            # Dashboard page
│   │   ├── devhub/               # Devhub page
│   │   │   └── [slug]/           # Devhub post page
│   │   ├── leaderboard/          # Leaderboard page
│   │   ├── page.js               # Landing page
│   │   ├── App.js                # App component
│   │   ├── layout.js             # Layout component
│   │   ├── not-found.js          # Not found page
│   │   └── providers.js          # Providers component
│   ├── assets/                   # Static Assets
│   ├── components/               # React components
│   │   ├── createjob/            # Create job components
│   │   │   └── ...               # Components related to createjob page
│   │   ├── layout/               # Layout components
│   │   │   └── Layout.js         # Layout (each page uses this layout)
│   │   └── ui/                   # UI components
│   │       ├── Header.js            
│   │       ├── HeaderPoint.js       
│   │       ├── Footer.js            
│   │       └── WalletModal.js       
│   ├── hooks/                    # React hooks (all for createjob page)
│   └── lib/                      # Utility functions (Sanity)
└── triggerx-devhub/              # Devhub components
```
