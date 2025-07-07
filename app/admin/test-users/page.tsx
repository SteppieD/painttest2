"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Users, TestTube, Settings, Trash2, Edit, Eye, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export const dynamic = 'force-dynamic';

interface TestUser {
  id: string;
  company_name: string;
  access_code: string;
  test_type: 'demo' | 'qa' | 'support' | 'developer';
  subscription_plan: string;
  quotes_allowed: number;
  quotes_used: number;
  created_at: string;
  expires_at?: string;
  status: 'active' | 'expired' | 'disabled';
  description?: string;
  created_by: string;
  last_used_at?: string;
}

interface TestUserStats {
  total_test_users: number;
  active_test_users: number;
  demo_users: number;
  qa_users: number;
  support_users: number;
  developer_users: number;
  total_test_quotes: number;
}

const TEST_USER_TYPES = [
  {
    id: 'demo',
    name: 'Demo User',
    description: 'For live demonstrations and sales presentations',
    defaultQuotes: 25,
    defaultPlan: 'Professional',
    color: 'bg-blue-100 text-blue-800'
  },
  {
    id: 'qa',
    name: 'QA Testing',
    description: 'For quality assurance and feature testing',
    defaultQuotes: 100,
    defaultPlan: 'Business',
    color: 'bg-green-100 text-green-800'
  },
  {
    id: 'support',
    name: 'Customer Support',
    description: 'For customer support representatives',
    defaultQuotes: 50,
    defaultPlan: 'Professional',
    color: 'bg-purple-100 text-purple-800'
  },
  {
    id: 'developer',
    name: 'Developer',
    description: 'For development and API testing',
    defaultQuotes: 200,
    defaultPlan: 'Business',
    color: 'bg-orange-100 text-orange-800'
  }
];

