'use client'

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Settings, 
  Palette, 
  ShoppingCart, 
  MessageSquare,
  ArrowRight,
  Paintbrush,
  Building
} from 'lucide-react';

interface SettingsNavigationProps {
  currentPage?: 'general' | 'branding' | 'products' | 'products-chat';
}

export default function SettingsNavigation({ currentPage = 'general' }: SettingsNavigationProps) {
  const router = useRouter();

  const navigationItems = [
    {
      id: 'general',
      title: 'General Settings',
      description: 'Tax rates, pricing, and company preferences',
      icon: Settings,
      href: '/settings',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'branding',
      title: 'Company Branding',
      description: 'Logo, colors, and professional appearance',
      icon: Palette,
      href: '/settings/branding',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 'products',
      title: 'Paint Products',
      description: 'Manage your paint catalog and pricing',
      icon: ShoppingCart,
      href: '/settings/products',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 'products-chat',
      title: 'Product Chat Interface',
      description: 'Conversational product management',
      icon: MessageSquare,
      href: '/settings/products/chat',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Settings</h3>
          <p className="text-sm text-gray-600">Configure your painting business preferences</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => router.push(item.href)}
                className={`h-auto p-4 justify-start text-left ${
                  isActive 
                    ? 'bg-blue-50 border-blue-200 border-2' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3 w-full">
                  <div className={`w-10 h-10 rounded-lg ${item.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-medium ${isActive ? 'text-blue-900' : 'text-gray-900'}`}>
                        {item.title}
                      </h4>
                      <ArrowRight className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                    </div>
                    <p className={`text-sm mt-1 ${isActive ? 'text-blue-700' : 'text-gray-600'}`}>
                      {item.description}
                    </p>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
        
        {/* Quick Actions */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Need help setting up?</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push('/setup')}
            >
              <Building className="w-4 h-4 mr-2" />
              Setup Wizard
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}