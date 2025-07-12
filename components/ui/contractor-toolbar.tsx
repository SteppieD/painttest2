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
      <div>
        <Card>
          <div>
            <div>
              {/* View Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={onViewToggle}
               
              >
                {isContractorView ? <EyeOff /> : <Eye />}
                {isContractorView ? 'Customer View' : 'Contractor View'}
              </Button>

              {/* Markup Adjustment */}
              {isContractorView && (
                <div>
                  <Minus />
                  <div>
                    <Slider
                      value={[currentMarkup]}
                      onValueChange={([value]) => onMarkupChange(value)}
                      min={-5}
                      max={50}
                      step={5}
                     
                    />
                  </div>
                  <Plus />
                  <span>
                    {currentMarkup > 0 ? '+' : ''}{currentMarkup}%
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onEditClick}
                 
                >
                  <Edit />
                  Edit Quote
                </Button>
                <Button
                  size="sm"
                  onClick={() => setShowEmailDialog(true)}
                 
                >
                  <Send />
                  Send to Client
                </Button>
              </div>
            </div>

            {/* Markup Info */}
            {isContractorView && currentMarkup !== 0 && (
              <div>
                <Calculator />
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
          
          <div>
            <div>
              <Label htmlFor="email-to">Customer Email</Label>
              <Input
                id="email-to"
                type="email"
                value={emailTo}
                onChange={(e) => setEmailTo(e.target.value)}
                placeholder="customer@email.com"
              />
            </div>
            
            <div>
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

          <div>
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
             
            >
              {isSending ? (
                <>
                  <div />
                  Sending...
                </>
              ) : (
                <>
                  <Send />
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