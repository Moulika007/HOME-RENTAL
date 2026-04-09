import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, DollarSign, PieChart, Calendar, Home, ArrowUpRight, ArrowDownRight, CreditCard } from 'lucide-react';

const FinancialAnalytics = ({ user, payments = [], bills = [], houses = [] }) => {
  const isOwner = user?.role === 'owner';

  // 1. Data Aggregation
  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.toLocaleString('default', { month: 'long', year: 'numeric' });
    
    // Monthly aggregations
    const monthlyData = {};
    const categories = {};
    
    let totalRevenue = 0;
    let pendingActions = 0;
    let currentMonthAmount = 0;
    let prevMonthAmount = 0;

    const prevMonth = new Date();
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    const prevMonthName = prevMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

    // Process Payments
    payments.forEach(p => {
      const month = p.month;
      if (!monthlyData[month]) monthlyData[month] = { income: 0, expense: 0 };
      
      if (p.status === 'paid') {
        monthlyData[month].income += p.amount;
        totalRevenue += p.amount;
        if (month === currentMonth) currentMonthAmount += p.amount;
        if (month === prevMonthName) prevMonthAmount += p.amount;
      } else {
        pendingActions += 1;
      }

      // Rent category
      categories['Rent'] = (categories['Rent'] || 0) + (p.status === 'paid' ? p.amount : 0);
    });

    // Process Bills (for Renters)
    if (!isOwner) {
      bills.forEach(b => {
        const month = new Date(b.dueDate).toLocaleString('default', { month: 'long', year: 'numeric' });
        if (!monthlyData[month]) monthlyData[month] = { income: 0, expense: 0 };
        
        if (b.isPaid) {
          monthlyData[month].expense += b.amount || 0;
          categories[b.category] = (categories[b.category] || 0) + (b.amount || 0);
        } else {
          pendingActions += 1;
        }
      });
    }

    // Sort monthly data for charts
    const chartData = Object.keys(monthlyData)
      .map(m => ({ name: m, ...monthlyData[m] }))
      .sort((a, b) => new Date(a.name) - new Date(b.name))
      .slice(-6); // Last 6 months

    return { totalRevenue, pendingActions, currentMonthAmount, prevMonthAmount, chartData, categories };
  }, [payments, bills, isOwner]);

  const growth = stats.prevMonthAmount > 0 
    ? ((stats.currentMonthAmount - stats.prevMonthAmount) / stats.prevMonthAmount) * 100 
    : 0;

  // Custom SVG Bar Chart
  const maxVal = Math.max(...stats.chartData.map(d => isOwner ? d.income : d.expense), 1000);
  
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* --- KPI Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden relative group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-violet-500/10 rounded-full blur-2xl group-hover:bg-violet-500/20 transition-all"></div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{isOwner ? 'TOTAL REVENUE' : 'TOTAL SPENT'}</p>
          <div className="flex items-end gap-2">
            <h3 className="text-3xl font-black text-slate-800 dark:text-white">₹{stats.totalRevenue.toLocaleString('en-IN')}</h3>
            <div className={`flex items-center text-xs font-bold mb-1 ${growth >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {growth >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {Math.abs(growth).toFixed(1)}%
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">vs last month (₹{stats.prevMonthAmount.toLocaleString()})</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl"></div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">PENDING ACTIONS</p>
          <div className="flex items-end gap-2">
            <h3 className="text-3xl font-black text-slate-800 dark:text-white">{stats.pendingActions}</h3>
            <span className="text-xs font-bold text-amber-500 mb-1 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">Requires Attention</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">Check notifications for details</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">ACTIVE HOMES</p>
          <div className="flex items-end gap-2">
            <h3 className="text-3xl font-black text-slate-800 dark:text-white">{isOwner ? houses.filter(h => h.isBooked).length : (houses ? 1 : 0)}</h3>
            <span className="text-xs font-bold text-blue-500 mb-1">Live Status</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">{isOwner ? `Out of ${houses.length} properties` : 'Currently renting'}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* --- Spending/Income Trend Chart --- */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700">
          <div className="flex justify-between items-center mb-8">
            <h4 className="font-black text-slate-800 dark:text-white flex items-center gap-2">
              <TrendingUp size={18} className="text-violet-500" /> {isOwner ? 'Revenue Trend' : 'Spending Trend'}
            </h4>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last 6 Months</span>
          </div>
          
          <div className="h-48 flex items-end justify-between gap-4 px-2">
            {stats.chartData.length > 0 ? stats.chartData.map((d, i) => {
              const val = isOwner ? d.income : d.expense;
              const height = (val / maxVal) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center group relative">
                  <div className="absolute -top-8 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition shadow-xl pointer-events-none z-10 font-bold whitespace-nowrap">
                    ₹{val.toLocaleString()}
                  </div>
                  <div 
                    className={`w-full rounded-t-xl transition-all duration-700 ease-out min-h-[4px] ${isOwner ? 'bg-gradient-to-t from-violet-600 to-violet-400' : 'bg-gradient-to-t from-blue-600 to-blue-400'} group-hover:brightness-110 group-hover:shadow-[0_0_15px_rgba(139,92,246,0.3)]`}
                    style={{ height: `${height}%` }}
                  ></div>
                  <p className="text-[8px] font-black text-slate-400 mt-3 uppercase tracking-tighter text-center line-clamp-1">{d.name.split(' ')[0]}</p>
                </div>
              );
            }) : (
                <div className="w-full flex items-center justify-center text-slate-400 text-sm italic">No data available for trend</div>
            )}
          </div>
        </div>

        {/* --- Category Breakdown --- */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700">
          <div className="flex justify-between items-center mb-8">
            <h4 className="font-black text-slate-800 dark:text-white flex items-center gap-2">
              <PieChart size={18} className="text-emerald-500" /> {isOwner ? 'Revenue Sources' : 'Expense Breakdown'}
            </h4>
          </div>

          <div className="space-y-4 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {Object.keys(stats.categories).length > 0 ? Object.entries(stats.categories).sort((a,b) => b[1] - a[1]).map(([cat, val], i) => {
              const percentage = (val / stats.totalRevenue) * 100;
              const colors = ['bg-violet-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-teal-500'];
              return (
                <div key={cat} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-600 dark:text-slate-300 flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${colors[i % colors.length]}`}></div>
                      {cat}
                    </span>
                    <span className="font-black text-slate-800 dark:text-white">₹{val.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className={`${colors[i % colors.length]} h-full rounded-full transition-all duration-1000`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              )
            }) : (
                <div className="w-full flex items-center justify-center h-32 text-slate-400 text-sm italic">No categorized data yet</div>
            )}
          </div>
        </div>

      </div>

      <style jsx="true">{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
      `}</style>
    </div>
  );
};

export default FinancialAnalytics;
