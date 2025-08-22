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

interface BreadcrumbTheme {
  linkColor: string;
  linkHoverColor: string;
  currentPageColor: string;
  separatorColor: string;
}

// Define theme variants with proper contrast ratios
const breadcrumbThemes: Record<string, BreadcrumbTheme> = {
  light: {
    linkColor: "text-blue-700",
    linkHoverColor: "hover:text-blue-900", 
    currentPageColor: "text-gray-900",
    separatorColor: "text-gray-600"
  },
  dark: {
    linkColor: "text-blue-300",
    linkHoverColor: "hover:text-blue-100",
    currentPageColor: "text-white",
    separatorColor: "text-gray-300"
  },
  darkBackground: {
    linkColor: "text-yellow-300",
    linkHoverColor: "hover:text-yellow-100", 
    currentPageColor: "text-white",
    separatorColor: "text-gray-300"
  }
};

export function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  // Determine theme based on className or default to light
  const getTheme = (): BreadcrumbTheme => {
    if (className.includes('dark-background') || className.includes('text-white') || className.includes('dark')) {
      return breadcrumbThemes.darkBackground;
    }
    if (className.includes('light-background') || className.includes('text-gray-600')) {
      return breadcrumbThemes.light;
    }
    return breadcrumbThemes.light;
  };

  const theme = getTheme();

  return (
    <nav aria-label="Breadcrumb" className={`flex items-center space-x-2 text-sm ${className}`}>
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && (
            <ChevronRight className={`h-4 w-4 mx-2 ${theme.separatorColor}`} />
          )}
          
          {item.href && !item.isCurrentPage ? (
            <a 
              href={item.href}
              className={`${theme.linkColor} ${theme.linkHoverColor} transition-colors font-medium underline`}
            >
              {item.label}
            </a>
          ) : (
            <span 
              className={`${
                item.isCurrentPage 
                  ? `${theme.currentPageColor} font-semibold` 
                  : theme.currentPageColor
              }`}
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