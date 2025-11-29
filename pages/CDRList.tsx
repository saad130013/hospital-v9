import React, { useContext, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { useI18n } from '../hooks/useI18n';
import Card from '../components/ui/Card';
import { UserRole, CDR, CDRStatus, CDRManagerDecision } from '../types';
import { PlusCircle, Filter, FileText, Clock, CheckCircle } from 'lucide-react';
import { USERS } from '../constants';

const CDRList: React.FC = () => {
  const { user, cdrs, getInspectorById } = useContext(AppContext);
  const { t } = useI18n();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    status: '',
    decision: '',
    dateFrom: '',
    dateTo: ''
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const myCDRs = useMemo(() => {
    let filtered = user?.role === UserRole.Inspector ? cdrs.filter(c => c.employeeId === user.id) : cdrs;

    if (user?.role === UserRole.Supervisor) {
      filtered = filtered.filter(cdr => {
        const cdrDate = new Date(cdr.date);
        const dateFrom = filters.dateFrom ? new Date(filters.dateFrom) : null;
        const dateTo = filters.dateTo ? new Date(filters.dateTo) : null;
        if(dateFrom) dateFrom.setHours(0,0,0,0);
        if(dateTo) dateTo.setHours(23,59,59,999);

        return (
          (!filters.status || cdr.status === filters.status) &&
          (!filters.decision || cdr.managerDecision === filters.decision) &&
          (!dateFrom || cdrDate >= dateFrom) &&
          (!dateTo || cdrDate <= dateTo)
        );
      });
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [cdrs, user, filters]);
  
  const getStatusIndicator = (status: CDRStatus) => {
    switch(status) {
      case CDRStatus.Draft: 
        return { 
          icon: <FileText size={14} className="me-1.5 flex-shrink-0" />,
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
        };
      case CDRStatus.Submitted: 
        return {
          icon: <Clock size={14} className="me-1.5 flex-shrink-0" />,
          color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
        };
      case CDRStatus.Approved: 
        return {
          icon: <CheckCircle size={14} className="me-1.5 flex-shrink-0" />,
          color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
        };
      default: 
        return {
          icon: <FileText size={14} className="me-1.5 flex-shrink-0" />,
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
        };
    }
  };

  const formElementClasses = "w-full p-2 border rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-brand-teal focus:border-brand-teal";

  return (
    <Card>
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-brand-blue-dark dark:text-brand-green">{t('cdrList')}</h2>
        <button 
          onClick={() => navigate('/cdr/new')}
          className="flex items-center px-4 py-2 bg-brand-teal text-white font-semibold rounded-md shadow-sm hover:bg-brand-blue-dark transition-colors"
        >
          <PlusCircle size={18} className="me-2" />
          {t('newCDR')}
        </button>
      </div>

      {user?.role === UserRole.Supervisor && (
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg mb-6">
            <h3 className="font-semibold mb-2 flex items-center"><Filter size={16} className="me-2" /> {t('filter')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <select name="status" value={filters.status} onChange={handleFilterChange} className={formElementClasses}>
                    <option value="">All Statuses</option>
                    {Object.values(CDRStatus).map(s => <option key={s} value={s}>{t(s)}</option>)}
                </select>
                <select name="decision" value={filters.decision} onChange={handleFilterChange} className={formElementClasses}>
                    <option value="">All Decisions</option>
                    {Object.values(CDRManagerDecision).map(d => <option key={d} value={d}>{t(d)}</option>)}
                </select>
                <input type="date" name="dateFrom" value={filters.dateFrom} onChange={handleFilterChange} className={formElementClasses}/>
                <input type="date" name="dateTo" value={filters.dateTo} onChange={handleFilterChange} className={formElementClasses}/>
            </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-100 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3">{t('cdrId')}</th>
              <th scope="col" className="px-6 py-3">{t('date')}</th>
              {user?.role === UserRole.Supervisor && <th scope="col" className="px-6 py-3">{t('inspector')}</th>}
              <th scope="col" className="px-6 py-3">{t('location')}</th>
              <th scope="col" className="px-6 py-3">{t('status')}</th>
              <th scope="col" className="px-6 py-3">{t('managerDecision')}</th>
              <th scope="col" className="px-6 py-3">{t('view')}</th>
            </tr>
          </thead>
          <tbody>
            {myCDRs.map(cdr => {
              const indicator = getStatusIndicator(cdr.status);
              return (
              <tr key={cdr.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{cdr.referenceNumber}</td>
                <td className="px-6 py-4">{new Date(cdr.date).toLocaleDateString()}</td>
                {user?.role === UserRole.Supervisor && <td className="px-6 py-4">{getInspectorById(cdr.employeeId)?.name}</td>}
                <td className="px-6 py-4">{cdr.location}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${indicator.color}`}>
                    {indicator.icon}
                    {t(cdr.status)}
                  </span>
                </td>
                <td className="px-6 py-4">{cdr.managerDecision ? t(cdr.managerDecision) : 'N/A'}</td>
                <td className="px-6 py-4">
                  <Link to={`/cdr/${cdr.id}`} className="text-brand-blue hover:underline font-semibold">{t('view')}</Link>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default CDRList;
