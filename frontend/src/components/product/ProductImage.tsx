import { ImageOff } from "lucide-react";
import { useState } from "react";

interface ProductImageProps {
  src: string | null;
  alt: string;
  className?: string;
  imageClassName?: string;
}

export default function ProductImage({
  src,
  alt,
  className = "",
  imageClassName = "",
}: ProductImageProps) {
  const [hasError, setHasError] = useState(false);

  const showFallback = !src || hasError;

  return (
    <div
      className={`flex overflow-hidden bg-slate-100 ${className}`}
    >
      {showFallback ? (
        <div className="flex min-h-full w-full flex-col items-center justify-center gap-3 text-slate-400">
          <ImageOff size={32} />
          <span className="px-4 text-center text-xs font-medium">
            Image coming soon
          </span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setHasError(true)}
          className={`h-full w-full object-contain ${imageClassName}`}
        />
      )}
    </div>
  );
}
