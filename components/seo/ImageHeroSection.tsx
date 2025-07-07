import Image from 'next/image';
import { ReactNode } from 'react';

interface ImageHeroSectionProps {
  title: ReactNode;
  subtitle: string;
  imageSrc: string;
  imageAlt: string;
  imageTitle?: string;
  children?: ReactNode;
  backgroundClass?: string;
}

export function ImageHeroSection({
  title,
  subtitle,
  imageSrc,
  imageAlt,
  imageTitle,
  children,
  backgroundClass = "bg-gradient-to-br from-blue-50 to-indigo-100"
}: ImageHeroSectionProps) {
  return (
    <section className={`relative py-16 px-4 ${backgroundClass} overflow-hidden`}>
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imageSrc}
          alt={imageAlt}
          title={imageTitle}
          fill
          className="object-cover opacity-10"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto text-center max-w-4xl relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          {title}
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          {subtitle}
        </p>
        {children}
      </div>

      {/* Floating Image Card */}
      <div className="container mx-auto mt-12 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={imageSrc}
              alt={imageAlt}
              title={imageTitle}
              width={1200}
              height={600}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}