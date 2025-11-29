
import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useI18n } from '../hooks/useI18n';
import Card from '../components/ui/Card';
import { PlusCircle, Edit } from 'lucide-react';

const Settings: React.FC = () => {
    const { zones, locations, forms, getZoneByLocationId } = useContext(AppContext);
    const { t } = useI18n();
    
    const SectionCard: React.FC<{title: string, children: React.ReactNode}> = ({title, children}) => (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-brand-blue-dark dark:text-brand-green">{title}</h3>
                <button 
                    disabled 
                    className="flex items-center text-sm px-3 py-1.5 bg-brand-teal text-white rounded-md hover:bg-brand-blue-dark disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    <PlusCircle size={16} className="me-2"/>
                    {t('addNew')}
                </button>
            </div>
            <div className="space-y-2">
                {children}
            </div>
        </Card>
    );

    const ListItem: React.FC<{children: React.ReactNode}> = ({children}) => (
        <div className="p-3 flex justify-between items-center bg-gray-50 dark:bg-gray-700/50 rounded-lg border dark:border-gray-600">
            {children}
            <button disabled className="text-gray-400 hover:text-brand-blue disabled:cursor-not-allowed">
                <Edit size={16}/>
            </button>
        </div>
    );

    return (
        <div className="space-y-6">
            <SectionCard title={t('manageZones')}>
                {zones.map(zone => (
                    <ListItem key={zone.id}>
                        <span className="font-semibold">{zone.name}</span>
                        <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">{t(zone.riskCategory.toLowerCase() + 'Risk')}</span>
                    </ListItem>
                ))}
            </SectionCard>

            <SectionCard title={t('manageLocations')}>
                 {locations.map(location => (
                    <ListItem key={location.id}>
                        <span className="font-semibold">{location.name}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{getZoneByLocationId(location.id)?.name}</span>
                    </ListItem>
                ))}
            </SectionCard>

            <SectionCard title={t('manageForms')}>
                {forms.map(form => (
                    <ListItem key={form.id}>
                         <div>
                            <h4 className="font-semibold">{form.name}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{form.items.length} evaluation items</p>
                        </div>
                    </ListItem>
                ))}
            </SectionCard>
        </div>
    );
};

export default Settings;