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
      <div>
        <div>
          <h1>Access Code Management</h1>
          <p>Manage customer access codes and company accounts</p>
        </div>
        
        <div>
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent>
                <div></div>
                <div></div>
                <div></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div>
        <div>
          <h1>Access Code Management</h1>
          <p>
            Manage customer access codes and company accounts ({accessCodes.length} total)
          </p>
        </div>
        
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus />
          Create Access Code
        </Button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              <Key />
              Create New Access Code
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateAccessCode}>
              <div>
                <div>
                  <Label htmlFor="accessCode">Access Code *</Label>
                  <Input
                    id="accessCode"
                    value={newCode.accessCode}
                    onChange={(e) => setNewCode({...newCode, accessCode: e.target.value.toUpperCase()})}
                    placeholder="e.g., PAINTER2024"
                   
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
              
              <div>
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
      <div>
        {accessCodes.length === 0 ? (
          <Card>
            <CardContent>
              <Key />
              <h3>No Access Codes</h3>
              <p>Create your first access code to get started</p>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus />
                Create Access Code
              </Button>
            </CardContent>
          </Card>
        ) : (
          accessCodes.map((code) => (
            <Card key={code.id}>
              <CardContent>
                <div>
                  <div>
                    <div>
                      <div>
                        {code.access_code}
                      </div>
                      <div>
                        <h3>{code.company_name}</h3>
                        <p>
                          Created {formatDate(code.created_at)}
                        </p>
                      </div>
                    </div>
                    
                    {(code.phone || code.email) && (
                      <div>
                        {code.phone && <div>📞 {code.phone}</div>}
                        {code.email && <div>📧 {code.email}</div>}
                      </div>
                    )}
                    
                    <div>
                      <div>
                        <FileText />
                        <span>{code.quote_count} quotes</span>
                      </div>
                      <div>
                        <DollarSign />
                        <span>{formatCurrency(code.total_revenue)}</span>
                      </div>
                      <div>
                        <Users />
                        <span>{code.pending_quotes} pending</span>
                      </div>
                      <div>
                        <Calendar />
                        <span>{formatDate(code.last_quote_date)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteAccessCode(code.id, code.access_code, code.company_name)}
                     
                    >
                      <Trash2 />
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