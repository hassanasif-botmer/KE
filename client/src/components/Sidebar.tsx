import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Zap, 
  Thermometer, 
  Receipt 
} from "lucide-react";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Energy Units",
    href: "/energy",
    icon: Zap,
  },
  {
    name: "Temperature Monitoring",
    href: "/temperature",
    icon: Thermometer,
  },
  {
    name: "KE Billing",
    href: "/billing",
    icon: Receipt,
  },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="flex-shrink-0 w-64 bg-white shadow-md" data-testid="sidebar">
      <div className="flex flex-col h-full">
        {/* Logo/Title */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <Zap className="w-8 h-8 text-primary mr-3" data-testid="logo-icon" />
            <div>
              <h1 className="text-lg font-semibold text-gray-900" data-testid="logo-title">
                KHI Energy
              </h1>
              <p className="text-xs text-gray-500" data-testid="logo-subtitle">
                Monitoring System
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const isActive = location === item.href;
              const Icon = item.icon;
              
              return (
                <li key={item.name}>
                  <Link href={item.href}>
                    <a
                      className={`
                        flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200
                        ${isActive 
                          ? 'bg-primary text-white' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }
                      `}
                      data-testid={`nav-link-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </a>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
