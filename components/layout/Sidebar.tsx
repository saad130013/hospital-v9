
import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { useI18n } from '../../hooks/useI18n';
import { UserRole } from '../../types';
import { LayoutDashboard, FilePlus, Files, Settings, Hospital, Users, BookOpen, Bell, LogOut, NotebookText, BarChart3 } from 'lucide-react';

const Sidebar: React.FC = () => {
  const { user, logout } = useContext(AppContext);
  const { t } = useI18n();

  const inspectorLinks = [
    { to: '/dashboard', icon: <LayoutDashboard size={20} />, text: t('dashboard') },
    { to: '/new-inspection', icon: <FilePlus size={20} />, text: t('newInspection') },
    { to: '/cdr', icon: <NotebookText size={20} />, text: t('cdr') },
    { to: '/my-reports', icon: <BarChart3 size={20} />, text: t('myReports') },
  ];

  const supervisorLinks = [
    { to: '/dashboard', icon: <LayoutDashboard size={20} />, text: t('dashboard') },
    { to: '/reporting-hub', icon: <BarChart3 size={20} />, text: t('reportingHub') },
    { to: '/cdr', icon: <NotebookText size={20} />, text: t('cdr') },
    { to: '/inspectors', icon: <Users size={20} />, text: t('inspectors') },
    { to: '/standards', icon: <BookOpen size={20} />, text: t('standards') },
    { to: '/alerts', icon: <Bell size={20} />, text: t('alerts') },
    { to: '/settings', icon: <Settings size={20} />, text: t('settings') },
  ];

  const links = user?.role === UserRole.Supervisor ? supervisorLinks : inspectorLinks;

  const NavItem: React.FC<{ to: string, icon: React.ReactNode, text: string }> = ({ to, icon, text }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center p-3 my-1 rounded-lg transition-colors duration-200 ${
          isActive
            ? 'bg-brand-teal text-white'
            : 'text-gray-100 hover:bg-brand-blue-dark'
        }`
      }
    >
      {icon}
      <span className="mx-4 font-medium">{text}</span>
    </NavLink>
  );

  return (
    <aside className="hidden md:flex flex-col w-64 bg-brand-blue text-white">
      <div className="flex items-center justify-center h-20 border-b border-brand-blue-dark">
        <Hospital size={28} className="text-brand-green" />
        <h1 className="text-2xl font-semibold mx-2">InspectionSys</h1>
      </div>
      <nav className="flex-1 px-4 py-8">
        {links.map((link) => (
          <NavItem key={link.to} to={link.to} icon={link.icon} text={link.text} />
        ))}
      </nav>
       <div className="px-4 py-4 border-t border-brand-blue-dark">
            <button
              onClick={logout}
              className="flex items-center w-full p-3 rounded-lg bg-red-500 bg-opacity-20 text-red-300 hover:bg-red-500 hover:text-white transition-colors duration-200"
            >
              <LogOut size={20} />
              <span className="mx-4 font-medium">{t('logout')}</span>
            </button>
        </div>
    </aside>
  );
};

export default Sidebar;
