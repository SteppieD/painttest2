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
    <section>
      {/* Background Image with Overlay */}
      <div>
        <Image
          src={imageSrc}
          alt={imageAlt}
          title={imageTitle}
          fill
         
          priority
        />
        <div />
      </div>

      {/* Content */}
      <div>
        <h1>
          {title}
        </h1>
        <p>
          {subtitle}
        </p>
        {children}
      </div>

      {/* Floating Image Card */}
      <div>
        <div>
          <div>
            <Image
              src={imageSrc}
              alt={imageAlt}
              title={imageTitle}
             
             
             
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}