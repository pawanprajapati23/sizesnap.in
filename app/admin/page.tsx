'use client'

import { auth } from '@/lib/firebase'
import { ArrowUpRight, ArrowDownRight, Users, Activity, Download, MousePointerClick, Zap } from 'lucide-react'

export default function AdminDashboard() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Welcome back, <span className="font-medium text-slate-700 dark:text-slate-300">{auth?.currentUser?.email}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center text-sm font-medium text-green-600 bg-green-50 dark:bg-green-900/30 px-3 py-1.5 rounded-full border border-green-200 dark:border-green-800/50">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
            System Healthy
          </span>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Visitors Today" value="24,821" change="+18.4%" isPositive={true} icon={Users} />
        <MetricCard title="Tool Uses" value="18,291" change="+12.7%" isPositive={true} icon={Activity} />
        <MetricCard title="Downloads" value="12,483" change="+21.3%" isPositive={true} icon={Download} />
        <MetricCard title="Conversion Rate" value="68.2%" change="-2.1%" isPositive={false} icon={MousePointerClick} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Real-time Dashboard Placeholder */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-500" /> Real-time Activity
            </h2>
            <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded-md">LIVE</span>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center">
                <span className="text-2xl mr-4">🇮🇳</span>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Compress Image → 50KB</p>
                  <p className="text-sm text-slate-500">Mobile • 2 mins ago</p>
                </div>
              </div>
              <span className="text-sm font-medium text-green-600">Success</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center">
                <span className="text-2xl mr-4">🇺🇸</span>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Passport Photo Maker</p>
                  <p className="text-sm text-slate-500">Desktop • Just now</p>
                </div>
              </div>
              <span className="text-sm font-medium text-blue-600">Processing</span>
            </div>
          </div>
        </div>

        {/* AI Growth Center */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-slate-800 dark:to-slate-800/80 rounded-2xl shadow-sm border border-indigo-100 dark:border-slate-700 p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Zap className="w-24 h-24 text-indigo-500" />
          </div>
          <h2 className="text-lg font-bold text-indigo-900 dark:text-indigo-300 mb-2 flex items-center">
            <Zap className="w-5 h-5 mr-2" /> AI Growth Center
          </h2>
          <p className="text-sm text-indigo-700/80 dark:text-slate-400 mb-6">What should I work on today?</p>
          
          <div className="space-y-4">
            <GrowthItem 
              priority="HIGH" 
              title="Improve /compress-image/to-12kb" 
              reason="High search impressions (970/day) but very low CTR. Update meta title."
            />
            <GrowthItem 
              priority="HIGH" 
              title="Fix PDF 15KB Conversion Drop" 
              reason="Users are dropping off at the download step. Check mobile UI."
            />
            <GrowthItem 
              priority="MEDIUM" 
              title="Expand SSC CGL Cluster" 
              reason="Traffic to exam tools is growing 15% WoW. Add SSC GD tool."
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ title, value, change, isPositive, icon: Icon }: any) {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 group hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg group-hover:scale-110 transition-transform">
          <Icon className="w-6 h-6 text-slate-500 dark:text-slate-400" />
        </div>
        <div className={`flex items-center text-sm font-medium px-2 py-1 rounded-full ${isPositive ? 'text-green-700 bg-green-50 dark:bg-green-900/30' : 'text-red-700 bg-red-50 dark:bg-red-900/30'}`}>
          {isPositive ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
          {change}
        </div>
      </div>
      <div>
        <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</h3>
        <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{value}</p>
      </div>
    </div>
  )
}

function GrowthItem({ priority, title, reason }: any) {
  const isHigh = priority === 'HIGH'
  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-4 rounded-xl border border-white/20 dark:border-slate-700 shadow-sm relative">
      <div className="absolute top-0 left-0 w-1 h-full rounded-l-xl bg-gradient-to-b" style={{ backgroundImage: isHigh ? 'linear-gradient(to bottom, #ef4444, #f97316)' : 'linear-gradient(to bottom, #eab308, #f59e0b)' }}></div>
      <div className="pl-3">
        <div className="flex items-center mb-1">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm tracking-wider mr-2 ${isHigh ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>{priority}</span>
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{title}</h4>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-1">{reason}</p>
      </div>
    </div>
  )
}
