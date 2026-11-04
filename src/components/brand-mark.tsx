type BrandMarkProps = {
  className?: string;
};

export function BrandMark({ className }: BrandMarkProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 52 62"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M26 3.5C20.8 12.1 7.3 26.1 7.3 37.5a18.7 18.7 0 0 0 37.4 0C44.7 26.1 31.2 12.1 26 3.5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
      />
      <path
        d="M14.4 35.1c4.2-3.8 8.3-3.8 12.5 0 4.1 3.7 8.3 3.7 12.5 0M14.4 42.8c4.2-3.8 8.3-3.8 12.5 0 4.1 3.7 8.3 3.7 12.5 0"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="3"
      />
    </svg>
  );
}
