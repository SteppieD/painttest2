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
      <span`}>
        <Icon />
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
      <div>
        <div>
          <h1>Customers</h1>
          <p>Manage your customer accounts</p>
        </div>
        <Card>
          <CardContent>
            <div></div>
            <p>Loading customers...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div>
        <h1>Customers</h1>
        <p>Manage your customer accounts</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent>
          <div>
            {/* Search */}
            <div>
              <div>
                <Search />
                <input
                  type="text"
                  placeholder="Search by name, email, or access code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                 
                />
              </div>
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
             
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="trial">Trial</option>
              <option value="expired">Expired</option>
              <option value="disabled">Disabled</option>
            </select>

            {/* Summary Stats */}
            <div>
              <span>{filteredCustomers.length} customers</span>
              <span>•</span>
              <span>{filteredCustomers.filter(c => c.status === 'active').length} active</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer List */}
      <Card>
        <CardContent>
          {filteredCustomers.length > 0 ? (
            <ResponsiveTable
              headers={['Company', 'Access Code', 'Status', 'Quotes', 'Revenue', 'Joined', '']}
              rows={filteredCustomers.map((customer, customerIndex) => [
                <div>
                  <div>
                    <Building />
                  </div>
                  <div>
                    <div>{customer.name}</div>
                    <div>{customer.email}</div>
                  </div>
                </div>,
                <code>
                  {customer.access_code}
                </code>,
                getStatusBadge(customer.status),
                <div>
                  <FileText />
                  <span>{customer.quote_count}</span>
                </div>,
                <span>
                  {formatCurrency(customer.total_revenue)}
                </span>,
                <span>
                  {formatDate(customer.created_at)}
                </span>,
                <div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/admin/customers/${customer.id}`);
                    }}
                   
                    title="View Details"
                  >
                    <Eye />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: Implement actions menu
                    }}
                   
                    title="More Actions"
                  >
                    <MoreVertical />
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
                   
                    onClick={() => router.push(`/admin/customers/${customer.id}`)}
                  >
                    <div>
                      <div>
                        <div>
                          <Building />
                        </div>
                        <div>
                          <div>{customer.name}</div>
                          <div>{customer.email}</div>
                        </div>
                      </div>
                      {getStatusBadge(customer.status)}
                    </div>
                    
                    <div>
                      <div>
                        <p>Access Code</p>
                        <code>
                          {customer.access_code}
                        </code>
                      </div>
                      <div>
                        <p>Quotes</p>
                        <div>
                          <FileText />
                          <span>{customer.quote_count}</span>
                        </div>
                      </div>
                      <div>
                        <p>Revenue</p>
                        <span>
                          {formatCurrency(customer.total_revenue)}
                        </span>
                      </div>
                      <div>
                        <p>Joined</p>
                        <span>
                          {formatDate(customer.created_at)}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/admin/customers/${customer.id}`);
                        }}
                       
                      >
                        <Eye />
                        View Details
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Implement actions menu
                        }}
                       
                        title="More Actions"
                      >
                        <MoreVertical />
                      </button>
                    </div>
                  </div>
                );
              }}
            />
          ) : (
            <div>
              <Building />
              <p>No customers found</p>
              <p>
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