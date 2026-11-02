'use client'

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface ChartsProps {
  estadoData: { name: string; value: number; color: string }[]
  turnoData: { name: string; tareas: number }[]
}

export default function DashboardCharts({ estadoData, turnoData }: ChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Torta: Estado de Tareas */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Estado de las Tareas</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={estadoData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name, value, percent }: any) => 
                  value > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : null
                }
              >
                {estadoData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(30, 41, 59, 0.95)', 
                  color: '#f8fafc', 
                  borderRadius: '8px', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
                }}
              />
              <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: '#94a3b8', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico de Barras: Tareas por Turno */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Tareas por Turno</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={turnoData}>
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
              <Tooltip 
                cursor={{ fill: 'rgba(148, 163, 184, 0.2)' }}
                contentStyle={{ 
                  backgroundColor: 'rgba(30, 41, 59, 0.95)', 
                  color: '#f8fafc', 
                  borderRadius: '8px', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
                }}
              />
              <Bar dataKey="tareas" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}