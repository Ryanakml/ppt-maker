This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Documentation

1. Create Project

```bash
bunx create-next-app@15.3.0 .
```

2. create env and initate all service api variables

3. initialize shadcn

```bash
bunx --bun shadcn@latest init
```

4. add all shadcn components

```bash
bunx --bun shadcn@latest add -a
```

5. initialize project folder for later

```bash
cd src
mkdir actions provider store icons
```

6. initialize global atomic folder for shadcn

```bash
cd src/components
mkdir global
```

7. add dark mode from shadcn

```bash
cd ../..
bun add next-themes
```

8. making the darkmode componentn inside src/provider/theme-provider.tsx

```bash
touch src/provider/theme-provider.tsx
```

9. Wrap Dark Mode Provider in Layout

```jsx
<ThemeProvider
attribute={'class'}
defaultTheme="dark"
enableSystem
disableTransitionOnChange
>
    {children}
    <Toaster position="top-right" richColors />
</ThemeProvider>
```

also adding supress hidration warning caused by clerk

```jsx
suppressHydrationWarning
```

10. Update global css, shadcn component and also page and text

11. add clerk provider into system for user management

```bash
bun add @clerk/nextjs --force
```

then add the middleware.ts for the middle provider, the main function is to protect some route, need to login first. so the user can access it. but we add a little logic for conditional, if the url is public, then dont force to login first. in detail the route /sign-in and /sign-up is public. end then if the route is not public and user not auth, it will redirect into public route, which is /sign-in or /sign-up

12. wire up the clerk by wrapping entire app layout into clerk provider component

```jsx
    <ClerkProvider
    appearance={{
      theme: dark,
    }}>
    ...
    </ClerkProvider>
```