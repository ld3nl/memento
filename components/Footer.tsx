import { KofiButton } from "./KofiButton";

export const Footer = () => {
  return (
    <footer className="mt-auto py-8 text-center">
      <div className="mb-4">
        <KofiButton size="small" />
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        If this helped you reflect on life, consider supporting the project
      </p>
    </footer>
  );
};
