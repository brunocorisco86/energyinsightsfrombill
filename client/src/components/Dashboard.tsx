import { BillData } from '@/lib/pdfParser';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Zap, TrendingDown, Percent, DollarSign } from 'lucide-react';

interface DashboardProps {
  bills: BillData[];
}

export default function Dashboard({ bills }: DashboardProps) {
  // Utility for chronological sorting
  function monthKey(m: string, y: string): number {
    return parseInt(y ?? "0") * 100 + parseInt(m ?? "0");
  }

  // Integrity filter: UC must be exactly 9 digits and have some data
  function isValidInvoice(inv: BillData): boolean {
    if (!/^\d{9}$/.test(inv.consumptionUnit ?? "")) return false;
    return (
      (inv.activeConsumptionKwh ?? 0) > 0 ||
      (inv.injectedEnergyKwh    ?? 0) > 0 ||
      (inv.creditBalanceKwh     ?? 0) > 0 ||
      (inv.totalValue           ?? 0) > 0
    );
  }

  const validBills = bills.filter(isValidInvoice);

  if (validBills.length === 0) {
    return null;
  }

  // Sort bills by month/year using monthKey
  const sortedBills = [...validBills].sort((a, b) => {
    return monthKey(a.month, a.year) - monthKey(b.month, b.year);
  });

  // Latest bill for alerts and current stats
  const latestBill = sortedBills[sortedBills.length - 1];

  // Calculate statistics
  const totalConsumo = validBills.reduce((sum, bill) => sum + bill.activeConsumptionKwh, 0);
  const totalGeracao = validBills.reduce((sum, bill) => sum + bill.injectedEnergyKwh, 0);
  const totalCreditos = latestBill.creditBalanceKwh; // Current balance is the latest
  const avgAutoconsumo = validBills.length > 0
    ? validBills.reduce((sum, bill) => sum + (bill.autoconsumo || 0), 0) / validBills.length
    : 0;
  const totalGasto = validBills.reduce((sum, bill) => sum + bill.totalValue, 0);

  // Burn Rate calculation
  let burnRate = null;
  if (sortedBills.length >= 2) {
    const curr = sortedBills[sortedBills.length - 1];
    const prev = sortedBills[sortedBills.length - 2];
    const delta = prev.creditBalanceKwh - curr.creditBalanceKwh;
    if (delta > 0 && curr.creditBalanceKwh > 0) {
      burnRate = Math.floor(curr.creditBalanceKwh / delta);
    }
  }

  // Prepare chart data
  const chartData = sortedBills.map(bill => ({
    month: `${bill.month}/${bill.year.slice(-2)}`,
    consumo: bill.activeConsumptionKwh,
    geracao: bill.injectedEnergyKwh,
    creditos: bill.creditBalanceKwh,
    autoconsumo: parseFloat((bill.autoconsumo || 0).toFixed(1)),
    total: bill.totalValue,
  }));

  // Autoconsumo pie chart data
  const autoconsumoData = [
    { name: 'Autoconsumo', value: avgAutoconsumo },
    { name: 'Injetado', value: 100 - avgAutoconsumo },
  ];

  const COLORS = ['#3b82f6', '#e5e7eb'];

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard de Análise</h2>
        <div className="text-sm text-gray-500">
          UC: {latestBill.consumptionUnit} | Titular: {latestBill.clientName}
        </div>
      </div>

      {latestBill.irrigatorSubsidyCanceled && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-sm" role="alert">
          <p className="font-bold">⚠️ ALERTA: Subsídio Irrigante/Aquicultor cancelado</p>
          <p className="text-sm">A Copel sinalizou o cancelamento do subsídio nesta unidade consumidora. Verifique os dados cadastrais.</p>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Consumo Total</p>
              <p className="text-2xl font-bold text-gray-900">{totalConsumo.toFixed(0)} kWh</p>
            </div>
            <Zap className="h-8 w-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Geração Solar</p>
              <p className="text-2xl font-bold text-gray-900">{totalGeracao.toFixed(0)} kWh</p>
            </div>
            <Zap className="h-8 w-8 text-yellow-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Créditos Solares</p>
              <p className="text-2xl font-bold text-gray-900">{totalCreditos.toFixed(0)} kWh</p>
              {burnRate !== null && (
                <p className="text-xs text-amber-600 font-medium mt-1">
                  Estima de folga: {burnRate} {burnRate === 1 ? 'mês' : 'meses'}
                </p>
              )}
            </div>
            <TrendingDown className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Gasto Total</p>
              <p className="text-2xl font-bold text-gray-900">R$ {totalGasto.toFixed(2)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-red-500" />
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Consumption vs Generation */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Consumo vs Geração</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="consumo" fill="#ef4444" name="Consumo (kWh)" />
              <Bar dataKey="geracao" fill="#eab308" name="Geração (kWh)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Autoconsumo Pie Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Autoconsumo Médio</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={autoconsumoData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => `${typeof value === 'number' ? value.toFixed(1) : value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Burn Rate (Créditos) */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Evolução de Créditos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="creditos" stroke="#10b981" name="Créditos (kWh)" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Total Fatura */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Valor das Faturas</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: any) => `R$ ${typeof value === 'number' ? value.toFixed(2) : value}`} />
              <Bar dataKey="total" fill="#8b5cf6" name="Total (R$)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Detailed Table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalhes das Faturas</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Período</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Consumo (kWh)</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Geração (kWh)</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Créditos (kWh)</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Autoconsumo %</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Total (R$)</th>
              </tr>
            </thead>
            <tbody>
              {sortedBills.map((bill, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900">{bill.referenceMonth}</td>
                  <td className="text-right py-3 px-4 text-gray-700">{bill.activeConsumptionKwh.toFixed(0)}</td>
                  <td className="text-right py-3 px-4 text-gray-700">{bill.injectedEnergyKwh.toFixed(0)}</td>
                  <td className="text-right py-3 px-4 text-gray-700">{bill.creditBalanceKwh.toFixed(0)}</td>
                  <td className="text-right py-3 px-4 text-gray-700">{(bill.autoconsumo || 0).toFixed(1)}%</td>
                  <td className="text-right py-3 px-4 text-gray-900 font-semibold">R$ {bill.totalValue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
