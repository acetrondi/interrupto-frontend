import useCombinedTranscriptions from "@/hooks/useCombinedTranscriptions";
import * as React from "react";

export default function TranscriptionView() {
  const combinedTranscriptions = useCombinedTranscriptions();
  const containerRef = React.useRef<HTMLDivElement>(null);

  // scroll to bottom when new transcription is added
  React.useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [combinedTranscriptions]);

  return (
    <div className="relative h-[300px] w-full mx-auto">
      {/* Fade-out gradient masks with storyteller colors */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-[var(--color-bg-card)] to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[var(--color-bg-card)] to-transparent z-10 pointer-events-none" />

      {/* Scrollable content */}
      <div ref={containerRef} className="h-full flex flex-col gap-3 overflow-y-auto px-4 py-8">
        {combinedTranscriptions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-4xl mb-3 wiggle">📖</div>
            <p className="text-[var(--color-text-secondary)] text-lg font-medium">
              Your story will appear here...
            </p>
            <p className="text-[var(--color-text-light)] text-sm mt-2">
              🎭 Ready to begin your adventure? 🌟
            </p>
          </div>
        ) : (
          combinedTranscriptions.map((segment, index) => (
            <div
              id={segment.id}
              data-index={index}
              key={segment.id}
              className={`theme-transition ${segment.role === "assistant"
                ? "storyteller-message-ai"
                : "storyteller-message-user"
                }`}
            >
              <div className="flex items-start gap-2">
                <span className="text-xl flex-shrink-0 mt-1">
                  {segment.role === "assistant" ? "🎭" : "💬"}
                </span>
                <div className="flex-1">
                  <div className="text-xs font-medium mb-1 text-[var(--color-text-light)]">
                    {segment.role === "assistant" ? "AI Storyteller" : "You"}
                  </div>
                  <div className="text-[var(--color-text-primary)] leading-relaxed">
                    {segment.text}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
