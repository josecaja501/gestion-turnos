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
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Estado de las Tareas</h3>
        <div className="h-72"> {/* Aumentado un poco la altura para que quepa la leyenda */}
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
                // ✅ CORRECCIÓN: Solo muestra la etiqueta si el valor es mayor que 0
                label={({ name, value, percent }: any) => 
                  value > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : null
                }
              >
                {estadoData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              {/* Añadimos una leyenda abajo por si acaso */}
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico de Barras: Tareas por Turno */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Tareas por Turno</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={turnoData}>
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} />
              <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
              <Bar dataKey="tareas" fill="#2563eb" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}