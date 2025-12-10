export interface CoverStyle {
  type: "gradient" | "image";
  color1?: string;
  color2?: string;
  imageUrl?: string;
  blur?: number;
  grayscale?: number;
  brightness?: number;
  grain?: number;
  showTitle?: boolean;
}

export function ArticleCover({
  title,
  coverStyle,
}: {
  title: string;
  coverStyle?: CoverStyle | null;
}) {
  // Default gradient based on title if no style provided
  const getDefaultGradient = () => {
    return `linear-gradient(135deg, hsl(${
      title.charCodeAt(0) * 137.5
    }, 70%, 50%), hsl(${title.charCodeAt(1) * 137.5}, 70%, 30%))`;
  };

  const getBackgroundStyle = () => {
    if (!coverStyle || coverStyle.type === "gradient") {
      if (coverStyle?.color1 && coverStyle?.color2) {
        return `linear-gradient(135deg, ${coverStyle.color1}, ${coverStyle.color2})`;
      }
      return getDefaultGradient();
    }

    // Image type
    return undefined;
  };

  const getImageStyle = () => {
    if (coverStyle?.type === "image" && coverStyle.imageUrl) {
      const filters = [];
      if (coverStyle.blur) filters.push(`blur(${coverStyle.blur}px)`);
      if (coverStyle.grayscale)
        filters.push(`grayscale(${coverStyle.grayscale}%)`);
      if (coverStyle.brightness)
        filters.push(`brightness(${coverStyle.brightness}%)`);

      return {
        backgroundImage: `url(${coverStyle.imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: filters.join(" "),
      };
    }
    return {};
  };

  const background = getBackgroundStyle();

  return (
    <div
      className="aspect-[2/3] rounded-lg shadow-lg relative overflow-hidden"
      style={{
        background: background,
      }}
    >
      {coverStyle?.type === "image" && coverStyle.imageUrl && (
        <div className="absolute inset-0" style={getImageStyle()} />
      )}
      {coverStyle?.grain && coverStyle.grain > 0 && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: coverStyle.grain / 100,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            mixBlendMode: "overlay",
          }}
        />
      )}
      {coverStyle?.showTitle !== false && (
        <div className="absolute inset-0 h-full p-6 flex items-center justify-center text-white">
          <h3 className="font-serif text-xl font-bold leading-tight text-center drop-shadow-lg">
            {title}
          </h3>
        </div>
      )}
    </div>
  );
}
