// Import React to ensure the file is treated as a module
import React from "react";

const LoadingPage = () => {
  return (
    <div className="m-auto flex h-screen items-center justify-center">
      <div className="h-32 w-32 animate-spin rounded-full border-t-2 border-b-2 border-purple-500" />
    </div>
  );
};

export default LoadingPage;
