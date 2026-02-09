import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { formatDate } from '../../lib/utils';
import { Search, FileText, ChevronRight, Plus } from 'lucide-react';

export interface Order {
  id: string;
  name: string;
  code: string;
  customer: string;
  date: Date;
  status: 'new' | 'in_progress' | 'completed';
}

interface OrdersProps {
  onSelectOrder: (order: Order) => void;
  onCreateOrder: () => void;
}

const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    name: 'Pelhřimov SPŠ a SOU Křemešnická',
    code: '088N',
    customer: 'Stavební firma s.r.o.',
    date: new Date('2026-02-09'),
    status: 'in_progress',
  },
  {
    id: '2',
    name: 'Bytový dům Praha 5',
    code: '089N',
    customer: 'Development Group',
    date: new Date('2026-02-08'),
    status: 'new',
  },
  {
    id: '3',
    name: 'Rekonstrukce kanceláří Brno',
    code: '085N',
    customer: 'Office Parks a.s.',
    date: new Date('2026-01-25'),
    status: 'completed',
  },
];

export function Orders({ onSelectOrder, onCreateOrder }: OrdersProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = MOCK_ORDERS.filter(
    (order) =>
      order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500 mt-1">Manage and track pricing orders</p>
        </div>
        <Button onClick={onCreateOrder}>
          <Plus className="mr-2 h-4 w-4" />
          New Order
        </Button>
      </div>

      <Card className="overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 bg-gray-50/50">
          <div className="relative max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search orders..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-[#0072BC] focus:ring-1 focus:ring-[#0072BC] sm:text-sm transition duration-150 ease-in-out"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {filteredOrders.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr 
                    key={order.id} 
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => onSelectOrder(order)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-blue-50 rounded-lg text-[#0072BC]">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{order.name}</div>
                          <div className="text-sm text-gray-500">#{order.code}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.customer}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDate(order.date)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant={
                          order.status === 'completed'
                            ? 'success'
                            : order.status === 'in_progress'
                            ? 'warning'
                            : 'secondary'
                        }
                      >
                        {order.status === 'in_progress' ? 'In Progress' : order.status === 'new' ? 'New' : 'Completed'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <ChevronRight className="h-5 w-5 text-gray-400 inline-block" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new order.
              </p>
              <div className="mt-6">
                <Button onClick={onCreateOrder}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Order
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
