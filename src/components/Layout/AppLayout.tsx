import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AppBar, AppBarSection, AppBarSpacer } from '@progress/kendo-react-layout';
import { Drawer, DrawerContent } from '@progress/kendo-react-layout';
import { Button } from '@progress/kendo-react-buttons';
import { Menu, MenuIcon, Home, Calendar, MessageSquare, BarChart2, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AppLayout = () => {
  const [expanded, setExpanded] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const items = [
    { text: 'Dashboard', icon: <Home size={20} />, route: '/' },
    { text: 'Post Management', icon: <MessageSquare size={20} />, route: '/posts' },
    { text: 'Content Calendar', icon: <Calendar size={20} />, route: '/calendar' },
    { text: 'AI Assistant', icon: <MessageSquare size={20} />, route: '/ai-assistant' },
    { text: 'Analytics', icon: <BarChart2 size={20} />, route: '/analytics' },
    { text: 'Settings', icon: <Settings size={20} />, route: '/settings' },
  ];

  return (
    <div className="h-screen flex flex-col">
      <AppBar className="bg-white border-b">
        <AppBarSection>
          <Button icon={<Menu size={20} />} onClick={() => setExpanded(!expanded)} />
        </AppBarSection>
        <AppBarSection>
          <h1 className="text-xl font-bold ml-4">VibePilot</h1>
        </AppBarSection>
        <AppBarSpacer />
        <AppBarSection>
          <span className="mr-4">{user?.name}</span>
          <Button icon={<LogOut size={20} />} onClick={logout} />
        </AppBarSection>
      </AppBar>

      <div className="flex flex-1 overflow-hidden">
        <Drawer
          expanded={expanded}
          mode="push"
          mini={true}
          className="border-r"
        >
          <DrawerContent>
            {items.map((item, index) => (
              <div
                key={index}
                className="p-4 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
                onClick={() => navigate(item.route)}
              >
                {item.icon}
                <span>{item.text}</span>
              </div>
            ))}
          </DrawerContent>
        </Drawer>

        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};