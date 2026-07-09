'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-4">
          <h2 className="text-3xl font-bold mb-4">A critical error occurred!</h2>
          <p className="text-slate-400 mb-8 max-w-lg text-center">
            The application encountered a fatal error and could not recover. 
          </p>
          <button
            onClick={() => reset()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Recover Application
          </button>
        </div>
      </body>
    </html>
  );
}
