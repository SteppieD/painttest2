"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Key, 
  Plus, 
  Trash2, 
  Users, 
  DollarSign,
  FileText,
  Calendar,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface AccessCode {
  id: number;
  access_code: string;
  company_name: string;
  phone?: string;
  email?: string;
  created_at: string;
  quote_count: number;
  total_revenue: number;
  last_quote_date?: string;
  pending_quotes: number;
  accepted_quotes: number;
}

export default function AccessCodesPage() {
  const { toast } = useToast();
  const [accessCodes, setAccessCodes] = useState<AccessCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCode, setNewCode] = useState({
    accessCode: '',
    companyName: '',
    phone: '',
    email: ''
  });

  const loadAccessCodes = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/access-codes');
      const data = await response.json();
      
      if (response.ok) {
        setAccessCodes(data.companies || []);
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to load access codes",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error loading access codes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadAccessCodes();
  }, [loadAccessCodes]);

  const handleCreateAccessCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCode.accessCode.trim() || !newCode.companyName.trim()) {
      toast({
        title: "Validation Error",
        description: "Access code and company name are required",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsCreating(true);
      const response = await fetch('/api/admin/access-codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCode),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: `Access code ${newCode.accessCode.toUpperCase()} created successfully`,
        });
        setNewCode({ accessCode: '', companyName: '', phone: '', email: '' });
        setShowCreateForm(false);
        loadAccessCodes();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to create access code",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error creating access code",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteAccessCode = async (id: number, accessCode: string, companyName: string) => {
    if (!confirm(`Are you sure you want to delete "${accessCode}" (${companyName})? This will also delete all associated quotes and data.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/access-codes?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Deleted",
          description: `Access code ${accessCode} has been deleted`,
        });
        loadAccessCodes();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to delete access code",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error deleting access code",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Access Code Management</h1>
          <p className="text-gray-600 mt-2">Manage customer access codes and company accounts</p>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Access Code Management</h1>
          <p className="text-gray-600 mt-2">
            Manage customer access codes and company accounts ({accessCodes.length} total)
          </p>
        </div>
        
        <Button onClick={() => setShowCreateForm(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Create Access Code
        </Button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              Create New Access Code
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateAccessCode} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="accessCode">Access Code *</Label>
                  <Input
                    id="accessCode"
                    value={newCode.accessCode}
                    onChange={(e) => setNewCode({...newCode, accessCode: e.target.value.toUpperCase()})}
                    placeholder="e.g., PAINTER2024"
                    className="uppercase"
                    disabled={isCreating}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    value={newCode.companyName}
                    onChange={(e) => setNewCode({...newCode, companyName: e.target.value})}
                    placeholder="e.g., Elite Painting LLC"
                    disabled={isCreating}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone (Optional)</Label>
                  <Input
                    id="phone"
                    value={newCode.phone}
                    onChange={(e) => setNewCode({...newCode, phone: e.target.value})}
                    placeholder="(555) 123-4567"
                    disabled={isCreating}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email (Optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newCode.email}
                    onChange={(e) => setNewCode({...newCode, email: e.target.value})}
                    placeholder="contact@company.com"
                    disabled={isCreating}
                  />
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? 'Creating...' : 'Create Access Code'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowCreateForm(false)}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Access Codes List */}
      <div className="grid grid-cols-1 gap-4">
        {accessCodes.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Key className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Access Codes</h3>
              <p className="text-gray-600 mb-4">Create your first access code to get started</p>
              <Button onClick={() => setShowCreateForm(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Create Access Code
              </Button>
            </CardContent>
          </Card>
        ) : (
          accessCodes.map((code) => (
            <Card key={code.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="font-mono text-lg font-bold bg-blue-100 text-blue-800 px-3 py-1 rounded">
                        {code.access_code}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{code.company_name}</h3>
                        <p className="text-sm text-gray-500">
                          Created {formatDate(code.created_at)}
                        </p>
                      </div>
                    </div>
                    
                    {(code.phone || code.email) && (
                      <div className="text-sm text-gray-600 mb-3">
                        {code.phone && <div>📞 {code.phone}</div>}
                        {code.email && <div>📧 {code.email}</div>}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span>{code.quote_count} quotes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        <span>{formatCurrency(code.total_revenue)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-500" />
                        <span>{code.pending_quotes} pending</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-purple-500" />
                        <span>{formatDate(code.last_quote_date)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteAccessCode(code.id, code.access_code, code.company_name)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}