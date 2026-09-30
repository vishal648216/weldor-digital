export type RoleName = 
  | 'Super Admin'
  | 'Admin / Operations'
  | 'Sales Manager'
  | 'Sales Executive'
  | 'HR & Payroll Manager'
  | 'Engineering'
  | 'Marketing'
  | 'Accounts'
  | 'Production'
  | (string & {});

export type AccessScope = 'All' | 'Team' | 'Assigned' | 'Own' | 'Country' | 'Category';
export type RoleScope = AccessScope;

export type PermissionAction = 
  | 'view' 
  | 'create' 
  | 'edit' 
  | 'delete' 
  | 'assign' 
  | 'reassign' 
  | 'approve' 
  | 'export' 
  | 'import' 
  | 'publish' 
  | 'send' 
  | 'configure';

export type CRMModule = 
  | 'dashboard'
  | 'leads'
  | 'companies'
  | 'contacts'
  | 'products'
  | 'rfqs'
  | 'samples'
  | 'quotations'
  | 'trials'
  | 'orders'
  | 'employees'
  | 'payroll'
  | 'attendance'
  | 'exhibitions'
  | 'cms'
  | 'rbac'
  | 'analytics'
  | 'audit'
  | 'settings';

export interface PermissionRule {
  module: CRMModule;
  actions: PermissionAction[];
}

export interface Role {
  id: string;
  name: RoleName;
  description: string;
  isSystem: boolean;
  permissions: PermissionRule[];
  scope: AccessScope;
}

export interface EmployeeSalaryStructure {
  baseSalary: number;
  hra: number;
  da: number;
  specialAllowance: number;
  conveyanceAllowance: number;
  medicalAllowance: number;
  pfDeductionEmployee: number;
  pfDeductionEmployer: number;
  professionalTax: number;
  tdsTax: number;
  grossMonthlySalary: number;
  netMonthlySalary: number;
  annualCTC: number;
}

export interface EmployeeBankDetails {
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branch: string;
  accountType: 'Savings' | 'Current' | 'Salary';
}

export interface EmployeeEmergencyContact {
  name: string;
  relation: string;
  phone: string;
}

export interface Employee {
  id: string;
  employeeId: string; // e.g. WLD-EMP-101
  employeeCode?: string;
  name: string;
  fatherName?: string;
  dateOfBirth?: string;
  dateOfJoining: string;
  gender?: 'Male' | 'Female' | 'Other';
  employmentType: 'Full-Time' | 'Contract' | 'Probation' | 'Intern';
  designation: string;
  department: 'Executive Management' | 'Sales & BD' | 'Engineering & R&D' | 'Production & CNC' | 'Quality Control' | 'Accounts & Finance' | 'HR & Admin' | 'Logistics & Dispatch';
  roleId: string;
  roleName: RoleName;
  reportingManager?: string;
  email: string;
  phone: string;
  panNumber?: string;
  aadhaarNumber?: string;
  uanNumber?: string;
  pfNumber?: string;
  bankDetails: EmployeeBankDetails;
  salaryStructure: EmployeeSalaryStructure;
  territory: string[];
  productCategories: string[];
  scope: AccessScope;
  status: 'Active' | 'Inactive' | 'On Leave' | 'Probation';
  avatarUrl: string;
  address?: {
    currentAddress: string;
    city: string;
    state: string;
    pincode: string;
  };
  emergencyContact?: EmployeeEmergencyContact;
  password?: string;
  activeSessionToken?: string;
  lastLoginAt?: string;
  lastLoginDevice?: string;
}

