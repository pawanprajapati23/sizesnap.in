'use client'

import { useState } from 'react'
import { AlertTriangle, ShieldAlert, ZapOff } from 'lucide-react'

export default function MaintenanceSettings() {
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
           <AlertTriangle className="w-6 h-6 text-rose-500" />
           Maintenance & Operations
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Emergency controls and system-wide overrides.</p>
      </div>

      <div className="max-w-3xl">
        <div className="border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none transform translate-x-4 -translate-y-4">
             <ShieldAlert className="w-48 h-48 text-rose-500" />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
            <div className="max-w-md">
              <h3 className="text-xl font-bold text-rose-700 dark:text-rose-400">Maintenance Mode</h3>
              <p className="text-sm text-rose-600/80 dark:text-rose-400/80 mt-2">
                Activating maintenance mode will immediately lock out all public users and display a maintenance screen. 
                Active sessions will be terminated. Admins will still have access to the dashboard.
              </p>
            </div>
            
            <button 
               onClick={() => setMaintenanceMode(!maintenanceMode)}
               className={`shrink-0 flex items-center px-6 py-3 font-bold rounded-xl shadow-sm transition-all duration-300 ${maintenanceMode ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-rose-600 text-white hover:bg-rose-700 hover:shadow-rose-600/20 shadow-lg'}`}
            >
              {maintenanceMode ? 'Deactivate Maintenance' : (
                 <><ZapOff className="w-5 h-5 mr-2" /> Activate Lockout</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
