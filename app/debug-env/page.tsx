"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react";

export default function DebugEnvironmentPage() {
  const [envStatus, setEnvStatus] = useState<any>(null);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    checkEnvironment();
  }, []);

  const checkEnvironment = async () => {
    setTesting(true);
    try {
      const response = await fetch('/api/test-supabase');
      const data = await response.json();
      setEnvStatus(data);
    } catch (error) {
      setEnvStatus({
        success: false,
        error: 'Failed to connect to API',
        details: error
      });
    } finally {
      setTesting(false);
    }
  };

  const StatusIcon = ({ success }: { success: boolean }) => {
    if (success) return <CheckCircle className="w-5 h-5 text-green-500" />;
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Environment Diagnostics
          </h1>
          <p className="text-gray-600">
            Debug tool to check Supabase configuration on Vercel
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Environment Configuration
                </CardTitle>
                <Button 
                  onClick={checkEnvironment} 
                  disabled={testing}
                  size="sm"
                  variant="outline"
                >
                  {testing ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  Recheck
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {envStatus ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Overall Status</span>
                    <div className="flex items-center gap-2">
                      <StatusIcon success={envStatus.success} />
                      <span className={envStatus.success ? "text-green-600" : "text-red-600"}>
                        {envStatus.success ? "Connected" : "Failed"}
                      </span>
                    </div>
                  </div>

                  {envStatus.config && (
                    <>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span>Supabase URL</span>
                        <div className="flex items-center gap-2">
                          <StatusIcon success={envStatus.config.hasUrl} />
                          <span className={envStatus.config.hasUrl ? "text-green-600" : "text-red-600"}>
                            {envStatus.config.hasUrl ? "Set" : "Missing"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span>Service Role Key</span>
                        <div className="flex items-center gap-2">
                          <StatusIcon success={envStatus.config.hasServiceKey} />
                          <span className={envStatus.config.hasServiceKey ? "text-green-600" : "text-red-600"}>
                            {envStatus.config.hasServiceKey ? "Set" : "Missing"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span>Anon Key</span>
                        <div className="flex items-center gap-2">
                          <StatusIcon success={envStatus.config.hasAnonKey} />
                          <span className={envStatus.config.hasAnonKey ? "text-green-600" : "text-red-600"}>
                            {envStatus.config.hasAnonKey ? "Set" : "Missing"}
                          </span>
                        </div>
                      </div>
                    </>
                  )}

                  {envStatus.error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <h4 className="font-medium text-red-800 mb-2">Error:</h4>
                      <p className="text-red-700 text-sm">{envStatus.error}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}