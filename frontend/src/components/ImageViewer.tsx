interface ImageViewerProps {
  src: string | null | undefined;
  alt: string;
}

export function ImageViewer({ src, alt }: ImageViewerProps) {
  if (!src) return null;

  return (
    <div className="relative aspect-square rounded-lg overflow-hidden border">
      <img
        src={src}
        alt={alt}
        className="object-cover w-full h-full"
        onError={(e) => {
          e.currentTarget.src = '/placeholder-image.png';
        }}
      />
    </div>
  );
}