export interface PayrollRecord {
  id: string;
  payrollMonth: string; // e.g. "September 2026"
  payrollYear: number;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  department: string;
  designation: string;
  bankName: string;
  bankAccountNumber: string;
  ifscCode: string;
  panNumber: string;
  workingDays: number;
  paidDays: number;
  unpaidLeaves: number;
  overtimeHours: number;
  overtimeRate: number;
  overtimePay: number;
  performanceBonus: number;
  baseSalary: number;
  hra: number;
  da: number;
  specialAllowance: number;
  conveyanceAllowance: number;
  medicalAllowance: number;
  grossEarnings: number;
  pfDeduction: number;
  professionalTax: number;
  tdsTax: number;
  leaveDeduction: number;
  otherDeductions: number;
  totalDeductions: number;
  netPayable: number;
  status: 'Draft' | 'Approved' | 'Disbursed' | 'Paid';
  paymentMode: 'NEFT / RTGS' | 'Bank Transfer' | 'Cheque' | 'UPI';
  transactionReference?: string;
  disbursedAt?: string;
  remarks?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string; // YYYY-MM-DD
  checkIn: string; // HH:MM
  checkOut?: string; // HH:MM
  totalHours: number;
  overtimeHours: number;
  status: 'Present' | 'Late' | 'Half Day' | 'On Leave' | 'Absent' | 'Holiday';
  shift: 'Morning General (09:00 - 18:00)' | 'Night Shift (20:00 - 05:00)' | 'Evening Shift (14:00 - 23:00)';
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department?: string;
  leaveType: 'Casual Leave' | 'Sick Leave' | 'Earned / Paid Leave' | 'Casual Leave (CL)' | 'Sick Leave (SL)' | 'Paid Leave (PL)' | 'Maternity / Paternity' | 'Unpaid Leave';
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  approvedBy?: string;
  appliedAt: string;
}

export interface CompanySettings {
  companyName: string;
  brandName?: string;
  legalEntityName?: string;
  legalName?: string;
  cinNumber: string;
  gstinNumber?: string;
  gstin?: string;
  panNumber: string;
  iecCode: string;
  msmeRegistrationNo?: string;
  registeredOffice?: string;
  registeredOfficeAddress?: {
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
  };
  factoryPlantAddress?: string;
  supportEmail?: string;
  primaryEmail?: string;
  salesPhone?: string;
  primaryPhone?: string;
  websiteUrl?: string;
  currency?: string;
  fiscalYear?: string;
  bankAccounts?: any[];
  primaryBank: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    ifscCode: string;
    branch: string;
  };
  slaSettings?: {
    leadResponseHours?: number;
    quoteApprovalThresholdUSD?: number;
    autoAssignSalesLead?: boolean;
    enableWhatsAppNotifications?: boolean;
    enablePayrollReminderDays?: number;
  };
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  productCount: number;
  featured: boolean;
  image: string; // Thumbnail image
  bannerImage?: string;
  subCategories?: string[];
  seoKeywords?: string[];
  seoMetaTitle?: string;
  seoMetaDescription?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductSpecification {
  label: string;
  value: string;
  unit?: string;
  category?: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  categoryId: string;
  subCategory?: string;
  brand?: string;
  modelNumber?: string;
  tagline: string;
  description: string;
  bulletPoints?: string[]; // Amazon 5-point Key Feature highlights
  industries: string[];
  applications: string[];
  materials: string[];
  specifications: ProductSpecification[];
  featured: boolean;
  image: string; // Primary Thumbnail Image
  gallery: string[]; // Multiple High-Res Product Photos
  videoUrl?: string; // Product Demo Video
  videoThumbnail?: string;
  catalogPdfUrl?: string; // Downloadable Catalog / Product Brochure
  datasheetUrl?: string; // Technical Spec Sheet
  cadDrawingUrl?: string; // 3D CAD STEP / IGES / DWG Model
  priceUSD?: number;
  priceINR?: number;
  certifications: string[];
  minOrderQty: number;
  standardLeadTimeDays: number;
  inStock: boolean;
  seoKeywords: string[]; // Amazon Backend Search Terms (Hidden from public UI, used for SEO & Search Engine indexing)
  seoMetaTitle?: string;
  seoMetaDescription?: string;
  status?: 'Active' | 'Draft' | 'Archived';
  createdAt?: string;
  updatedAt?: string;
}

