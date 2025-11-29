import React, { useContext, useMemo, useState, useCallback } from 'react';
import { AppContext } from '../../context/AppContext';
import { useI18n } from '../../hooks/useI18n';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ComposedChart, Bar } from 'recharts';
import { ArrowUp, ArrowDown, ClipboardList, AlertTriangle, Trophy, CheckCircle, Clock, Lightbulb, FileDown, Star } from 'lucide-react';
import { UserRole } from '../../types';
import { USERS } from '../../constants';
import { Link } from 'react-router-dom';
import PredictiveHotspotsCard from './PredictiveHotspotsCard';

const ManagerDashboard: React.FC = () => {
    const { reports, getFormById, getLocationById, getZoneByLocationId, getInspectorById, theme } = useContext(AppContext);
    const { t } = useI18n();

    const calculateScore = useCallback((report) => {
        const location = getLocationById(report.locationId);
        if (!location) return 0;
        const form = getFormById(location.formId);
        if (!form || form.items.length === 0) return 0;
        const maxScore = form.items.reduce((sum, item) => sum + item.maxScore, 0);
        const actualScore = report.items.reduce((sum, item) => sum + item.score, 0);
        return maxScore > 0 ? (actualScore / maxScore) * 100 : 0;
    }, [getLocationById, getFormById]);

    const dashboardStats = useMemo(() => {
        const now = new Date();
        const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        const thisMonthReports = reports.filter(r => new Date(r.date) >= startOfThisMonth);
        const lastMonthReports = reports.filter(r => new Date(r.date) >= startOfLastMonth && new Date(r.date) <= endOfLastMonth);

        const calculateAvgCompliance = (reportSet: any[]) => {
            if (reportSet.length === 0) return 0;
            const totalScore = reportSet.reduce((sum, r) => sum + calculateScore(r), 0);
            return totalScore / reportSet.length;
        };

        const overallCompliance = calculateAvgCompliance(thisMonthReports);
        const prevMonthCompliance = calculateAvgCompliance(lastMonthReports);
        const complianceTrend = overallCompliance - prevMonthCompliance;
        const criticalIssues = thisMonthReports.filter(r => calculateScore(r) < 75).length;

        const inspectors = USERS.filter(u => u.role === UserRole.Inspector);
        const inspectorScores = inspectors.map(inspector => {
            const inspectorReports = thisMonthReports.filter(r => r.inspectorId === inspector.id);
            const avgScore = calculateAvgCompliance(inspectorReports);
            return { ...inspector, avgScore, reportCount: inspectorReports.length };
        }).sort((a, b) => b.avgScore - a.avgScore || b.reportCount - a.reportCount);
        
        const topInspector = inspectorScores.length > 0 ? inspectorScores[0] : null;
        
        const locationScores = reports.reduce<Record<string, { scores: number[]; count: number }>>((acc, report) => {
            const locationId = report.locationId;
            if (!acc[locationId]) {
                acc[locationId] = { scores: [], count: 0 };
            }
            acc[locationId].scores.push(calculateScore(report));
            acc[locationId].count++;
            return acc;
        }, {});

        const lowPerformingAreas = Object.entries(locationScores)
            .map(([locationId, data]) => {
                const typedData = data as { scores: number[]; count: number };
                return {
                    locationId,
                    avgScore: typedData.count > 0 ? typedData.scores.reduce((a, b) => a + b, 0) / typedData.count : 0,
                };
            })
            .filter(item => item.avgScore < 85)
            .sort((a, b) => a.avgScore - b.avgScore)
            .slice(0, 5);
        
        let aiInsight1 = `All areas are performing well.`;
        if (lowPerformingAreas.length > 0) {
            const lowestArea = lowPerformingAreas[0];
            const lowestAreaName = getLocationById(lowestArea.locationId)?.name || 'N/A';
            const scoreData = locationScores[lowestArea.locationId];
            if (scoreData) {
                 aiInsight1 = `**${lowestAreaName}** recorded ${scoreData.count} low scores this week. Follow-up inspection recommended.`;
            }
        }
        
        let aiInsight2 = `Not enough data to rank inspectors.`;
        if (topInspector) {
            aiInsight2 = `**${topInspector.name}** has the highest consistency score this month.`;
        }

        return {
            overallCompliance,
            complianceTrend,
            totalInspections: thisMonthReports.length,
            criticalIssues,
            topInspector,
            inspectorScores,
            lowPerformingAreas,
            aiInsights: [aiInsight1, aiInsight2]
        };
    }, [reports, calculateScore, getLocationById]);

    const performanceData = useMemo(() => {
        const dataMap = new Map<string, { scores: number[], count: number }>();
        const today = new Date();
        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateString = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if (!dataMap.has(dateString)) {
                dataMap.set(dateString, { scores: [], count: 0 });
            }
        }
        
        reports.forEach(r => {
            const dateString = new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if (dataMap.has(dateString)) {
                const entry = dataMap.get(dateString)!;
                entry.scores.push(calculateScore(r));
                entry.count++;
            }
        });

        const chartData = Array.from(dataMap.entries()).map(([date, { scores, count }]) => ({
            date,
            score: count > 0 ? scores.reduce((a, b) => a + b, 0) / count : null,
        }));
        
        const lastScore = chartData.filter(d => d.score !== null).pop()?.score || dashboardStats.overallCompliance;
        const forecastData = chartData.slice(-7).map((d, i) => ({...d, predicted: lastScore * (1 + (Math.random() - 0.45) * 0.05)}));
        
        return chartData.map(d => {
            const forecast = forecastData.find(f => f.date === d.date);
            return forecast ? { ...d, predicted: forecast.predicted } : d;
        });

    }, [reports, calculateScore, dashboardStats.overallCompliance]);

    const getComplianceColor = (score: number) => score >= 85 ? 'text-green-500' : score >= 70 ? 'text-yellow-500' : 'text-red-500';
    const getInitials = (name: string = '') => name.split(' ').map(n => n[0]).join('');

    const KpiCard = ({ title, value, subValue, icon, trend, trendText }: {title: string, value: string | number, subValue?: string | null, icon: React.ReactNode, trend?: number | null, trendText?: string | null}) => (
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm" title={title}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</p>
                    <p className={`text-3xl font-bold ${getComplianceColor(parseFloat(String(value)))}`}>{value}</p>
                    {subValue && <p className="text-xs text-gray-400">{subValue}</p>}
                </div>
                {icon}
            </div>
            {trendText && typeof trend === 'number' && (
                <div className={`flex items-center text-xs mt-1 ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {trend >= 0 ? <ArrowUp size={14}/> : <ArrowDown size={14}/>}
                    <span>{trend.toFixed(1)}% {trendText}</span>
                </div>
            )}
        </div>
    );
    
    const tickColor = theme === 'dark' ? '#9ca3af' : '#6b7280';
    const tooltipStyle = theme === 'dark' ? { backgroundColor: '#1f2937', border: '1px solid #4b5563' } : { backgroundColor: '#ffffff', border: '1px solid #e5e7eb' };

    return (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <div className="xl:col-span-3 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-brand-blue-dark dark:text-gray-200">Manager Dashboard</h1>
                     <button className="flex items-center px-4 py-2 bg-brand-teal text-white font-semibold rounded-md shadow-sm hover:bg-brand-blue-dark transition-colors">
                        <FileDown size={16} className="me-2" />{t('downloadMonthlyReport')}
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <KpiCard title={t('overallCompliance')} value={`${dashboardStats.overallCompliance.toFixed(1)}%`} icon={<CheckCircle size={24} className="text-gray-400" />} trend={dashboardStats.complianceTrend} trendText={t('vsLastMonth')} />
                    <KpiCard title={t('totalInspections')} value={dashboardStats.totalInspections} subValue={t('acrossAllDepts')} icon={<ClipboardList size={24} className="text-gray-400" />} />
                    <KpiCard title={t('criticalIssues')} value={dashboardStats.criticalIssues} subValue={t('requiresImmediateAction')} icon={<AlertTriangle size={24} className="text-gray-400" />} />
                    <KpiCard 
                        title={t('topInspector')} 
                        value={dashboardStats.topInspector ? dashboardStats.topInspector.name.split(' ')[0] : 'N/A'} 
                        subValue={dashboardStats.topInspector ? `${t('leading')}: ${dashboardStats.topInspector.name}` : 'No data'} 
                        icon={<Trophy size={24} className="text-gray-400" />} 
                    />
                </div>

                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm">
                    <h3 className="font-bold text-brand-blue-dark dark:text-brand-green mb-4">{t('performanceTrend')}</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <ComposedChart data={performanceData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e0e0e0'} />
                            <XAxis dataKey="date" tick={{ fill: tickColor, fontSize: 12 }} />
                            <YAxis tick={{ fill: tickColor, fontSize: 12 }} unit="%" domain={[60, 100]} />
                            <Tooltip contentStyle={tooltipStyle} />
                            <Legend wrapperStyle={{ color: tickColor }} />
                            <Line type="monotone" dataKey="score" name={t('score')} stroke="#0a9396" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 6 }}/>
                            <Line type="monotone" dataKey="predicted" name={t('predicted')} stroke="#ca6702" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm">
                         <h3 className="font-bold text-brand-blue-dark dark:text-brand-green mb-4 flex items-center"><Lightbulb size={20} className="me-2 text-yellow-500" />{t('aiInsights')}</h3>
                         <ul className="space-y-3">
                             {dashboardStats.aiInsights.map((insight, i) => (
                                 <li key={i} className="flex items-start space-x-3 rtl:space-x-reverse p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                     <Star size={18} className="text-brand-teal mt-1 flex-shrink-0" />
                                     <p className="text-sm text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: insight.replace(/\*\*(.*?)\*\*/g, '<strong class="text-brand-blue-dark dark:text-brand-green">$1</strong>') }} />
                                 </li>
                             ))}
                         </ul>
                    </div>
                     <PredictiveHotspotsCard />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm">
                         <h3 className="font-bold text-brand-blue-dark dark:text-brand-green mb-4">{t('lowPerformingAreas')}</h3>
                         <ul className="space-y-3">
                            {dashboardStats.lowPerformingAreas.map(({locationId, avgScore}) => {
                                const location = getLocationById(locationId);
                                const zone = getZoneByLocationId(locationId);
                                return(
                                <li key={locationId} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <div>
                                        <p className="font-semibold text-gray-800 dark:text-gray-200">{location?.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{zone?.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`font-bold text-lg ${getComplianceColor(avgScore)}`}>{avgScore.toFixed(1)}%</span>
                                        <p className="text-xs text-red-500 font-semibold">{t('needsAttention')}</p>
                                    </div>
                                </li>
                                );
                            })}
                         </ul>
                    </div>
                     <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm">
                        <h3 className="font-bold text-brand-blue-dark dark:text-brand-green mb-4">{t('inspectorRanking')}</h3>
                        <ul className="space-y-2">
                             {dashboardStats.inspectorScores.slice(0, 4).map((inspector, index) => (
                                 <li key={inspector.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                     <div className="flex items-center">
                                        <span className="font-bold text-gray-400 w-6">{index + 1}</span>
                                        <div className={`w-8 h-8 rounded-full bg-brand-green text-white flex items-center justify-center font-bold text-xs me-3`}>
                                            {getInitials(inspector.name)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800 dark:text-gray-200">{inspector.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{inspector.reportCount} {t('reports')}</p>
                                        </div>
                                     </div>
                                      <span className={`font-bold text-lg ${getComplianceColor(inspector.avgScore)}`}>{inspector.avgScore.toFixed(1)}%</span>
                                 </li>
                             ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="xl:col-span-1 bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm">
                 <h3 className="font-bold text-brand-blue-dark dark:text-brand-green mb-4 flex items-center">
                    {t('liveActivityFeed')}
                    <span className="ms-2 text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400 px-2 py-0.5 rounded-full animate-pulse">LIVE</span>
                 </h3>
                 <ul className="space-y-4 h-[calc(100vh-12rem)] overflow-y-auto">
                    {reports.slice().reverse().map(report => {
                        const score = calculateScore(report);
                        const isCritical = score < 75;
                        const inspector = getInspectorById(report.inspectorId);
                        const location = getLocationById(report.locationId);
                        return (
                            <li key={report.id} className="flex items-start space-x-3 rtl:space-x-reverse">
                                <div className={`mt-1 p-1.5 rounded-full ${isCritical ? 'bg-red-100 dark:bg-red-900/20' : 'bg-green-100 dark:bg-green-900/20'}`}>
                                    {isCritical ? 
                                        <AlertTriangle size={14} className="text-red-600 dark:text-red-400" /> : 
                                        <CheckCircle size={14} className="text-green-600 dark:text-green-400" />
                                    }
                                </div>
                                <div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        {isCritical ? 
                                            <><span className="font-semibold text-red-600 dark:text-red-400">Critical Low Score</span> detected at </> : 
                                            <><span className="font-semibold text-gray-900 dark:text-white">{inspector?.name || 'Unknown'}</span> completed inspection at </>
                                        }
                                        <Link to={`/report/${report.id}`} className="font-semibold text-gray-900 dark:text-white hover:underline">{location?.name || 'Unknown'}</Link>
                                        {isCritical ? ` (` : ` with score `}
                                        <span className={`font-bold ${getComplianceColor(score)}`}>{score.toFixed(1)}%</span>
                                        {isCritical ? `).` : `.`}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5">{new Date(report.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                            </li>
                        );
                    })}
                 </ul>
            </div>
        </div>
    );
};

export default ManagerDashboard;