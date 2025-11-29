
import { User, UserRole, Zone, RiskCategory, Location, InspectionForm, EvaluationItem, InspectionReport, ReportStatus, Notification, CDR, CDRStatus, CDRIncidentType, CDRServiceType, CDRManagerDecision } from './types';

export const USERS: User[] = [
  { id: 'user1', name: 'Mohammed Ali', role: UserRole.Inspector },
  { id: 'user2', name: 'Fatima Saad', role: UserRole.Inspector },
  { id: 'user4', name: 'ليلى العتيبي', role: UserRole.Inspector },
  { id: 'user5', name: 'Khalid Alghamdi', role: UserRole.Inspector },
  { id: 'user3', name: 'Manager Ahmed', role: UserRole.Supervisor },
];

export const ZONES: Zone[] = [
  { id: 'zone1', name: 'Operating Theaters', riskCategory: RiskCategory.High },
  { id: 'zone2', name: 'Emergency Department', riskCategory: RiskCategory.Medium },
  { id: 'zone3', name: 'Administrative Offices', riskCategory: RiskCategory.Low },
];

const DEFECT_KEYS = ['defect_dust', 'defect_stains', 'defect_rust', 'defect_needs_cleaning', 'defect_needs_maintenance'];

const highRiskItems: EvaluationItem[] = [
    { id: 'hr_item_1', name: 'hr_item_1', maxScore: 6, predefinedDefects: DEFECT_KEYS },
    { id: 'hr_item_2', name: 'hr_item_2', maxScore: 6, predefinedDefects: DEFECT_KEYS },
    { id: 'hr_item_3', name: 'hr_item_3', maxScore: 12, predefinedDefects: DEFECT_KEYS },
    { id: 'hr_item_4', name: 'hr_item_4', maxScore: 12, predefinedDefects: DEFECT_KEYS },
    { id: 'hr_item_5', name: 'hr_item_5', maxScore: 6, predefinedDefects: DEFECT_KEYS },
    { id: 'hr_item_6', name: 'hr_item_6', maxScore: 5, predefinedDefects: DEFECT_KEYS },
    { id: 'hr_item_7', name: 'hr_item_7', maxScore: 6, predefinedDefects: DEFECT_KEYS },
    { id: 'hr_item_8', name: 'hr_item_8', maxScore: 7, predefinedDefects: DEFECT_KEYS },
    { id: 'hr_item_9', name: 'hr_item_9', maxScore: 10, predefinedDefects: DEFECT_KEYS },
    { id: 'hr_item_10', name: 'hr_item_10', maxScore: 7, predefinedDefects: DEFECT_KEYS },
    { id: 'hr_item_11', name: 'hr_item_11', maxScore: 5, predefinedDefects: DEFECT_KEYS },
    { id: 'hr_item_12', name: 'hr_item_12', maxScore: 4, predefinedDefects: DEFECT_KEYS },
    { id: 'hr_item_13', name: 'hr_item_13', maxScore: 5, predefinedDefects: DEFECT_KEYS },
    { id: 'hr_item_14', name: 'hr_item_14', maxScore: 5, predefinedDefects: DEFECT_KEYS },
    { id: 'hr_item_15', name: 'hr_item_15', maxScore: 4, predefinedDefects: DEFECT_KEYS },
];

const mediumRiskItems: EvaluationItem[] = [
    { id: 'mr_item_1', name: 'mr_item_1', maxScore: 3, predefinedDefects: DEFECT_KEYS },
    { id: 'mr_item_2', name: 'mr_item_2', maxScore: 6, predefinedDefects: DEFECT_KEYS },
    { id: 'mr_item_3', name: 'mr_item_3', maxScore: 6, predefinedDefects: DEFECT_KEYS },
    { id: 'mr_item_4', name: 'mr_item_4', maxScore: 4, predefinedDefects: DEFECT_KEYS },
    { id: 'mr_item_5', name: 'mr_item_5', maxScore: 10, predefinedDefects: DEFECT_KEYS },
    { id: 'mr_item_6', name: 'mr_item_6', maxScore: 7, predefinedDefects: DEFECT_KEYS },
    { id: 'mr_item_7', name: 'mr_item_7', maxScore: 5, predefinedDefects: DEFECT_KEYS },
    { id: 'mr_item_8', name: 'mr_item_8', maxScore: 6, predefinedDefects: DEFECT_KEYS },
    { id: 'mr_item_9', name: 'mr_item_9', maxScore: 6, predefinedDefects: DEFECT_KEYS },
    { id: 'mr_item_10', name: 'mr_item_10', maxScore: 10, predefinedDefects: DEFECT_KEYS },
    { id: 'mr_item_11', name: 'mr_item_11', maxScore: 9, predefinedDefects: DEFECT_KEYS },
    { id: 'mr_item_12', name: 'mr_item_12', maxScore: 7, predefinedDefects: DEFECT_KEYS },
    { id: 'mr_item_13', name: 'mr_item_13', maxScore: 5, predefinedDefects: DEFECT_KEYS },
    { id: 'mr_item_14', name: 'mr_item_14', maxScore: 4, predefinedDefects: DEFECT_KEYS },
    { id: 'mr_item_15', name: 'mr_item_15', maxScore: 5, predefinedDefects: DEFECT_KEYS },
    { id: 'mr_item_16', name: 'mr_item_16', maxScore: 4, predefinedDefects: DEFECT_KEYS },
];

