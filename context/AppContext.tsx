
import React, { createContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { User, UserRole, InspectionReport, ReportStatus, Zone, Location, InspectionForm, Notification, CDR } from '../types';
import { USERS, ZONES, LOCATIONS, FORMS, INITIAL_REPORTS, INITIAL_NOTIFICATIONS, INITIAL_CDRS } from '../constants';

interface AppContextType {
  user: User | null;
  login: (id: string) => void;
  logout: () => void;
  reports: InspectionReport[];
  submitReport: (report: InspectionReport) => void;
  updateReport: (report: InspectionReport) => void;
  getReportById: (id: string) => InspectionReport | undefined;
  getInspectorById: (id: string) => User | undefined;
  getLocationById: (id: string) => Location | undefined;
  getZoneByLocationId: (locationId: string) => Zone | undefined;
  getFormById: (formId: string) => InspectionForm | undefined;
  zones: Zone[];
  locations: Location[];
  forms: InspectionForm[];
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  notifications: Notification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  // CDR
  cdrs: CDR[];
  addCDR: (cdr: CDR) => void;
  updateCDR: (cdr: CDR) => void;
  getCDRById: (id: string) => CDR | undefined;
}

export const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [reports, setReports] = useState<InspectionReport[]>(INITIAL_REPORTS);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [cdrs, setCdrs] = useState<CDR[]>(INITIAL_CDRS);

  const login = useCallback((id: string) => {
    const foundUser = USERS.find(u => u.id === id);
    if (foundUser) {
      setUser(foundUser);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);
  
  const submitReport = useCallback((report: InspectionReport) => {
    setReports(prev => [...prev, report]);
  }, []);

  const updateReport = useCallback((updatedReport: InspectionReport) => {
    setReports(prev => prev.map(r => r.id === updatedReport.id ? updatedReport : r));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);
  
  const getReportById = useCallback((id: string) => reports.find(r => r.id === id), [reports]);
  
  const getInspectorById = useCallback((id: string) => USERS.find(u => u.id === id), []);
  
  const getLocationById = useCallback((id: string) => LOCATIONS.find(l => l.id === id), []);

  const getZoneByLocationId = useCallback((locationId: string) => {
    const location = LOCATIONS.find(l => l.id === locationId);
    return location ? ZONES.find(z => z.id === location.zoneId) : undefined;
  }, []);

  const getFormById = useCallback((formId: string) => FORMS.find(f => f.id === formId), []);
  
  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  }, []);

  // CDR Management
  const addCDR = useCallback((cdr: CDR) => {
    setCdrs(prev => [cdr, ...prev]);
  }, []);

  const updateCDR = useCallback((updatedCDR: CDR) => {
    setCdrs(prev => prev.map(c => c.id === updatedCDR.id ? updatedCDR : c));
  }, []);
  
  const getCDRById = useCallback((id: string) => cdrs.find(c => c.id === id), [cdrs]);

  const value = useMemo(() => ({
    user,
    login,
    logout,
    reports,
    submitReport,
    updateReport,
    getReportById,
    getInspectorById,
    getLocationById,
    getZoneByLocationId,
    getFormById,
    zones: ZONES,
    locations: LOCATIONS,
    forms: FORMS,
    theme,
    toggleTheme,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    cdrs,
    addCDR,
    updateCDR,
    getCDRById,
  }), [user, reports, theme, notifications, cdrs, login, logout, submitReport, updateReport, getReportById, getInspectorById, getLocationById, getZoneByLocationId, getFormById, toggleTheme, markNotificationAsRead, markAllNotificationsAsRead, addCDR, updateCDR, getCDRById]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
