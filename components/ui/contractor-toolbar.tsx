import React, { useState } from 'react';
import { Edit, Send, Calculator, Eye, EyeOff, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

interface ContractorToolbarProps {
  quoteId: string;
  currentMarkup: number;
  onMarkupChange: (markup: number) => void;
  onEditClick: () => void;
  customerEmail?: string;
  isContractorView: boolean;
  onViewToggle: () => void;
}

export const ContractorToolbar: React.FC<ContractorToolbarProps> = ({
  quoteId,
  currentMarkup,
  onMarkupChange,
  onEditClick,
  customerEmail = '',
  isContractorView,
  onViewToggle
}) => {
  const { toast } = useToast();
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [emailTo, setEmailTo] = useState(customerEmail);
  const [emailMessage, setEmailMessage] = useState(
    `Hi,\n\nPlease find attached your painting quote. This quote is valid for 30 days.\n\nIf you have any questions or would like to proceed, please don't hesitate to contact us.\n\nBest regards`
  );
  const [isSending, setIsSending] = useState(false);

  const handleSendEmail = async () => {
    if (!emailTo) {
      toast({
        title: "Email Required",
        description: "Please enter the customer's email address",
        variant: "destructive"
      });
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch(`/api/quotes/${quoteId}/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: emailTo,
          message: emailMessage
        })
      });

      if (response.ok) {
        toast({
          title: "Quote Sent!",
          description: `Quote has been emailed to ${emailTo}`,
        });
        setShowEmailDialog(false);
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send email. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* Floating Toolbar */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <Card className="shadow-2xl border-gray-200">
          <div className="p-4">
            <div className="flex items-center gap-4">
              {/* View Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={onViewToggle}
                className="gap-2"
              >
                {isContractorView ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {isContractorView ? 'Customer View' : 'Contractor View'}
              </Button>

              {/* Markup Adjustment */}
              {isContractorView && (
                <div className="flex items-center gap-3 px-4 border-x">
                  <Minus className="w-4 h-4 text-gray-400" />
                  <div className="w-32">
                    <Slider
                      value={[currentMarkup]}
                      onValueChange={([value]) => onMarkupChange(value)}
                      min={-5}
                      max={50}
                      step={5}
                      className="cursor-pointer"
                    />
                  </div>
                  <Plus className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium min-w-[3rem] text-right">
                    {currentMarkup > 0 ? '+' : ''}{currentMarkup}%
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onEditClick}
                  className="gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Quote
                </Button>
                <Button
                  size="sm"
                  onClick={() => setShowEmailDialog(true)}
                  className="gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="w-4 h-4" />
                  Send to Client
                </Button>
              </div>
            </div>

            {/* Markup Info */}
            {isContractorView && currentMarkup !== 0 && (
              <div className="mt-3 pt-3 border-t text-sm text-gray-600 text-center">
                <Calculator className="w-4 h-4 inline mr-1" />
                Quote includes {currentMarkup}% markup on base cost
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Email Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Quote to Client</DialogTitle>
            <DialogDescription>
              Email this quote directly to your customer
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email-to">Customer Email</Label>
              <Input
                id="email-to"
                type="email"
                value={emailTo}
                onChange={(e) => setEmailTo(e.target.value)}
                placeholder="customer@email.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email-message">Message</Label>
              <Textarea
                id="email-message"
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                rows={6}
                placeholder="Add a personal message..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setShowEmailDialog(false)}
              disabled={isSending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendEmail}
              disabled={isSending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Quote
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};