import React, { useContext, useState, useMemo, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { useI18n } from '../hooks/useI18n';
import Card from '../components/ui/Card';
import { UserRole, InspectionReport, InspectionResultItem, ReportStatus } from '../types';
import EvaluationItemCard from '../components/ui/EvaluationItemCard';
import { Save, Send, ShieldCheck, User as UserIcon, Calendar, MapPin, Hospital, Download } from 'lucide-react';

const ReportDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user, getReportById, getFormById, getLocationById, getInspectorById, getZoneByLocationId, submitReport, updateReport } = useContext(AppContext);
    const { t } = useI18n();

    const isNew = id === 'new';
    const formId = searchParams.get('formId');
    const locationId = searchParams.get('locationId');
    
    const [report, setReport] = useState<InspectionReport | null>(null);
    const [supervisorComment, setSupervisorComment] = useState('');

    const form = useMemo(() => {
        const currentFormId = isNew ? formId : getLocationById(report?.locationId ?? '')?.formId;
        return currentFormId ? getFormById(currentFormId) : null;
    }, [isNew, formId, report, getLocationById, getFormById]);

    useEffect(() => {
        if (isNew && formId && locationId && user) {
            const newReport: InspectionReport = {
                id: `temp-${Date.now()}`,
                referenceNumber: 'DRAFT',
                inspectorId: user.id,
                locationId: locationId,
                date: new Date().toISOString(),
                status: ReportStatus.Draft,
                items: form?.items.map(item => ({
                    itemId: item.id,
                    score: item.maxScore,
                    comment: '',
                    defects: [],
                    photos: []
                })) ?? [],
            };
            setReport(newReport);
        } else if (id) {
            const foundReport = getReportById(id);
            if (foundReport) {
                setReport(foundReport);
                setSupervisorComment(foundReport.supervisorComment || '');
            }
        }
    }, [id, isNew, formId, locationId, user, getReportById, form]);


    const location = report ? getLocationById(report.locationId) : null;
    const inspector = report ? getInspectorById(report.inspectorId) : null;

    const maxScore = form?.items.reduce((sum, item) => sum + item.maxScore, 0) || 0;
    const actualScore = report?.items.reduce((sum, item) => sum + item.score, 0) || 0;
    const compliance = maxScore > 0 ? ((actualScore / maxScore) * 100).toFixed(1) : '0.0';
    const complianceColor = +compliance >= 90 ? 'text-green-600' : +compliance >= 75 ? 'text-yellow-600' : 'text-red-600';

    const handleItemChange = (index: number, field: keyof InspectionResultItem, value: any) => {
        if (!report) return;
        const newItems = [...report.items];
        (newItems[index] as any)[field] = value;
        setReport({ ...report, items: newItems });
    };

    const handleSave = (status: ReportStatus) => {
        if (!report) return;
        const finalReport: InspectionReport = {
            ...report,
            status,
            id: isNew ? `${Date.now()}` : report.id,
            referenceNumber: isNew && status === ReportStatus.Submitted ? `INSP-${Date.now().toString().slice(-4)}` : report.referenceNumber
        };
        if (isNew) {
            submitReport(finalReport);
        } else {
            updateReport(finalReport);
        }
        navigate(`/report/${finalReport.id}`);
    };
    
    const handleFeedbackSubmit = () => {
        if(!report) return;
        updateReport({ ...report, supervisorComment });
    };

    const isEditable = isNew || (report?.status === ReportStatus.Draft && user?.id === report?.inspectorId);
    
    if (!report || !form) return <div className="text-center p-8">{isNew ? 'Loading form...' : 'Report not found.'}</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6 report-container">
            {/* ==========================================================================
                == PRINT-ONLY VIEW: This is the styled layout for the PDF.
                ========================================================================== */}
            <div className="hidden print-block printable-report-body">
                <div className="print-title-block">
                    <div className="logo-title">
                        <Hospital size={40} className="text-brand-blue" />
                        <h1 className="mx-2">InspectionSys</h1>
                    </div>
                    <div className="report-meta">
                        <h2>{t('inspectionReportTitle')}</h2>
                        <p>{report?.referenceNumber}</p>
                    </div>
                </div>

                <table className="print-summary-table">
                    <tbody>
                        <tr>
                            <td><strong>{t('inspector')}:</strong></td>
                            <td>{inspector?.name}</td>
                            <td><strong>{t('date')}:</strong></td>
                            <td>{report ? new Date(report.date).toLocaleDateString() : ''}</td>
                        </tr>
                        <tr>
                            <td><strong>{t('location')}:</strong></td>
                            <td>{location?.name}</td>
                            <td><strong>{t('status')}:</strong></td>
                            <td>{report ? t(report.status.replace(/\s/g, '')) : ''}</td>
                        </tr>
                        <tr>
                            <td><strong>{t('totalScore')}:</strong></td>
                            <td colSpan={3}><strong>{actualScore} / {maxScore} ({compliance}%)</strong></td>
                        </tr>
                    </tbody>
                </table>

                <h3 className="print-section-title">{t('inspectionForm')}</h3>
                
                {/* Evaluation items will be rendered here for print via CSS */}
                
                {report.supervisorComment && (
                    <div className="supervisor-comment-print">
                        <h3 className="print-section-title" style={{marginTop: 0, border: 'none'}}>{t('supervisorFeedback')}</h3>
                        <p>"{report.supervisorComment}"</p>
                    </div>
                )}
                
                <footer className="print-footer">
                    <p>{t('confidential')} - {t('generatedReportNotice')}</p>
                    <p>Printed on: {new Date().toLocaleString()}</p>
                </footer>
            </div>


            {/* ==========================================================================
                == SCREEN-ONLY VIEW: This is the interactive UI for the browser.
                ========================================================================== */}
            <Card className="no-print">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-brand-blue-dark dark:text-brand-green">{t('reportDetails')}</h2>
                        <p className="text-gray-500 dark:text-gray-400">{report.referenceNumber}</p>
                    </div>
                    <div className="flex items-center gap-4">
                         {report.status !== ReportStatus.Draft && (
                             <button 
                                onClick={() => window.print()} 
                                className="flex items-center px-4 py-2 bg-brand-blue text-white font-semibold rounded-md shadow-sm hover:bg-brand-blue-dark transition-colors"
                            >
                                <Download size={16} className="me-2" />
                                {t('downloadPdf')}
                            </button>
                         )}
                        <div className={`text-4xl font-bold ${complianceColor}`}>{compliance}%</div>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm text-gray-600 dark:text-gray-300 border-t dark:border-gray-700 pt-4">
                    <div className="flex items-center"><UserIcon size={16} className="me-2 text-brand-teal"/><strong>{t('inspector')}:</strong><span className="ms-1">{inspector?.name}</span></div>
                    <div className="flex items-center"><Calendar size={16} className="me-2 text-brand-teal"/><strong>{t('date')}:</strong><span className="ms-1">{new Date(report.date).toLocaleDateString()}</span></div>
                    <div className="flex items-center"><MapPin size={16} className="me-2 text-brand-teal"/><strong>{t('location')}:</strong><span className="ms-1">{location?.name}</span></div>
                    <div className="flex items-center"><ShieldCheck size={16} className="me-2 text-brand-teal"/><strong>{t('status')}:</strong><span className="ms-1">{t(report.status.replace(/\s/g, ''))}</span></div>
                </div>
            </Card>

            <div className="space-y-6">
                {form.items.map((formItem, index) => {
                    const resultItem = report.items.find(ri => ri.itemId === formItem.id) || report.items[index];
                    return (
                        <EvaluationItemCard
                            key={formItem.id}
                            item={formItem}
                            result={resultItem}
                            index={index}
                            isEditable={isEditable}
                            onUpdate={(field, value) => handleItemChange(index, field, value)}
                        />
                    )
                })}
            </div>
            
            <div className="no-print">
                {isEditable && (
                     <div className="flex justify-end space-x-4">
                        <button onClick={() => handleSave(ReportStatus.Draft)} className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"><Save size={16} className="me-2" />{t('saveAsDraft')}</button>
                        <button onClick={() => handleSave(ReportStatus.Submitted)} className="flex items-center px-4 py-2 bg-brand-teal text-white rounded-md hover:bg-brand-blue-dark"><Send size={16} className="me-2" />{t('submitReport')}</button>
                    </div>
                )}

                {user?.role === UserRole.Supervisor && (
                    <Card title={t('addFeedback')}>
                        <textarea value={supervisorComment} onChange={e => setSupervisorComment(e.target.value)} className="w-full p-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-700" rows={3}/>
                        <div className="text-end mt-2">
                            <button onClick={handleFeedbackSubmit} className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-blue-dark">{t('submitFeedback')}</button>
                        </div>
                    </Card>
                )}

                {user?.role === UserRole.Inspector && report.supervisorComment && (
                    <Card title={t('supervisorFeedback')}>
                        <p className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 text-yellow-800 dark:text-yellow-300 rounded">"{report.supervisorComment}"</p>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default ReportDetail;