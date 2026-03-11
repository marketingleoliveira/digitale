import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { Skeleton } from "@/components/ui/skeleton";

// Configure worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

interface PdfViewerProps {
  url: string;
  title?: string;
}

export function PdfViewer({ url, title }: PdfViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const renderPdf = async () => {
      setLoading(true);
      setError(null);

      const container = containerRef.current;
      if (!container) return;

      // Clear previous renders
      container.innerHTML = "";

      try {
        const pdf = await pdfjsLib.getDocument(url).promise;

        for (let i = 1; i <= pdf.numPages; i++) {
          if (cancelled) return;

          const page = await pdf.getPage(i);
          const containerWidth = container.clientWidth;
          const unscaledViewport = page.getViewport({ scale: 1 });
          const scale = containerWidth / unscaledViewport.width;
          const viewport = page.getViewport({ scale });

          const canvas = document.createElement("canvas");
          canvas.width = viewport.width * window.devicePixelRatio;
          canvas.height = viewport.height * window.devicePixelRatio;
          canvas.style.width = "100%";
          canvas.style.height = "auto";
          canvas.style.display = "block";

          const ctx = canvas.getContext("2d");
          if (!ctx) continue;

          ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

          await page.render({
            canvasContext: ctx,
            viewport,
          }).promise;

          if (!cancelled) {
            container.appendChild(canvas);
          }
        }
      } catch (err) {
        if (!cancelled) {
          console.error("PDF render error:", err);
          setError("Não foi possível carregar o PDF.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    renderPdf();
    return () => { cancelled = true; };
  }, [url]);

  if (error) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>{error}</p>
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-accent underline mt-2 inline-block">
          Abrir PDF em nova aba
        </a>
      </div>
    );
  }

  return (
    <div>
      {loading && (
        <div className="p-6 space-y-4">
          <Skeleton className="h-[600px] w-full" />
        </div>
      )}
      <div ref={containerRef} className="w-full" />
    </div>
  );
}
