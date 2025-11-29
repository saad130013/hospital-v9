
import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useI18n } from '../hooks/useI18n';
import { Hospital, User, Key } from 'lucide-react';
import { USERS } from '../constants';

const Login: React.FC = () => {
  const [userId, setUserId] = useState(USERS[0].id);
  const { login } = useContext(AppContext);
  const { t } = useI18n();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(userId);
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-blue to-brand-teal p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8">
        <div className="text-center mb-8">
            <div className="inline-block p-4 bg-brand-blue rounded-full mb-4">
                 <Hospital className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-brand-blue-dark dark:text-white">Inspection System</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">{t('login')}</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="user-select" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">{t('username')}</label>
            <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <User className="w-5 h-5 text-gray-400" />
                </div>
                <select 
                    id="user-select"
                    value={userId} 
                    onChange={e => setUserId(e.target.value)}
                    className="w-full ps-10 p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-brand-teal focus:border-brand-teal transition text-gray-900 dark:text-white"
                >
                    {USERS.map(user => (
                        <option key={user.id} value={user.id}>{user.name} ({t(user.role.toLowerCase())})</option>
                    ))}
                </select>
            </div>
          </div>
          <button 
            type="submit" 
            className="w-full bg-brand-teal text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-blue transition-transform transform hover:scale-105 duration-300 focus:outline-none focus:ring-4 focus:ring-brand-teal focus:ring-opacity-50"
          >
            {t('login')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;