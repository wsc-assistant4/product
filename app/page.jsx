// app/page.jsx
import SolutionFinder from "./components/SolutionFinder";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 bg-gray-50">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-brand-primary tracking-tight">
                Navigator Solusi Keberlanjutan
            </h1>
            <p className="text-lg md:text-xl text-neutral-medium mt-4 max-w-2xl mx-auto">
                Jawab beberapa pertanyaan singkat untuk menemukan layanan yang paling tepat guna bagi organisasi Anda.
            </p>
        </div>
        
        <SolutionFinder />

        <div className="text-center mt-8 text-sm text-gray-400">
          Powered by Wise Steps Consulting
        </div>
      </div>
    </main>
  );
}