"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Konfigurasi Kategori ---
const ROOT_CONFIG = {
    electricity_co2e: { name: 'Listrik', color: '#FBBF24', drillable: false },
    non_electricity_co2e: { name: 'Energi Non-Listrik', color: '#F97316', drillable: true },
    transport_co2e: { name: 'Transportasi', color: '#60A5FA', drillable: true },
    waste_co2e: { name: 'Limbah', color: '#F87171', drillable: true },
};

// --- Konfigurasi Detail ---
const NON_ELECTRICITY_DETAIL_CONFIG = {
    diesel_mineral: { name: 'Diesel (Mineral)', color: '#FB923C' },
    diesel_biofuel: { name: 'Diesel (Biofuel)', color: '#FDBA74' },
    fuel_oil: { name: 'Fuel Oil', color: '#FED7AA' },
    lpg: { name: 'LPG', color: '#FB923C' },
    natural_gas: { name: 'Natural Gas', color: '#FDBA74' },
    cng: { name: 'CNG', color: '#FED7AA' },
    lng: { name: 'LNG', color: '#FB923C' },
    propane: { name: 'Propane', color: '#FDBA74' }
};
const TRANSPORT_DETAIL_CONFIG = {
    petrol: { name: 'Mobil Bensin', color: '#3B82F6' },
    diesel: { name: 'Mobil Diesel', color: '#60A5FA' },
    motorcycle: { name: 'Motor', color: '#93C5FD' },
};
const WASTE_DETAIL_CONFIG = {
    food_waste: { name: 'Makanan', color: '#EF4444' },
    plastic: { name: 'Plastik', color: '#F87171' },
    paper_cardboard: { name: 'Kertas', color: '#FCA5A5' },
    garden_waste: { name: 'Taman', color: '#FECACA'},
    metal: { name: 'Logam', color: '#EF4444' },
    glass: { name: 'Kaca', color: '#F87171' },
    electronics: { name: 'Elektronik', color: '#FCA5A5' },
    fabric: { name: 'Kain', color: '#FECACA' },
};
const GREY_COLOR = '#E5E7EB';

// --- PERBAIKAN: Tambahkan variabel yang hilang ---
const TRANSPORT_EMISSION_FACTORS = {
    diesel: 0.00016984, petrol: 0.0001645, motorcycle: 0.00011367
};

// Komponen PieSlice (Tidak Berubah)
const PieSlice = ({ item, radius, startAngle, endAngle }) => {
    const getArcPath = (r, start, end) => {
        const startPoint = { x: 100 + r * Math.cos(start), y: 100 + r * Math.sin(start) };
        const endPoint = { x: 100 + r * Math.cos(end), y: 100 + r * Math.sin(end) };
        const largeArcFlag = end - start < Math.PI ? "0" : "1";
        if (end - start >= 2 * Math.PI - 0.001) {
            end -= 0.001;
            endPoint.x = 100 + r * Math.cos(end);
            endPoint.y = 100 + r * Math.sin(end);
        }
        return `M ${startPoint.x} ${startPoint.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${endPoint.x} ${endPoint.y}`;
    };
    const springTransition = { type: "spring", stiffness: 200, damping: 25 };
    return (
        <motion.path d={getArcPath(radius, startAngle, endAngle)} fill="none" stroke={item.color} strokeWidth="30" initial={{ opacity: 0, pathLength: 0 }} animate={{ opacity: 1, pathLength: 1 }} exit={{ opacity: 0, pathLength: 0 }} transition={{ ...springTransition, duration: 0.5 }}>
            <title>{`${item.name}: ${item.value.toFixed(2)}%`}</title>
        </motion.path>
    );
};

