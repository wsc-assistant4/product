// app/page.jsx

import SolutionFinder from "./components/SolutionFinder";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 bg-neutral-light">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-brand-primary">
                Navigator Solusi Keberlanjutan
            </h1>
            <p className="text-md md:text-lg text-neutral-medium mt-2">
                Temukan solusi yang tepat untuk organisasi Anda dalam 2 menit.
            </p>
        </div>
        
        <SolutionFinder />
      </div>
    </main>
  );
}