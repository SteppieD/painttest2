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
    <Card>
      <CardContent>
        <div>
          <h3>Settings</h3>
          <p>Configure your painting business preferences</p>
        </div>
        
        <div>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => router.push(item.href)}
               `}
              >
                <div>
                  <div flex items-center justify-center`}>
                    <Icon`} />
                  </div>
                  
                  <div>
                    <div>
                      <h4`}>
                        {item.title}
                      </h4>
                      <ArrowRight`} />
                    </div>
                    <p`}>
                      {item.description}
                    </p>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
        
        {/* Quick Actions */}
        <div>
          <div>
            <span>Need help setting up?</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push('/setup')}
            >
              <Building />
              Setup Wizard
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}