export default function DashboardPieChart({ supabase, user, dataVersion }) {
    const [allData, setAllData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [chartView, setChartView] = useState({ level: 'root', title: 'Distribusi Emisi Keseluruhan' });

    useEffect(() => {
        const processData = (entries) => {
            const rootTotals = { electricity_co2e: 0, non_electricity_co2e: 0, transport_co2e: 0, waste_co2e: 0 };
            const nonElectricDetails = {};
            const transportDetails = {};
            const wasteDetails = {};

            entries.forEach(entry => {
                rootTotals.electricity_co2e += entry.electricity_co2e || 0;
                rootTotals.non_electricity_co2e += entry.non_electricity_co2e || 0;
                rootTotals.transport_co2e += entry.transport_co2e || 0;
                rootTotals.waste_co2e += entry.waste_co2e || 0;

                if (entry.non_electricity_details?.items) {
                    entry.non_electricity_details.items.forEach(item => {
                        if (!nonElectricDetails[item.type]) nonElectricDetails[item.type] = 0;
                        nonElectricDetails[item.type] += item.emission || 0;
                    });
                }
                
                if (entry.transport_details) {
                    entry.transport_details.forEach(v => {
                        const emission = ((parseFloat(v.km) || 0) * (TRANSPORT_EMISSION_FACTORS[v.type] || 0) * (parseFloat(v.frequency) || 0));
                        if (!transportDetails[v.type]) transportDetails[v.type] = 0;
                        transportDetails[v.type] += emission;
                    });
                }
                
                if (entry.waste_details?.items) {
                    entry.waste_details.items.forEach(item => {
                        if (!wasteDetails[item.type]) wasteDetails[item.type] = 0;
                        wasteDetails[item.type] += item.emission || 0;
                    });
                }
            });
            
            setAllData({ root: rootTotals, non_electricity: nonElectricDetails, transport: transportDetails, waste: wasteDetails });
        };
        
        const fetchAllData = async () => {
            if (!user) return; setLoading(true);
            try {
                const { data, error: dbError } = await supabase.from('carbon_entries').select('*').eq('user_id', user.id);
                if (dbError) throw dbError;
                processData(data);
            } catch (err) {
                setError(`Gagal memuat data grafik: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [user, supabase, dataVersion]);

    const getChartData = () => {
        if (!allData) return [];
        
        const levelKey = chartView.level.replace('_co2e', '');
        const sourceData = allData[levelKey];
        if (!sourceData) return [];

        const configs = { root: ROOT_CONFIG, non_electricity: NON_ELECTRICITY_DETAIL_CONFIG, transport: TRANSPORT_DETAIL_CONFIG, waste: WASTE_DETAIL_CONFIG };
        const config = configs[levelKey];
        
        const total = Object.values(sourceData).reduce((sum, val) => sum + val, 0);
        
        if (total === 0) {
            return [{ key: 'empty', name: "Tidak Ada Data", value: 100, color: GREY_COLOR, drillable: false }];
        }
        
        return Object.entries(sourceData).map(([key, value]) => ({
            key,
            name: config[key]?.name || key,
            value: (value / total) * 100,
            color: config[key]?.color,
            drillable: ROOT_CONFIG[key]?.drillable,
        })).filter(item => item.value > 0).sort((a,b) => b.value - a.value);
    };

    const currentChartData = getChartData();
    let accumulatedAngle = -Math.PI / 2;

    if (loading) return <div className="h-80 w-full bg-slate-200 rounded-xl animate-pulse"></div>;
    if (error) return <div className="text-center p-4 text-red-500 bg-red-50 rounded-lg">{error}</div>;

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between mb-4 min-h-[28px]">
                <AnimatePresence mode="wait">
                    <motion.h3 
                        key={chartView.title}
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.3 }}
                        className="text-xl font-bold"
                    >
                        {chartView.title}
                    </motion.h3>
                </AnimatePresence>
                {chartView.level !== 'root' && (
                    <button onClick={() => setChartView({ level: 'root', title: 'Distribusi Emisi Keseluruhan' })} className="text-sm font-semibold text-blue-600 hover:underline">
                        &larr; Kembali
                    </button>
                )}
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                <div className="relative w-48 h-48">
                    <svg viewBox="0 0 200 200">
                        <AnimatePresence>
                            {currentChartData.map((item) => {
                                const angle = (item.value / 100) * 2 * Math.PI;
                                const startAngle = accumulatedAngle;
                                accumulatedAngle += angle;
                                return <PieSlice key={item.key} item={item} radius={85} startAngle={startAngle} endAngle={startAngle + angle} />;
                            })}
                        </AnimatePresence>
                    </svg>
                </div>
                <div className="flex flex-col gap-4">
                    <AnimatePresence>
                        {currentChartData.map(item => (
                             <motion.button 
                                key={item.key}
                                onClick={item.drillable ? () => setChartView({ level: item.key.replace('_co2e', ''), title: `Rincian Emisi ${item.name}` }) : undefined}
                                disabled={!item.drillable}
                                className={`flex items-center gap-3 p-1 rounded-md transition-colors duration-200 ${item.drillable ? 'cursor-pointer hover:bg-slate-100' : 'cursor-default'}`}
                                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
                            >
                                 <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }}></div>
                                 <div>
                                     <span className="font-semibold text-slate-700">{item.name}</span>
                                     <span className="ml-2 text-slate-500">{item.value.toFixed(1)}%</span>
                                 </div>
                             </motion.button>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}