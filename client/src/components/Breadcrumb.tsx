import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrentPage?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  // Determine if this is a dark or light background based on context
  const isDarkBackground = className.includes('dark-background') || className.includes('text-white') || className.includes('dark');

  return (
    <nav aria-label="Breadcrumb" className={`flex items-center space-x-2 text-sm ${className}`}>
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && (
            <ChevronRight 
              className="h-4 w-4 mx-2 opacity-70" 
              style={{ 
                color: isDarkBackground ? 'var(--navigation-color)' : 'var(--text-color)' 
              }}
            />
          )}
          
          {item.href && !item.isCurrentPage ? (
            <a 
              href={item.href}
              className="transition-colors font-medium underline hover:opacity-80"
              style={{ 
                color: isDarkBackground ? 'var(--link-hover-color)' : 'var(--link-color)' 
              }}
            >
              {item.label}
            </a>
          ) : (
            <span 
              className={`${item.isCurrentPage ? 'font-semibold' : ''}`}
              style={{ 
                color: isDarkBackground ? 'var(--navigation-color)' : 'var(--text-color)' 
              }}
            >
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}

// Helper function to create common breadcrumb structures
export const createPropertyBreadcrumbs = {
  // For properties listing page
  propertiesList: (): BreadcrumbItem[] => [
    { label: "Home", href: "/" },
    { label: "Properties", isCurrentPage: true }
  ],
  
  // For individual property detail page
  propertyDetail: (propertyTitle?: string): BreadcrumbItem[] => [
    { label: "Home", href: "/" },
    { label: "Properties", href: "/properties" },
    { 
      label: propertyTitle || "Property Details", 
      isCurrentPage: true 
    }
  ],
  
  // For admin properties page
  adminProperties: (): BreadcrumbItem[] => [
    { label: "Admin", href: "/admin" },
    { label: "Properties", isCurrentPage: true }
  ],
  
  // For admin property edit page
  adminPropertyEdit: (propertyTitle?: string): BreadcrumbItem[] => [
    { label: "Admin", href: "/admin" },
    { label: "Properties", href: "/properties" },
    { 
      label: propertyTitle ? `Edit: ${propertyTitle}` : "Edit Property", 
      isCurrentPage: true 
    }
  ]
};