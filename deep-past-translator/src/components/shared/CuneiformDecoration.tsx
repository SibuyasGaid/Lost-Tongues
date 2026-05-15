export default function CuneiformDecoration({ className = '' }: { className?: string }) {
  return (
    <div className={`font-mono text-amber/30 dark:text-amber/20 select-none ${className}`} aria-hidden>
      {'𒀭 𒌋 𒁹 𒀸 𒄿 𒈾 𒄠'}
    </div>
  );
}