export type LeadSource = 
  | 'Product Enquiry'
  | 'RFQ / Drawing Upload'
  | 'Sample Request'
  | 'Contact Form'
  | 'Talk to Engineer'
  | 'Distributor Enquiry'
  | 'Catalogue Download'
  | 'Exhibition QR'
  | 'WhatsApp'
  | 'IndiaMART'
  | 'Direct Sales';

export type LeadStage = 
  | 'NEW_LEAD'
  | 'CONTACTED'
  | 'REQUIREMENT_UNDERSTOOD'
  | 'SAMPLE_REQUESTED'
  | 'SAMPLE_IN_PROGRESS'
  | 'SAMPLE_SENT'
  | 'CUSTOMER_FEEDBACK'
  | 'QUOTATION_DRAFT'
  | 'QUOTATION_APPROVAL'
  | 'QUOTATION_SENT'
  | 'NEGOTIATION'
  | 'TRIAL'
  | 'ORDER'
  | 'WON'
  | 'LOST';

export interface LeadActivity {
  id: string;
  leadId: string;
  timestamp: string;
  type: 'Note' | 'Status_Change' | 'Call' | 'Email' | 'Meeting' | 'Sample_Dispatched' | 'Quotation_Sent' | 'Drawing_Uploaded';
  performedBy: string;
  description: string;
  details?: Record<string, any>;
}

export interface Lead {
  id: string;
  leadNumber: string;
  title: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  country: string;
  city: string;
  source: LeadSource;
  exhibitionSource?: string;
  stage: LeadStage;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  assignedEmployeeId: string;
  assignedEmployeeName: string;
  productId?: string;
  productName?: string;
  categoryName?: string;
  expectedQuantity?: number;
  estimatedValueUSD: number;
  drawingFile?: {
    name: string;
    size: string;
    type: string;
    url: string;
  };
  technicalNotes?: string;
  slaDeadline: string;
  isSlaViolated: boolean;
  lostReason?: string;
  createdAt: string;
  updatedAt: string;
  activities: LeadActivity[];
  sampleId?: string;
  quotationId?: string;
  trialId?: string;
  orderId?: string;
}

export interface RFQRequirement {
  id: string;
  leadId: string;
  requirementType: 'Standard Product' | 'Custom Engineering' | 'Drawing Revision' | 'Bulk Tender';
  productId?: string;
  categoryName: string;
  targetQuantity: number;
  targetUnit: string;
  materialPreference: string;
  surfaceFinish?: string;
  pressureRating?: string;
  drawingFileName?: string;
  cadFileUrl?: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  country: string;
  preferredResponse: 'Email' | 'Phone' | 'WhatsApp' | 'Virtual Meeting';
  status: 'Pending Review' | 'Engineering Evaluated' | 'Quotation In Progress' | 'Converted to Quote';
  createdAt: string;
}

export interface SampleRequest {
  id: string;
  sampleNumber: string;
  leadId: string;
  companyName: string;
  productName: string;
  quantityRequested: number;
  stage: 'Requested' | 'Approved' | 'In Production' | 'Ready' | 'Dispatched' | 'Delivered' | 'Feedback Received';
  courierTrackingNo?: string;
  dispatchDate?: string;
  deliveryDate?: string;
  feedbackRating?: 1 | 2 | 3 | 4 | 5;
  feedbackNotes?: string;
  createdAt: string;
}

export interface TechnicalTrial {
  id: string;
  trialNumber: string;
  leadId: string;
  companyName: string;
  productName: string;
  testParameters: {
    pressureTestBar?: number;
    leakageTestResult?: string;
    corrosionHours?: number;
    cycleCount?: number;
  };
  status: 'Plan Defined' | 'Execution In Progress' | 'Customer Testing' | 'Approved' | 'Failed';
  failureReason?: string;
  evaluatorEngineer: string;
  completionDate?: string;
}

export interface QuotationItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPriceUSD: number;
  discountPercentage: number;
  taxPercentage: number;
  totalPriceUSD: number;
}

