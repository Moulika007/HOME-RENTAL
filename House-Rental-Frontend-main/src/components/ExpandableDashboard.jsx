import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Home } from 'lucide-react';
import { LoadingSpinner, ProgressBar } from './Loading';

const ExpandableDashboard = ({ houses, loading }) => {
  const [expandedType, setExpandedType] = useState(null);
  const [showAll, setShowAll] = useState({});

  const groupByType = () => {
    const grouped = {};
    houses.forEach(house => {
      const type = house.propertyType || 'Other';
      if (!grouped[type]) grouped[type] = [];
      grouped[type].push(house);
    });
    return grouped;
  };

  const grouped = groupByType();
  const types = Object.keys(grouped);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      {types.map(type => {
        const typeHouses = grouped[type];
        const isExpanded = expandedType === type;
        const displayHouses = showAll[type] ? typeHouses : typeHouses.slice(0, 3);
        const occupiedCount = typeHouses.filter(h => h.isBooked).length;
        const occupancyRate = (occupiedCount / typeHouses.length) * 100;

        return (
          <div key={type} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border dark:border-slate-700">
            <button
              onClick={() => setExpandedType(isExpanded ? null : type)}
              className="w-full p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-slate-700 transition"
            >
              <div className="flex items-center gap-3">
                <Home size={20} className="text-violet-600" />
                <span className="font-bold text-lg dark:text-white">{type}</span>
                <span className="bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-300 px-3 py-1 rounded-full text-sm">
                  {typeHouses.length}
                </span>
              </div>
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {isExpanded && (
              <div className="p-4 border-t dark:border-slate-700">
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="dark:text-slate-300">Occupancy Rate</span>
                    <span className="font-bold dark:text-white">{occupancyRate.toFixed(0)}%</span>
                  </div>
                  <ProgressBar progress={occupancyRate} />
                </div>

                <div className="grid gap-3">
                  {displayHouses.map(house => (
                    <div key={house._id} className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold dark:text-white">{house.title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{house.location}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${house.isBooked ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' : house.requests?.length > 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 animate-pulse' : 'bg-slate-100 text-slate-500 dark:bg-slate-600 dark:text-slate-300'}`}>
                        {house.isBooked ? 'Occupied' : house.requests?.length > 0 ? `📩 ${house.requests.length} Request${house.requests.length > 1 ? 's' : ''}` : 'Vacant'}
                      </span>
                    </div>
                  ))}
                </div>

                {typeHouses.length > 3 && (
                  <button
                    onClick={() => setShowAll({ ...showAll, [type]: !showAll[type] })}
                    className="mt-3 text-violet-600 dark:text-violet-400 text-sm font-bold hover:underline"
                  >
                    {showAll[type] ? 'Show Less' : `Show ${typeHouses.length - 3} More`}
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ExpandableDashboard;
