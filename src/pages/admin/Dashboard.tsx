import {
  Users,
  ShieldCheck,
  Building2,
  FileCode2,
  ArrowUpDown,
  Mail,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useAdminStats } from '@/hooks/useAdminStats';
import { StatCard } from '@/components/admin/StatCard';
import { PageHeader } from '@/components/admin/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboard() {
  const { stats, activityData, isLoading } = useAdminStats();

  if (isLoading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's an overview of your system."
      />

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          variant="primary"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Administrators"
          value={stats.totalAdmins}
          icon={ShieldCheck}
          variant="accent"
        />
        <StatCard
          title="Active Banks"
          value={stats.totalBanks}
          icon={Building2}
          variant="default"
        />
        <StatCard
          title="Parser Configs"
          value={stats.totalParserConfigs}
          icon={FileCode2}
          variant="default"
        />
        <StatCard
          title="Transactions (7d)"
          value={stats.transactionsLast7Days}
          icon={ArrowUpDown}
          variant="primary"
          trend={{ value: 8.5, isPositive: true }}
        />
        <StatCard
          title="Emails Ingested (7d)"
          value={stats.emailsIngestedLast7Days}
          icon={Mail}
          variant="default"
          trend={{ value: 3.2, isPositive: true }}
        />
      </div>

      {/* Activity Chart */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Activity Overview</CardTitle>
          <CardDescription>Transactions and emails processed over the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTransactions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(168, 80%, 30%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(168, 80%, 30%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorEmails" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(12, 76%, 61%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(12, 76%, 61%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: 'var(--shadow-lg)',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="transactions"
                  stroke="hsl(168, 80%, 30%)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorTransactions)"
                  name="Transactions"
                />
                <Area
                  type="monotone"
                  dataKey="emails"
                  stroke="hsl(12, 76%, 61%)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorEmails)"
                  name="Emails"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
