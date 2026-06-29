import NextLink from "next/link";

export const Logo = ({ width = 140, height = 100 }: { width?: number; height?: number }) => {
  return (
    <NextLink href="/" className="group inline-flex items-center gap-2">
      {/* Botanical mark */}
      <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[#533a00] text-white transition-colors group-hover:bg-[#3d2b1f]">
        <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
          <path
            d="M14 3C14 3 8 7 8 13C8 16 10 19 14 22C18 19 20 16 20 13C20 7 14 3 14 3Z"
            fill="currentColor"
            opacity="0.9"
          />
          <path
            d="M14 8C14 8 11 10 11 13.5C11 15.5 12.5 18 14 20C15.5 18 17 15.5 17 13.5C17 10 14 8 14 8Z"
            fill="white"
            opacity="0.35"
          />
        </svg>
      </span>
      <span className="font-header font-bold text-lg md:text-xl tracking-tight text-[#1a120b]">
        Mariéa <span className="font-light italic">Hair Co.</span>
      </span>
    </NextLink>
  );
};

export const FullLogo = () => <Logo />;