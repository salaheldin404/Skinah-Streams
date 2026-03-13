"use client";

import KhatmaCompletionContent from "@/components/khatma/KhatmaCompletionContent";

const KhatmaCompletionPage = () => {

  return (
    <main className="min-h-screen py-8 bg-background">
      <div className="max-w-2xl mx-auto px-4">
        <div className="rounded-2xl border border-border/50 shadow-xl overflow-hidden">
          <KhatmaCompletionContent mode="page" />
        </div>
      </div>
    </main>
  );
};

export default KhatmaCompletionPage;