export interface Quotation {
  id: string;
  quotationNumber: string;
  leadId: string;
  companyName: string;
  contactName: string;
  email: string;
  items: QuotationItem[];
  subtotalUSD: number;
  totalDiscountUSD: number;
  taxTotalUSD: number;
  freightCostUSD: number;
  grandTotalUSD: number;
  paymentTerms: string;
  deliveryTerms: string;
  validityDays: number;
  status: 'Draft' | 'Pending Manager Approval' | 'Approved' | 'Sent to Customer' | 'Viewed' | 'Accepted' | 'Rejected' | 'Expired';
  requiresApproval: boolean;
  approvalNotes?: string;
  createdAt: string;
  sentAt?: string;
  acceptedAt?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPriceUSD: number;
  totalPriceUSD: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  quotationId: string;
  leadId: string;
  companyName: string;
  contactName: string;
  items: OrderItem[];
  totalValueUSD: number;
  stage: 'Confirmed' | 'In Production' | 'QC Inspection' | 'Ready for Dispatch' | 'Dispatched' | 'Delivered';
  expectedDeliveryDate: string;
  isRepeatOrder: boolean;
  parentOrderId?: string;
  createdAt: string;
}

export interface ExhibitionMediaItem {
  type: 'photo' | 'video';
  url: string;
  thumbnail?: string;
  caption?: string;
  videoDuration?: string;
}

export interface Exhibition {
  id: string;
  title: string;
  subtitle?: string;
  location: string;
  fullAddress?: string;
  city: string;
  country: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  hallNumber: string;
  boothNumber: string;
  description: string;
  keyHighlights?: string[];
  bannerImage: string; // Main Thumbnail / Banner Image
  galleryImages?: string[]; // Multiple high-res photos
  videoUrls?: string[]; // Multiple demo videos
  brochurePdfUrl?: string; // Downloadable Event Catalog / PDF Flyer
  showcasedCategoryIds: string[];
  showcasedProducts?: string[];
  qrSlug: string;
  leadsCapturedCount: number;
  featured: boolean;
  status: 'Upcoming' | 'Past Exhibition';
  autoArchivePassedDate?: boolean;
}

export interface GalleryMedia {
  id: string;
  title: string;
  category: 'Factory Floor' | 'CNC Machining' | 'Testing Bays' | 'Product Closeups' | 'Robotic Cell' | 'Exhibitions & Events' | 'R&D Quality Lab';
  type: 'Photo' | 'Video';
  mediaTypeGroup?: 'photo' | 'video';
  url: string;
  thumbnail: string;
  caption: string;
  videoDuration?: string;
  tags: string[];
  seoKeywords?: string[];
  createdAt?: string;
}

export type BannerTransitionEffect = 
  | 'zoom' 
  | 'kenburns' 
  | 'flip-x' 
  | 'flip-y' 
  | 'flop-cube' 
  | 'fade-glow' 
  | 'parallax-slide' 
  | 'glitch-blur';

export type BannerOverlayTheme = 
  | 'dark-glass' 
  | 'orange-tech' 
  | 'blueprint-navy' 
  | 'clean-light' 
  | 'emerald-precision';

export interface HeroBanner {
  id: string;
  badge: string;
  title: string;
  highlightText?: string;
  subtitle: string;
  description: string;
  bgImageUrl: string;
  productImageUrl?: string;
  productSku?: string;
  productName?: string;
  transitionEffect: BannerTransitionEffect;
  overlayTheme: BannerOverlayTheme;
  primaryBtnText: string;
  primaryBtnAction: string;
  secondaryBtnText: string;
  secondaryBtnAction: string;
  stats?: { label: string; value: string }[];
  features?: string[];
  active: boolean;
  displayOrder: number;
  autoplayDurationSec: number;
  createdAt?: string;
}

export type CMSBanner = HeroBanner;

export interface AuditLog {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  action: string;
  module: string;
  targetId: string;
  ipAddress: string;
  details: string;
}
