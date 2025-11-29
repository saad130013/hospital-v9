
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { RiskCategory, Location } from '../types';
import { useI18n } from '../hooks/useI18n';
import Card from '../components/ui/Card';

const NewInspection: React.FC = () => {
    const { zones, locations } = useContext(AppContext);
    const { t } = useI18n();
    const navigate = useNavigate();

    const [selectedRisk, setSelectedRisk] = useState<RiskCategory | ''>('');
    const [selectedLocation, setSelectedLocation] = useState<string>('');

    const handleRiskChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedRisk(e.target.value as RiskCategory);
        setSelectedLocation('');
    };

    const handleStartInspection = () => {
        const location = locations.find(l => l.id === selectedLocation);
        if (location) {
            navigate(`/report/new?formId=${location.formId}&locationId=${location.id}`);
        }
    };
    
    const riskCategories = Object.values(RiskCategory);
    const filteredZones = zones.filter(zone => zone.riskCategory === selectedRisk);
    const availableLocations = locations.filter(loc => filteredZones.some(zone => zone.id === loc.zoneId));

    return (
        <Card title={t('newInspection')} className="max-w-2xl mx-auto">
            <div className="space-y-6">
                <div>
                    <label htmlFor="risk-category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('selectRiskCategory')}</label>
                    <select id="risk-category" value={selectedRisk} onChange={handleRiskChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-brand-teal focus:border-brand-teal bg-white dark:bg-gray-700">
                        <option value="">-- {t('selectRiskCategory')} --</option>
                        {riskCategories.map(cat => (
                            <option key={cat} value={cat}>{t(cat.replace(/\s/g, '').toLowerCase() + 'Risk')}</option>
                        ))}
                    </select>
                </div>

                {selectedRisk && (
                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('selectLocation')}</label>
                        <select id="location" value={selectedLocation} onChange={e => setSelectedLocation(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-brand-teal focus:border-brand-teal bg-white dark:bg-gray-700">
                            <option value="">-- {t('selectLocation')} --</option>
                            {availableLocations.map(loc => (
                                <option key={loc.id} value={loc.id}>{loc.name}</option>
                            ))}
                        </select>
                    </div>
                )}
                
                <div className="text-end">
                    <button
                        onClick={handleStartInspection}
                        disabled={!selectedLocation}
                        className="px-6 py-2 bg-brand-teal text-white font-semibold rounded-md shadow-sm hover:bg-brand-blue-dark disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {t('startInspection')}
                    </button>
                </div>
            </div>
        </Card>
    );
};

export default NewInspection;