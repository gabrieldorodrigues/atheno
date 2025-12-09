export function ArticleCover({ title }: { title: string }) {
  return (
    <div
      className="aspect-[2/3] rounded-lg shadow-lg"
      style={{
        background: `linear-gradient(135deg, hsl(${
          title.charCodeAt(0) * 137.5
        }, 70%, 50%), hsl(${title.charCodeAt(1) * 137.5}, 70%, 30%))`,
      }}
    >
      <div className="h-full p-6 flex items-center justify-center text-white">
        <h3 className="font-serif text-xl font-bold leading-tight text-center">
          {title}
        </h3>
      </div>
    </div>
  );
}