export default function TestUsersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [testUsers, setTestUsers] = useState<TestUser[]>([]);
  const [stats, setStats] = useState<TestUserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  // Create dialog form state
  const [newTestUser, setNewTestUser] = useState({
    company_name: "",
    access_code: "",
    test_type: "demo" as any,
    quotes_allowed: "25",
    expires_days: "90",
    description: ""
  });

  useEffect(() => {
    loadTestUsers();
    loadStats();
  }, []);

  const loadTestUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/test-users');
      if (response.ok) {
        const data = await response.json();
        setTestUsers(data.testUsers || []);
      }
    } catch (error) {
      console.error('Error loading test users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch('/api/admin/test-users/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const generateTestCode = (type: string) => {
    const prefixes = {
      demo: 'DEMO',
      qa: 'TEST',
      support: 'SUPP',
      developer: 'DEV'
    };
    const prefix = prefixes[type as keyof typeof prefixes] || 'TEST';
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}${timestamp}`;
  };

  const handleTestTypeChange = (type: string) => {
    const testType = TEST_USER_TYPES.find(t => t.id === type);
    if (testType) {
      setNewTestUser({
        ...newTestUser,
        test_type: type as any,
        quotes_allowed: testType.defaultQuotes.toString(),
        access_code: generateTestCode(type)
      });
    }
  };

  const handleCreateTestUser = async () => {
    try {
      if (!newTestUser.company_name.trim()) {
        toast({
          title: "Validation Error",
          description: "Company name is required",
          variant: "destructive",
        });
        return;
      }

      const testUserData = {
        ...newTestUser,
        access_code: newTestUser.access_code || generateTestCode(newTestUser.test_type),
        quotes_allowed: parseInt(newTestUser.quotes_allowed) || 25,
        expires_days: newTestUser.expires_days ? parseInt(newTestUser.expires_days) : null
      };

      const response = await fetch('/api/admin/test-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testUserData)
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Test user "${newTestUser.company_name}" created successfully`,
        });
        setIsCreateDialogOpen(false);
        setNewTestUser({
          company_name: "",
          access_code: "",
          test_type: "demo",
          quotes_allowed: "25",
          expires_days: "90",
          description: ""
        });
        loadTestUsers();
        loadStats();
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to create test user",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error creating test user",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTestUser = async (id: string, companyName: string) => {
    if (!confirm(`Are you sure you want to delete test user "${companyName}"? This will remove all associated quotes and data.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/test-users/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast({
          title: "Deleted",
          description: `Test user "${companyName}" has been deleted`,
        });
        loadTestUsers();
        loadStats();
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to delete test user",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error deleting test user",
        variant: "destructive",
      });
    }
  };

  const resetTestUser = async (id: string, companyName: string) => {
    try {
      const response = await fetch(`/api/admin/test-users/${id}/reset`, {
        method: 'POST'
      });

      if (response.ok) {
        toast({
          title: "Reset Complete",
          description: `Test user "${companyName}" has been reset`,
        });
        loadTestUsers();
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to reset test user",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error resetting test user",
        variant: "destructive",
      });
    }
  };

  const getTypeInfo = (type: string) => {
    return TEST_USER_TYPES.find(t => t.id === type) || TEST_USER_TYPES[0];
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-800",
      expired: "bg-red-100 text-red-800",
      disabled: "bg-gray-100 text-gray-800"
    };
    return variants[status as keyof typeof variants] || variants.active;
  };

  const filteredTestUsers = testUsers.filter(user => {
    const matchesSearch = user.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.access_code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || user.test_type === filterType;
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Test User Management</h1>
                <p className="text-gray-600">Create and manage test users for demos, QA, and development</p>
              </div>
            </div>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Test User
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Test User</DialogTitle>
                  <DialogDescription>
                    Create a test user for demonstrations, QA testing, or development purposes.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  {/* Test User Type Selection */}
                  <div>
                    <Label className="text-base font-medium">Test User Type</Label>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      {TEST_USER_TYPES.map((type) => (
                        <div
                          key={type.id}
                          className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                            newTestUser.test_type === type.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => handleTestTypeChange(type.id)}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <TestTube className="w-4 h-4" />
                            <span className="font-medium">{type.name}</span>
                          </div>
                          <p className="text-xs text-gray-600">{type.description}</p>
                          <p className="text-xs text-blue-600 mt-1">
                            {type.defaultQuotes} quotes • {type.defaultPlan} plan
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Basic Information */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input
                        id="companyName"
                        value={newTestUser.company_name}
                        onChange={(e) => setNewTestUser({...newTestUser, company_name: e.target.value})}
                        placeholder="e.g., Demo Painting Co."
                      />
                    </div>
                    <div>
                      <Label htmlFor="accessCode">Access Code</Label>
                      <Input
                        id="accessCode"
                        value={newTestUser.access_code}
                        onChange={(e) => setNewTestUser({...newTestUser, access_code: e.target.value.toUpperCase()})}
                        placeholder="Auto-generated if empty"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="quotesAllowed">Quotes Allowed</Label>
                      <Input
                        id="quotesAllowed"
                        type="number"
                        value={newTestUser.quotes_allowed}
                        onChange={(e) => setNewTestUser({...newTestUser, quotes_allowed: e.target.value})}
                        placeholder="25"
                      />
                    </div>
                    <div>
                      <Label htmlFor="expiresDays">Expires in Days (optional)</Label>
                      <Input
                        id="expiresDays"
                        type="number"
                        value={newTestUser.expires_days}
                        onChange={(e) => setNewTestUser({...newTestUser, expires_days: e.target.value})}
                        placeholder="90"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newTestUser.description}
                      onChange={(e) => setNewTestUser({...newTestUser, description: e.target.value})}
                      placeholder="Optional description or notes about this test user"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateTestUser}>
                    Create Test User
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Test Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total_test_users}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Demo Users</CardTitle>
                <TestTube className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.demo_users}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">QA Testing</CardTitle>
                <TestTube className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.qa_users}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Support Users</CardTitle>
                <TestTube className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{stats.support_users}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Developer Users</CardTitle>
                <TestTube className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{stats.developer_users}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Test Quotes</CardTitle>
                <TestTube className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-600">{stats.total_test_quotes}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <Input
                  placeholder="Search by company name or access code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterType === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('all')}
                >
                  All
                </Button>
                {TEST_USER_TYPES.map((type) => (
                  <Button
                    key={type.id}
                    variant={filterType === type.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterType(type.id)}
                  >
                    {type.name}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Users List */}
        <Card>
          <CardHeader>
            <CardTitle>Test Users ({filteredTestUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTestUsers.map((user) => {
                const typeInfo = getTypeInfo(user.test_type);
                return (
                  <div key={user.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <code className="font-mono text-lg font-bold bg-gray-100 px-2 py-1 rounded">
                            {user.access_code}
                          </code>
                          <Badge className={typeInfo.color}>
                            {typeInfo.name}
                          </Badge>
                          <Badge className={getStatusBadge(user.status)}>
                            {user.status}
                          </Badge>
                          <span className="font-medium">{user.company_name}</span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Created:</span> {formatDate(user.created_at)}
                          </div>
                          <div>
                            <span className="font-medium">Quotes:</span> {user.quotes_used} / {user.quotes_allowed}
                          </div>
                          <div>
                            <span className="font-medium">Plan:</span> {user.subscription_plan}
                          </div>
                          {user.expires_at && (
                            <div>
                              <span className="font-medium">Expires:</span> {formatDate(user.expires_at)}
                            </div>
                          )}
                        </div>
                        
                        {user.description && (
                          <p className="text-sm text-gray-600 mt-2">{user.description}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => resetTestUser(user.id, user.company_name)}
                        >
                          <Settings className="w-4 h-4 mr-1" />
                          Reset
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteTestUser(user.id, user.company_name)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {filteredTestUsers.length === 0 && (
                <div className="text-center py-12">
                  <TestTube className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No test users found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm || filterType !== 'all' 
                      ? 'Try adjusting your search or filter criteria.'
                      : 'Create your first test user to get started.'
                    }
                  </p>
                  {!searchTerm && filterType === 'all' && (
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Test User
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}