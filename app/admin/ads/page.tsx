'use client';
import { useEffect, useState, useRef } from 'react';
import FilterTabs, { TimeRange } from '@/app/admin/components/FilterTabs';
import { fetchAdPerformance, aggregateWithin, getCustomAdConfig, saveCustomAdConfig, CustomAdConfig, storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

type AdStat = {
  slotId: string;
  name: string;
  impressions: number;
};

const rangeToMs = (range: TimeRange) => {
  switch (range) {
    case '24h': return 24 * 60 * 60 * 1000;
    case '7d':  return 7 * 24 * 60 * 60 * 1000;
    case '30d': return 30 * 24 * 60 * 60 * 1000;
    case '3m':  return 90 * 24 * 60 * 60 * 1000;
  }
};

const AD_SLOTS = [
  { id: '85ed548f0bf183422998f8047970a2a4', name: 'Desktop Top (728x90)' },
  { id: 'ca152145b204618e473e042be63e3d3f', name: 'Sidebar 1 (300x250)' },
  { id: '659f8c8577a79eebec41bc223cf58238', name: 'Sidebar 2 (300x250)' },
  { id: 'ca0f9b6cdfb1c50e263ab26bb94c1f93', name: 'Mobile Sticky (320x50)' },
];

export default function AdsDashboardPage() {
  const [activeRange, setActiveRange] = useState<TimeRange>('24h');
  const [stats, setStats] = useState<AdStat[]>([]);
  const [loading, setLoading] = useState(true);

  // Custom Ad State
  const [customAdConfig, setCustomAdConfig] = useState<CustomAdConfig>({ imageUrl: '', targetUrl: '', isActive: false });
  const [isSaving, setIsSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [adRecords, config] = await Promise.all([
          fetchAdPerformance(),
          getCustomAdConfig()
        ]);
        
        if (config) {
          setCustomAdConfig(config);
        }

        const ms = rangeToMs(activeRange);

        const newStats: AdStat[] = AD_SLOTS.map((slot) => {
          const impressionsMap = (adRecords[slot.id]?.impressions ?? {}) as unknown as Record<string, number>;

          return {
            slotId: slot.id,
            name: slot.name,
            impressions: aggregateWithin(impressionsMap, ms),
          };
        }).sort((a, b) => b.impressions - a.impressions);

        setStats(newStats);
      } catch (err) {
        console.error("Failed to fetch ad performance stats:", err);
      }
      setLoading(false);
    }
    load();
  }, [activeRange]);

  const totalImpressions = stats.reduce((sum, s) => sum + s.impressions, 0);

  const handleSaveConfig = async () => {
    setIsSaving(true);
    try {
      await saveCustomAdConfig(customAdConfig);
      alert('Custom ad settings saved successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const storageRef = ref(storage, `customAds/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Upload failed", error);
        alert('Upload failed: ' + error.message);
        setUploadProgress(0);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setCustomAdConfig(prev => ({ ...prev, imageUrl: downloadURL }));
        setUploadProgress(0);
      }
    );
  };

  return (
    <section className="max-w-6xl mx-auto space-y-12">
      {/* Existing Adsterra Performance Section */}
      <div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">📊 Ad Performance</h1>
            <p className="text-sm text-gray-500 mt-1">Track which ad placements are performing best</p>
          </div>
          <FilterTabs active={activeRange} setActive={setActiveRange} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Impressions</h3>
            <p className="text-3xl font-bold text-gray-900">
              {loading ? '-' : totalImpressions.toLocaleString()}
            </p>
            <p className="text-xs text-gray-400 mt-2">Across all active ad slots</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Top Performing Ad</h3>
            <p className="text-xl font-bold text-[#414FA8] truncate">
              {loading ? '-' : (stats[0]?.impressions > 0 ? stats[0].name : 'N/A')}
            </p>
            <p className="text-xs text-gray-400 mt-2">Highest impression count</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Active Slots</h3>
            <p className="text-3xl font-bold text-gray-900">
              {AD_SLOTS.length}
            </p>
            <p className="text-xs text-gray-400 mt-2">Currently being tracked</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          {loading ? (
            <div className="p-12 text-center text-gray-500 font-medium">
              Loading ad statistics...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead className="bg-[#EEF1FB] border-b border-gray-200">
                  <tr>
                    <th className="p-4 text-xs font-bold text-[#414FA8] uppercase">Ad Placement</th>
                    <th className="p-4 text-xs font-bold text-[#414FA8] uppercase">Slot ID</th>
                    <th className="p-4 text-xs font-bold text-[#414FA8] uppercase text-right">Impressions</th>
                    <th className="p-4 text-xs font-bold text-[#414FA8] uppercase text-right">% of Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {stats.map((s) => {
                    const percentage = totalImpressions > 0 
                      ? ((s.impressions / totalImpressions) * 100).toFixed(1) + '%' 
                      : '0%';
                      
                    return (
                      <tr key={s.slotId} className="hover:bg-gray-50 transition-colors group">
                        <td className="p-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                          {s.name}
                        </td>
                        <td className="p-4 text-sm text-gray-500 font-mono text-xs">
                          {s.slotId}
                        </td>
                        <td className="p-4 text-sm text-gray-600 font-semibold text-right whitespace-nowrap">
                          {s.impressions.toLocaleString()}
                        </td>
                        <td className="p-4 text-sm text-gray-500 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <span className="w-12 text-right">{percentage}</span>
                            <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-[#414FA8] rounded-full" 
                                style={{ width: percentage }}
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Custom Ad Configuration Section */}
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">🖼️ Custom Homepage Ad</h2>
          <p className="text-sm text-gray-500 mt-1">Upload an image and set a link to replace the Popular Tools section</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="space-y-6">
            
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ad Image</label>
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-center w-full">
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                        </svg>
                        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-gray-500">PNG, JPG or WEBP (Max: 5MB)</p>
                      </div>
                      <input 
                        ref={fileInputRef}
                        id="dropzone-file" 
                        type="file" 
                        accept="image/*"
                        className="hidden" 
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                      <div className="bg-[#414FA8] h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                  )}
                </div>
                {customAdConfig.imageUrl && (
                  <div className="w-48 h-32 relative rounded-lg overflow-hidden border border-gray-200 shadow-sm flex-shrink-0 bg-gray-100 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={customAdConfig.imageUrl} alt="Ad Preview" className="max-w-full max-h-full object-contain" />
                  </div>
                )}
              </div>
              {customAdConfig.imageUrl && (
                <div className="mt-2 text-xs text-gray-500 break-all">
                  <strong>Current Image URL:</strong> {customAdConfig.imageUrl}
                </div>
              )}
            </div>

            {/* Target URL */}
            <div>
              <label htmlFor="targetUrl" className="block text-sm font-medium text-gray-700 mb-1">Target Link (Optional)</label>
              <input
                type="url"
                id="targetUrl"
                value={customAdConfig.targetUrl}
                onChange={(e) => setCustomAdConfig(prev => ({ ...prev, targetUrl: e.target.value }))}
                placeholder="https://example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#414FA8] focus:border-[#414FA8] sm:text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">Where should users go when they click the ad?</p>
            </div>

            {/* Is Active Toggle */}
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={customAdConfig.isActive}
                  onChange={(e) => setCustomAdConfig(prev => ({ ...prev, isActive: e.target.checked }))}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#EEF1FB] rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#414FA8]"></div>
                <span className="ms-3 text-sm font-medium text-gray-700">Enable Custom Ad</span>
              </label>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={handleSaveConfig}
                disabled={isSaving}
                className="px-6 py-2.5 bg-[#414FA8] text-white font-medium rounded-lg hover:bg-[#34408a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save Ad Settings'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
