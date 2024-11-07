import "../styles/globals.css";

export const metadata = {
  title: "Memento",
  description: "Time you lived",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="bg-white dark:bg-black">{children}</body>
    </html>
  );
}

// Suggestions for using React 19 and Next.js 15:
// 1. Implement Server Components: This RootLayout is already a Server Component,
//    which is great for performance. Continue using Server Components for non-interactive parts.
// 2. Use Streaming SSR: Implement <Suspense> boundaries in child components to enable
//    streaming of content, improving perceived load times.
// 3. Utilize the new app directory structure: This file is correctly placed in the app directory.
//    Continue organizing your components and pages within this structure.
// 4. Implement parallel routing: For complex layouts, use the new parallel routing feature
//    to manage multiple page segments simultaneously.
// 5. Create a custom error.js: Add an error.js file in the app directory to handle
//    application-wide errors gracefully.
// 6. Optimize with React Server Components: Fetch data on the server side when possible,
//    reducing client-side JavaScript and improving performance.
// 7. Use Suspense for better loading states: Implement Suspense boundaries around
//    components that may cause suspense, providing smoother loading experiences.
// 8. Leverage the new Image component: When adding images to your layout or child components,
//    use the optimized Next.js Image component for better performance.
// 9. Implement TypeScript: Continue using TypeScript for better type checking and
//    developer experience, as demonstrated in the RootLayoutProps type.
// 10. Create a loading.js file: Add a loading.js file in the app directory to show a
//     loading state while the page is being generated.
// 11. Use new hooks: In client components, utilize new React hooks like useFormState,
//     useFormStatus, and useOptimistic for improved form handling and optimistic updates.
// 12. Implement Server Actions: For form submissions, use Server Actions to handle
//     data mutations directly on the server.
// 13. Use the new `use client` directive: For any client-side interactivity needed in
//     child components, remember to add the `use client` directive at the top of those files.
// 14. Leverage improved CSS support: Take advantage of the built-in CSS support in
//     Next.js 15, including CSS Modules and Sass.
// 15. Implement API Routes: If your app requires backend functionality, use the new
//     app/api directory for creating API routes with improved performance.