const lowRiskItems: EvaluationItem[] = [
    { id: 'lr_item_1', name: 'lr_item_1', maxScore: 6, predefinedDefects: DEFECT_KEYS },
    { id: 'lr_item_2', name: 'lr_item_2', maxScore: 10, predefinedDefects: DEFECT_KEYS },
    { id: 'lr_item_3', name: 'lr_item_3', maxScore: 8, predefinedDefects: DEFECT_KEYS },
    { id: 'lr_item_4', name: 'lr_item_4', maxScore: 4, predefinedDefects: DEFECT_KEYS },
    { id: 'lr_item_5', name: 'lr_item_5', maxScore: 10, predefinedDefects: DEFECT_KEYS },
    { id: 'lr_item_6', name: 'lr_item_6', maxScore: 7, predefinedDefects: DEFECT_KEYS },
    { id: 'lr_item_7', name: 'lr_item_7', maxScore: 5, predefinedDefects: DEFECT_KEYS },
    { id: 'lr_item_8', name: 'lr_item_8', maxScore: 7, predefinedDefects: DEFECT_KEYS },
    { id: 'lr_item_9', name: 'lr_item_9', maxScore: 7, predefinedDefects: DEFECT_KEYS },
    { id: 'lr_item_10', name: 'lr_item_10', maxScore: 6, predefinedDefects: DEFECT_KEYS },
    { id: 'lr_item_11', name: 'lr_item_11', maxScore: 6, predefinedDefects: DEFECT_KEYS },
    { id: 'lr_item_12', name: 'lr_item_12', maxScore: 5, predefinedDefects: DEFECT_KEYS },
    { id: 'lr_item_13', name: 'lr_item_13', maxScore: 10, predefinedDefects: DEFECT_KEYS },
    { id: 'lr_item_14', name: 'lr_item_14', maxScore: 5, predefinedDefects: DEFECT_KEYS },
    { id: 'lr_item_15', name: 'lr_item_15', maxScore: 4, predefinedDefects: DEFECT_KEYS },
];


export const FORMS: InspectionForm[] = [
  { id: 'form1', name: 'High-Risk Area Inspection Form', items: highRiskItems },
  { id: 'form2', name: 'Medium-Risk Area Inspection Form', items: mediumRiskItems },
  { id: 'form3', name: 'Low-Risk Area Inspection Form', items: lowRiskItems },
];

export const LOCATIONS: Location[] = [
  { id: 'loc1', name: 'OR 1', zoneId: 'zone1', formId: 'form1' },
  { id: 'loc2', name: 'OR 2', zoneId: 'zone1', formId: 'form1' },
  { id: 'loc3', name: 'ICU', zoneId: 'zone1', formId: 'form1' },
  { id: 'loc4', name: 'ER Triage', zoneId: 'zone2', formId: 'form2' },
  { id: 'loc5', name: 'ER Ward A', zoneId: 'zone2', formId: 'form2' },
  { id: 'loc6', name: 'HR Office', zoneId: 'zone3', formId: 'form3' },
  { id: 'loc7', name: 'Main Lobby', zoneId: 'zone3', formId: 'form3' },
];


