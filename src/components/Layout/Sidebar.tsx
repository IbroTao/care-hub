import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Package,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Heart,
  UserPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['admin', 'doctor', 'patient']
  },
  {
    name: 'Admin Panel',
    href: '/admin',
    icon: Settings,
    roles: ['admin']
  },
  {
    name: 'Patients',
    href: '/patients',
    icon: Users,
    roles: ['admin', 'doctor']
  },
  {
    name: 'Appointments',
    href: '/appointments',
    icon: Calendar,
    roles: ['admin', 'doctor', 'patient']
  },
  {
    name: 'Resources',
    href: '/resources',
    icon: Package,
    roles: ['admin', 'doctor']
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    roles: ['admin', 'doctor']
  }
];

export const Sidebar = ({ collapsed, onToggle }: SidebarProps) => {
  const { user, logout } = useAuth();

  const filteredNavigation = navigation.filter(item =>
    user?.role && item.roles.includes(user.role)
  );

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={`
      bg-card border-r border-border h-screen flex flex-col
      transition-all duration-300 ease-in-out
      ${collapsed ? 'w-16' : 'w-64'}
    `}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 medical-gradient rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-primary">HARMS</h1>
                <p className="text-xs text-muted-foreground">Healthcare Admin</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="p-2"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* User Info */}
      {!collapsed && user && (
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-primary-foreground">
                {user.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {filteredNavigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-lg text-sm font-medium smooth-transition group ${
                isActive
                  ? 'bg-primary text-primary-foreground medical-shadow'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`
            }
          >
            <item.icon className={`w-5 h-5 ${collapsed ? '' : 'mr-3'}`} />
            {!collapsed && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={`w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted ${
            collapsed ? 'px-3' : ''
          }`}
        >
          <LogOut className={`w-5 h-5 ${collapsed ? '' : 'mr-3'}`} />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
};