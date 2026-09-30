import mongoose from 'mongoose';

const baseOptions = {
  timestamps: true,
  strict: false,
};

// Generic flexible schema generator for high-velocity industrial CRM & CMS
const createFlexibleSchema = () => {
  const schema = new mongoose.Schema(
    {
      id: { type: String, required: true, unique: true, index: true },
    },
    baseOptions
  );
  return schema;
};

export const UserModel = mongoose.models.User || mongoose.model('User', createFlexibleSchema(), 'users');
export const ProductModel = mongoose.models.Product || mongoose.model('Product', createFlexibleSchema(), 'products');
export const CategoryModel = mongoose.models.Category || mongoose.model('Category', createFlexibleSchema(), 'categories');
export const LeadModel = mongoose.models.Lead || mongoose.model('Lead', createFlexibleSchema(), 'leads');
export const RFQModel = mongoose.models.RFQ || mongoose.model('RFQ', createFlexibleSchema(), 'rfqs');
export const SampleModel = mongoose.models.Sample || mongoose.model('Sample', createFlexibleSchema(), 'samples');
export const TrialModel = mongoose.models.Trial || mongoose.model('Trial', createFlexibleSchema(), 'trials');
export const QuotationModel = mongoose.models.Quotation || mongoose.model('Quotation', createFlexibleSchema(), 'quotations');
export const OrderModel = mongoose.models.Order || mongoose.model('Order', createFlexibleSchema(), 'orders');
export const InvoiceModel = mongoose.models.Invoice || mongoose.model('Invoice', createFlexibleSchema(), 'invoices');
export const EmployeeModel = mongoose.models.Employee || mongoose.model('Employee', createFlexibleSchema(), 'employees');
export const RoleModel = mongoose.models.Role || mongoose.model('Role', createFlexibleSchema(), 'roles');
export const PayrollModel = mongoose.models.Payroll || mongoose.model('Payroll', createFlexibleSchema(), 'payrolls');
export const AttendanceModel = mongoose.models.Attendance || mongoose.model('Attendance', createFlexibleSchema(), 'attendances');
export const LeaveModel = mongoose.models.Leave || mongoose.model('Leave', createFlexibleSchema(), 'leaves');
export const BannerModel = mongoose.models.Banner || mongoose.model('Banner', createFlexibleSchema(), 'banners');
export const GalleryModel = mongoose.models.Gallery || mongoose.model('Gallery', createFlexibleSchema(), 'gallery');
export const ExhibitionModel = mongoose.models.Exhibition || mongoose.model('Exhibition', createFlexibleSchema(), 'exhibitions');
export const SettingModel = mongoose.models.Setting || mongoose.model('Setting', createFlexibleSchema(), 'settings');
export const AuditLogModel = mongoose.models.AuditLog || mongoose.model('AuditLog', createFlexibleSchema(), 'auditlogs');

export const COLLECTION_MODELS = {
  users: UserModel,
  products: ProductModel,
  categories: CategoryModel,
  leads: LeadModel,
  rfqs: RFQModel,
  samples: SampleModel,
  trials: TrialModel,
  quotations: QuotationModel,
  orders: OrderModel,
  invoices: InvoiceModel,
  employees: EmployeeModel,
  roles: RoleModel,
  payrolls: PayrollModel,
  attendances: AttendanceModel,
  leaves: LeaveModel,
  banners: BannerModel,
  gallery: GalleryModel,
  exhibitions: ExhibitionModel,
  settings: SettingModel,
  auditlogs: AuditLogModel,
};