export const INITIAL_REPORTS: InspectionReport[] = [
    {
        id: 'report1',
        referenceNumber: 'INSP-2024-001',
        inspectorId: 'user1',
        locationId: 'loc1', // High Risk
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        status: ReportStatus.Reviewed,
        supervisorComment: 'Good work, but pay more attention to chemical storage.',
        items: highRiskItems.map(item => ({
            itemId: item.id,
            score: item.id === 'hr_item_14' ? item.maxScore - 2 : Math.max(0, item.maxScore - 1),
            comment: item.id === 'hr_item_14' ? 'One bottle was not labeled correctly.' : '',
            defects: item.id === 'hr_item_14' ? ['defect_needs_maintenance'] : [],
            photos: []
        })),
    },
    {
        id: 'report2',
        referenceNumber: 'INSP-2024-002',
        inspectorId: 'user2',
        locationId: 'loc4', // Medium Risk
        date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        status: ReportStatus.NeedsAction,
        supervisorComment: 'Please address the waste disposal issue immediately.',
        items: mediumRiskItems.map(item => ({
            itemId: item.id,
            score: item.id === 'mr_item_8' ? item.maxScore - 3 : Math.max(0, item.maxScore - 1),
            comment: item.id === 'mr_item_8' ? 'General waste bin was overflowing.' : '',
            defects: item.id === 'mr_item_8' ? ['defect_needs_cleaning'] : [],
            photos: []
        })),
    },
    {
        id: 'report4',
        referenceNumber: 'INSP-2024-004',
        inspectorId: 'user4', // Layla
        locationId: 'loc2', // High Risk
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: ReportStatus.Submitted,
        items: highRiskItems.map(item => ({
            itemId: item.id,
            score: item.maxScore, // Perfect score
            comment: 'Excellent condition.',
            defects: [],
            photos: []
        })),
    },
    {
        id: 'report5',
        referenceNumber: 'INSP-2024-005',
        inspectorId: 'user4', // Layla
        locationId: 'loc5', // Medium Risk
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: ReportStatus.Reviewed,
        supervisorComment: 'Outstanding work, Layla. A model report.',
        items: mediumRiskItems.map(item => ({
            itemId: item.id,
            score: item.maxScore, // Perfect score
            comment: '',
            defects: [],
            photos: []
        })),
    },
    {
        id: 'report6',
        referenceNumber: 'INSP-2024-006',
        inspectorId: 'user4', // Layla
        locationId: 'loc7', // Low Risk
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        status: ReportStatus.Reviewed,
        items: lowRiskItems.map(item => ({
            itemId: item.id,
            score: Math.max(0, item.maxScore - 1),
            comment: '',
            defects: [],
            photos: []
        })),
    },
    // More reports for Layla to make her the top inspector
    {
        id: 'report7',
        referenceNumber: 'INSP-2024-007',
        inspectorId: 'user4',
        locationId: 'loc3', // High Risk
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: ReportStatus.Reviewed,
        items: highRiskItems.map(item => ({ itemId: item.id, score: item.maxScore, comment: '', defects: [], photos: [] })),
    },
    {
        id: 'report8',
        referenceNumber: 'INSP-2024-008',
        inspectorId: 'user4',
        locationId: 'loc4', // Medium Risk
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: ReportStatus.Reviewed,
        items: mediumRiskItems.map(item => ({ itemId: item.id, score: item.maxScore -1, comment: 'Minor dust found', defects: ['defect_dust'], photos: [] })),
    },
     {
        id: 'report9',
        referenceNumber: 'INSP-2024-009',
        inspectorId: 'user4',
        locationId: 'loc1', // High Risk
        date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        status: ReportStatus.Reviewed,
        items: highRiskItems.map(item => ({ itemId: item.id, score: item.maxScore, comment: '', defects: [], photos: [] })),
    },
    {
        id: 'report10',
        referenceNumber: 'INSP-2024-010',
        inspectorId: 'user4',
        locationId: 'loc6', // Low Risk
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        status: ReportStatus.Reviewed,
        items: lowRiskItems.map(item => ({ itemId: item.id, score: item.maxScore, comment: '', defects: [], photos: [] })),
    },
    // Reports for other inspectors
    {
        id: 'report11',
        referenceNumber: 'INSP-2024-011',
        inspectorId: 'user1',
        locationId: 'loc5', // Medium
        date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        status: ReportStatus.Reviewed,
        items: mediumRiskItems.map(item => ({ itemId: item.id, score: Math.max(0, item.maxScore - 2), comment: '', defects: [], photos: [] })),
    },
    {
        id: 'report12',
        referenceNumber: 'INSP-2024-012',
        inspectorId: 'user1',
        locationId: 'loc7', // Low
        date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
        status: ReportStatus.Reviewed,
        items: lowRiskItems.map(item => ({ itemId: item.id, score: Math.max(0, item.maxScore - 1), comment: '', defects: [], photos: [] })),
    },
    {
        id: 'report13',
        referenceNumber: 'INSP-2024-013',
        inspectorId: 'user2',
        locationId: 'loc2', // High
        date: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
        status: ReportStatus.NeedsAction,
        supervisorComment: 'Critical issue with waste disposal. Re-inspection required.',
        items: highRiskItems.map(item => ({
            itemId: item.id,
            score: item.id === 'hr_item_9' ? 2 : Math.max(0, item.maxScore - 1),
            comment: item.id === 'hr_item_9' ? 'Medical waste bin not sealed properly.' : '',
            defects: item.id === 'hr_item_9' ? ['defect_needs_maintenance'] : [],
            photos: []
        })),
    },
    {
        id: 'report14',
        referenceNumber: 'INSP-2024-014',
        inspectorId: 'user2',
        locationId: 'loc6', // Low
        date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        status: ReportStatus.Reviewed,
        items: lowRiskItems.map(item => ({ itemId: item.id, score: item.maxScore - 1, comment: '', defects: [], photos: [] })),
    },
    {
        id: 'report15',
        referenceNumber: 'INSP-2024-015',
        inspectorId: 'user5', // Khalid
        locationId: 'loc4', // Medium
        date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        status: ReportStatus.Submitted,
        items: mediumRiskItems.map(item => ({ itemId: item.id, score: Math.max(0, item.maxScore - 2), comment: '', defects: [], photos: [] })),
    },
    {
        id: 'report16',
        referenceNumber: 'INSP-2024-016',
        inspectorId: 'user5', // Khalid
        locationId: 'loc3', // High
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        status: ReportStatus.Reviewed,
        items: highRiskItems.map(item => ({ itemId: item.id, score: Math.max(0, item.maxScore - 1), comment: '', defects: [], photos: [] })),
    },
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif1',
    type: 'alert',
    message: 'Critical low score (65%) detected at ER Triage by Fatima Saad.',
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    isRead: false,
    link: `/report/report2`,
  },
  {
    id: 'notif2',
    type: 'success',
    message: 'Layla Alotaibi completed inspection at OR 2 with a score of 100%.',
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    isRead: false,
    link: `/report/report4`,
  },
  {
    id: 'notif3',
    type: 'info',
    message: 'Monthly compliance report for May 2024 has been generated.',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    isRead: true,
  },
  {
    id: 'notif4',
    type: 'alert',
    message: 'Inspection for ICU is overdue by 2 days.',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
  }
];

