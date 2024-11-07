import LifeTable from "../../components/LifeTable";


// Suggestions for using React 19 and Next.js 15:
// 1. Implement Server Components: This page is already a Server Component, which is great for performance.
// 2. Use Streaming SSR: Implement Suspense boundaries for progressive loading.
// 3. Implement parallel routing: For complex UI states, consider using parallel routing.
// 4. Use the new error.js file: Create an error.js file in the same directory to handle errors for this route.
// 5. Leverage TypeScript: Use TypeScript for better type checking and developer experience.
// 6. Implement loading.js: Create a loading.js file in the same directory for a custom loading state.
// 7. Use React Server Components for data fetching: Move data fetching logic into this component.
// 8. Implement Server Actions: For any form submissions or data mutations, use Server Actions.
// 9. Use the new Image component: If you need to display images, use the optimized Next.js Image component.
// 10. Implement API Routes: If needed, use the new app/api directory for creating API routes.


const TablePage = async ({ params }) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const birthDate = new Date(params?.table.slice(1));
  return (
    <div>
      <LifeTable dob={birthDate} />
    </div>
  );
};

export default TablePage;
