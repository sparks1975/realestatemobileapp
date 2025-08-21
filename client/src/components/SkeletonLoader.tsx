import React from 'react';

// Basic skeleton component
export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

// Navigation skeleton
export const NavSkeleton: React.FC = () => (
  <nav className="fixed top-0 w-full backdrop-blur-sm z-50 bg-gray-100">
    <div className="max-w-[1200px] mx-auto px-6 py-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-32" />
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-12">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          <Skeleton className="h-6 w-6" />
        </div>
      </div>
    </div>
  </nav>
);

// Hero section skeleton
export const HeroSkeleton: React.FC = () => (
  <section className="relative min-h-screen flex items-center justify-center bg-gray-50">
    <div className="absolute inset-0">
      <Skeleton className="w-full h-full" />
    </div>
    <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
      <Skeleton className="h-4 w-32 mx-auto mb-6" />
      <Skeleton className="h-16 w-full mb-6" />
      <Skeleton className="h-6 w-3/4 mx-auto mb-8" />
      <Skeleton className="h-12 w-40 mx-auto" />
    </div>
  </section>
);

// Property/Community cards skeleton
export const CardSkeleton: React.FC = () => (
  <div className="group cursor-pointer block">
    <div className="relative overflow-hidden mb-4">
      <Skeleton className="h-80 w-full" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-2" />
        <Skeleton className="h-8 w-1/3" />
      </div>
    </div>
  </div>
);

// Section skeleton
export const SectionSkeleton: React.FC<{ title?: boolean; cards?: number }> = ({ 
  title = true, 
  cards = 3 
}) => (
  <section className="py-24 bg-gray-50">
    <div className="max-w-[1200px] mx-auto px-6">
      {title && (
        <div className="text-center mb-16">
          <Skeleton className="h-4 w-48 mx-auto mb-4" />
          <Skeleton className="h-12 w-96 mx-auto" />
        </div>
      )}
      
      <div className="grid md:grid-cols-3 gap-8">
        {Array.from({ length: cards }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      
      <div className="text-center mt-12">
        <Skeleton className="h-12 w-40 mx-auto" />
      </div>
    </div>
  </section>
);

// Agent section skeleton
export const AgentSectionSkeleton: React.FC = () => (
  <section className="py-24 bg-gray-800">
    <div className="max-w-[1200px] mx-auto px-6">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <Skeleton className="w-full h-96" />
        </div>
        <div>
          <Skeleton className="h-4 w-24 mb-4" />
          <Skeleton className="h-12 w-64 mb-6" />
          <div className="space-y-3 mb-8">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="flex space-x-6 mb-8">
            <div className="text-center">
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-20" />
            </div>
            <div className="text-center">
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <Skeleton className="h-12 w-32" />
        </div>
      </div>
    </div>
  </section>
);

// Footer skeleton
export const FooterSkeleton: React.FC = () => (
  <footer className="py-16 bg-gray-100">
    <div className="max-w-[1200px] mx-auto px-6">
      <div className="text-center">
        <Skeleton className="h-8 w-32 mx-auto mb-8" />
        <div className="flex justify-center space-x-8 mb-8">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-4 w-16" />
          ))}
        </div>
        <div className="flex justify-center space-x-6 mb-8">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="w-8 h-8" />
          ))}
        </div>
        <Skeleton className="h-4 w-64 mx-auto" />
      </div>
    </div>
  </footer>
);

// Full page skeleton
export const HomePageSkeleton: React.FC = () => (
  <div className="min-h-screen bg-gray-50">
    <NavSkeleton />
    <HeroSkeleton />
    <SectionSkeleton title={true} cards={3} />
    <SectionSkeleton title={true} cards={3} />
    <AgentSectionSkeleton />
    <FooterSkeleton />
  </div>
);