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
    if (success) return <CheckCircle />;
    return <XCircle />;
  };

  return (
    <div>
      <div>
        <div>
          <h1>
            Environment Diagnostics
          </h1>
          <p>
            Debug tool to check Supabase configuration on Vercel
          </p>
        </div>

        <div>
          <Card>
            <CardHeader>
              <div>
                <CardTitle>
                  <AlertCircle />
                  Environment Configuration
                </CardTitle>
                <Button 
                  onClick={checkEnvironment} 
                  disabled={testing}
                  size="sm"
                  variant="outline"
                >
                  {testing ? (
                    <RefreshCw />
                  ) : (
                    <RefreshCw />
                  )}
                  Recheck
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {envStatus ? (
                <div>
                  <div>
                    <span>Overall Status</span>
                    <div>
                      <StatusIcon success={envStatus.success} />
                      <span>
                        {envStatus.success ? "Connected" : "Failed"}
                      </span>
                    </div>
                  </div>

                  {envStatus.config && (
                    <>
                      <div>
                        <span>Supabase URL</span>
                        <div>
                          <StatusIcon success={envStatus.config.hasUrl} />
                          <span>
                            {envStatus.config.hasUrl ? "Set" : "Missing"}
                          </span>
                        </div>
                      </div>

                      <div>
                        <span>Service Role Key</span>
                        <div>
                          <StatusIcon success={envStatus.config.hasServiceKey} />
                          <span>
                            {envStatus.config.hasServiceKey ? "Set" : "Missing"}
                          </span>
                        </div>
                      </div>

                      <div>
                        <span>Anon Key</span>
                        <div>
                          <StatusIcon success={envStatus.config.hasAnonKey} />
                          <span>
                            {envStatus.config.hasAnonKey ? "Set" : "Missing"}
                          </span>
                        </div>
                      </div>
                    </>
                  )}

                  {envStatus.error && (
                    <div>
                      <h4>Error:</h4>
                      <p>{envStatus.error}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <p>Loading...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}