// CDR Constants
export const SERVICE_TYPES: CDRServiceType[] = Object.values(CDRServiceType);
export const MANPOWER_DISCREPANCY_OPTIONS = ['Not aware of EVS mission', 'Poor communicator / non-English-speaking staff', 'Uncooperative staff', 'Unauthorized staff / No ID badge', 'Personal hygiene', 'Not approved uniform / No uniform', 'Untrained staff / Not aware of chemical dilution', 'Shortage of staff'];
export const MATERIAL_DISCREPANCY_OPTIONS = ['Using unauthorized supplies', 'Expired items', 'Shortage of supplies', 'No MSDS on site', 'Not maintaining minimum/maximum stock'];
export const EQUIPMENT_DISCREPANCY_OPTIONS = ['Equipment not clean', 'Unauthorized / untagged equipment', 'Improper equipment handling', 'Default of equipment', 'No scheduled maintenance'];
export const ON_SPOT_ACTION_OPTIONS = ['Informing supervisor', 'Stopped procedure', 'Highlighted policy'];
export const ACTION_PLAN_OPTIONS = ['Root cause analysis', 'Process review', 'Implement', 'Involve all stakeholders'];

export const INITIAL_CDRS: CDR[] = [
    {
        id: 'cdr1',
        referenceNumber: 'CDR-2024-001',
        employeeId: 'user1',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '10:30',
        location: 'ER Ward A',
        department: 'Emergency',
        incidentType: CDRIncidentType.First,
        inChargeName: 'Nurse Fatima',
        inChargeId: 'N789',
        inChargeEmail: 'fatima@hospital.com',
        serviceTypes: [CDRServiceType.Housekeeping, CDRServiceType.HazardousWaste],
        manpowerDiscrepancy: ['Shortage of staff'],
        materialDiscrepancy: [],
        equipmentDiscrepancy: ['Equipment not clean'],
        onSpotAction: ['Informing supervisor'],
        actionPlan: ['Root cause analysis'],
        staffComment: 'Observed a significant delay in cleaning a patient room after discharge. Cleaning cart was also visibly dirty. This was due to staff being pulled to another emergency.',
        attachments: [],
        employeeSignature: 'Mohammed Ali',
        status: CDRStatus.Approved,
        managerDecision: CDRManagerDecision.Attention,
        managerComment: 'Acknowledged. Please ensure backup staff are available for such situations. Discussed with shift lead.',
        managerSignature: 'Manager Ahmed',
        finalizedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'cdr2',
        referenceNumber: 'CDR-2024-002',
        employeeId: 'user2',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '14:00',
        location: 'OR 2',
        department: 'Surgery',
        incidentType: CDRIncidentType.Investigation,
        inChargeName: 'Dr. Khalid',
        inChargeId: 'S456',
        inChargeEmail: 'khalid@hospital.com',
        serviceTypes: [CDRServiceType.Housekeeping],
        manpowerDiscrepancy: [],
        materialDiscrepancy: [],
        equipmentDiscrepancy: [],
        onSpotAction: [],
        actionPlan: [],
        staffComment: 'Awaiting further details on the incident from the surgery team before completing the report.',
        attachments: [],
        employeeSignature: 'Fatima Saad',
        status: CDRStatus.Draft,
    }
];
