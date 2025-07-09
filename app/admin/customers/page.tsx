"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveTable } from "@/components/ui/responsive-table";
import { 
  Search, 
  Building, 
  Calendar, 
  FileText,
  MoreVertical,
  Eye,
  Clock,
  Ban,
  CheckCircle
} from "lucide-react";

interface Customer {
  id: number;
  name: string;
  access_code: string;
  email: string;
  status: 'active' | 'trial' | 'expired' | 'disabled';
  created_at: string;
  trial_expires_at?: string;
  quote_count: number;
  total_revenue: number;
  last_activity?: string;
}

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const loadCustomers = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/customers');
      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
      }
    } catch (error) {
      console.error('Failed to load customers:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const filterCustomers = useCallback(() => {
    let filtered = customers;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(customer => 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.access_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(customer => customer.status === statusFilter);
    }

    setFilteredCustomers(filtered);
  }, [customers, searchTerm, statusFilter]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  useEffect(() => {
    filterCustomers();
  }, [filterCustomers]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: Customer['status']) => {
    const badges = {
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      trial: { color: 'bg-blue-100 text-blue-800', icon: Clock },
      expired: { color: 'bg-gray-100 text-gray-800', icon: Ban },
      disabled: { color: 'bg-red-100 text-red-800', icon: Ban }
    };

    const badge = badges[status];
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleQuickAction = async (customerId: number, action: string) => {
    // Implement quick actions
    console.log(`Performing ${action} on customer ${customerId}`);
    // TODO: Implement API calls for quick actions
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600 mt-2">Manage your customer accounts</p>
        </div>
        <Card>
          <CardContent className="p-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading customers...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-600 mt-2">Manage your customer accounts</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, email, or access code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="trial">Trial</option>
              <option value="expired">Expired</option>
              <option value="disabled">Disabled</option>
            </select>

            {/* Summary Stats */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>{filteredCustomers.length} customers</span>
              <span className="text-gray-400">•</span>
              <span>{filteredCustomers.filter(c => c.status === 'active').length} active</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer List */}
      <Card>
        <CardContent className="p-0">
          {filteredCustomers.length > 0 ? (
            <ResponsiveTable
              headers={['Company', 'Access Code', 'Status', 'Quotes', 'Revenue', 'Joined', '']}
              rows={filteredCustomers.map((customer, customerIndex) => [
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Building className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{customer.name}</div>
                    <div className="text-sm text-gray-500">{customer.email}</div>
                  </div>
                </div>,
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                  {customer.access_code}
                </code>,
                getStatusBadge(customer.status),
                <div className="flex items-center gap-1">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span>{customer.quote_count}</span>
                </div>,
                <span className="font-medium">
                  {formatCurrency(customer.total_revenue)}
                </span>,
                <span className="text-sm text-gray-500">
                  {formatDate(customer.created_at)}
                </span>,
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/admin/customers/${customer.id}`);
                    }}
                    className="p-1 hover:bg-gray-100 rounded"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: Implement actions menu
                    }}
                    className="p-1 hover:bg-gray-100 rounded"
                    title="More Actions"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              ])}
              tableClassName="bg-white"
              headerClassName="bg-gray-50 border-b"
              cellClassName="text-left px-6 py-4"
              mobileCardRenderer={(row, index) => {
                const customer = filteredCustomers[index];
                return (
                  <div 
                    key={customer.id}
                    className="bg-white p-6 border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                    onClick={() => router.push(`/admin/customers/${customer.id}`)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Building className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{customer.name}</div>
                          <div className="text-sm text-gray-500">{customer.email}</div>
                        </div>
                      </div>
                      {getStatusBadge(customer.status)}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Access Code</p>
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {customer.access_code}
                        </code>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Quotes</p>
                        <div className="flex items-center gap-1">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span>{customer.quote_count}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Revenue</p>
                        <span className="font-medium">
                          {formatCurrency(customer.total_revenue)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Joined</p>
                        <span className="text-sm">
                          {formatDate(customer.created_at)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/admin/customers/${customer.id}`);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Implement actions menu
                        }}
                        className="p-2 hover:bg-gray-100 rounded"
                        title="More Actions"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                );
              }}
            />
          ) : (
            <div className="text-center py-12">
              <Building className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No customers found</p>
              <p className="text-sm text-gray-400 mt-1">
                {searchTerm || statusFilter !== "all" 
                  ? "Try adjusting your filters" 
                  : "Your first customer will appear here"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}