// Mock data for admin dashboard

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'CLIENT';
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
}

export interface Bank {
  id: string;
  name: string;
  code: string;
  country: string;
  logoUrl: string;
  active: boolean;
  createdAt: string;
}

export interface ParserConfig {
  id: string;
  name: string;
  bankId: string;
  bankName: string;
  status: 'enabled' | 'disabled';
  parserType: 'email' | 'pdf' | 'api';
  subjectPattern: string;
  fromEmail: string;
  notes: string;
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalAdmins: number;
  totalBanks: number;
  totalParserConfigs: number;
  transactionsLast7Days: number;
  emailsIngestedLast7Days: number;
}

export interface ActivityData {
  date: string;
  transactions: number;
  emails: number;
}

export const mockCurrentUser: User = {
  id: '1',
  email: 'admin@kardio.app',
  name: 'Admin User',
  role: 'ADMIN',
  status: 'active',
  createdAt: '2024-01-15',
};

export const mockStats: AdminStats = {
  totalUsers: 1284,
  totalAdmins: 8,
  totalBanks: 42,
  totalParserConfigs: 127,
  transactionsLast7Days: 15847,
  emailsIngestedLast7Days: 3291,
};

export const mockActivityData: ActivityData[] = [
  { date: 'Mon', transactions: 2100, emails: 420 },
  { date: 'Tue', transactions: 2450, emails: 510 },
  { date: 'Wed', transactions: 1890, emails: 380 },
  { date: 'Thu', transactions: 2680, emails: 590 },
  { date: 'Fri', transactions: 2920, emails: 620 },
  { date: 'Sat', transactions: 1540, emails: 320 },
  { date: 'Sun', transactions: 1267, emails: 451 },
];

export const mockBanks: Bank[] = [
  { id: '1', name: 'Chase Bank', code: 'CHASE', country: 'United States', logoUrl: '', active: true, createdAt: '2024-01-10' },
  { id: '2', name: 'Bank of America', code: 'BOA', country: 'United States', logoUrl: '', active: true, createdAt: '2024-01-12' },
  { id: '3', name: 'Wells Fargo', code: 'WF', country: 'United States', logoUrl: '', active: true, createdAt: '2024-01-15' },
  { id: '4', name: 'HSBC', code: 'HSBC', country: 'United Kingdom', logoUrl: '', active: true, createdAt: '2024-01-18' },
  { id: '5', name: 'Barclays', code: 'BARC', country: 'United Kingdom', logoUrl: '', active: false, createdAt: '2024-01-20' },
  { id: '6', name: 'Deutsche Bank', code: 'DB', country: 'Germany', logoUrl: '', active: true, createdAt: '2024-02-01' },
  { id: '7', name: 'BNP Paribas', code: 'BNP', country: 'France', logoUrl: '', active: true, createdAt: '2024-02-05' },
  { id: '8', name: 'Santander', code: 'SAN', country: 'Spain', logoUrl: '', active: false, createdAt: '2024-02-10' },
];

export const mockParserConfigs: ParserConfig[] = [
  { id: '1', name: 'Chase Transaction Parser', bankId: '1', bankName: 'Chase Bank', status: 'enabled', parserType: 'email', subjectPattern: 'Transaction Alert:', fromEmail: 'alerts@chase.com', notes: 'Main transaction parser for Chase', createdAt: '2024-01-15' },
  { id: '2', name: 'BOA Statement Parser', bankId: '2', bankName: 'Bank of America', status: 'enabled', parserType: 'pdf', subjectPattern: 'Your Statement is Ready', fromEmail: 'statements@bofa.com', notes: 'Monthly statement parser', createdAt: '2024-01-18' },
  { id: '3', name: 'Wells Fargo Alerts', bankId: '3', bankName: 'Wells Fargo', status: 'enabled', parserType: 'email', subjectPattern: 'Account Alert', fromEmail: 'alert@wellsfargo.com', notes: '', createdAt: '2024-01-20' },
  { id: '4', name: 'HSBC API Integration', bankId: '4', bankName: 'HSBC', status: 'enabled', parserType: 'api', subjectPattern: '', fromEmail: '', notes: 'Direct API integration', createdAt: '2024-02-01' },
  { id: '5', name: 'Barclays Email Parser', bankId: '5', bankName: 'Barclays', status: 'disabled', parserType: 'email', subjectPattern: 'Your Barclays notification', fromEmail: 'notify@barclays.co.uk', notes: 'Disabled due to format changes', createdAt: '2024-02-05' },
  { id: '6', name: 'Deutsche Bank Statements', bankId: '6', bankName: 'Deutsche Bank', status: 'enabled', parserType: 'pdf', subjectPattern: 'Kontoauszug', fromEmail: 'service@deutsche-bank.de', notes: 'German language parser', createdAt: '2024-02-10' },
];

export const mockUsers: User[] = [
  { id: '1', email: 'admin@kardio.app', name: 'Admin User', role: 'ADMIN', status: 'active', createdAt: '2024-01-01' },
  { id: '2', email: 'sarah@example.com', name: 'Sarah Johnson', role: 'CLIENT', status: 'active', createdAt: '2024-01-05' },
  { id: '3', email: 'mike@example.com', name: 'Mike Chen', role: 'CLIENT', status: 'active', createdAt: '2024-01-10' },
  { id: '4', email: 'emma@example.com', name: 'Emma Wilson', role: 'CLIENT', status: 'inactive', createdAt: '2024-01-15' },
  { id: '5', email: 'ops@kardio.app', name: 'Operations Admin', role: 'ADMIN', status: 'active', createdAt: '2024-01-20' },
  { id: '6', email: 'david@example.com', name: 'David Brown', role: 'CLIENT', status: 'pending', createdAt: '2024-02-01' },
  { id: '7', email: 'lisa@example.com', name: 'Lisa Anderson', role: 'CLIENT', status: 'active', createdAt: '2024-02-05' },
  { id: '8', email: 'tech@kardio.app', name: 'Tech Admin', role: 'ADMIN', status: 'active', createdAt: '2024-02-10' },
];
