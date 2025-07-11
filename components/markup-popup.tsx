"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calculator, TrendingUp } from "lucide-react";

interface MarkupPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (percentage: number) => void;
  baseCost: number;
  defaultMarkup?: number;
}

export function MarkupPopup({
  isOpen,
  onClose,
  onConfirm,
  baseCost,
  defaultMarkup = 20
}: MarkupPopupProps) {
  const [markup, setMarkup] = useState(defaultMarkup);
  const [customMode, setCustomMode] = useState(false);

  const profit = baseCost * (markup / 100);
  const total = baseCost + profit;

  const presetOptions = [10, 20, 30, 40];

  const handleConfirm = () => {
    onConfirm(markup);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <TrendingUp />
            Set Your Profit Margin
          </DialogTitle>
          <DialogDescription>
            Your base costs are ${baseCost.toLocaleString()}. Choose your markup percentage.
          </DialogDescription>
        </DialogHeader>
        
        <div>
          {/* Preset Options */}
          {!customMode && (
            <div>
              {presetOptions.map((preset) => (
                <Button
                  key={preset}
                  variant={markup === preset ? "default" : "outline"}
                  onClick={() => setMarkup(preset)}
                 
                >
                  <div>
                    <div>{preset}%</div>
                    <div>
                      ${(baseCost * preset / 100).toFixed(0)}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          )}
          
          {/* Custom Input */}
          {customMode && (
            <div>
              <Label htmlFor="custom-markup">Custom Markup Percentage</Label>
              <div>
                <Input
                  id="custom-markup"
                  type="number"
                  min="0"
                  max="100"
                  value={markup}
                  onChange={(e) => setMarkup(Number(e.target.value))}
                 
                />
                <span>%</span>
              </div>
            </div>
          )}
          
          {/* Toggle Custom Mode */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCustomMode(!customMode)}
           
          >
            {customMode ? "Use Preset Options" : "Enter Custom Percentage"}
          </Button>
          
          {/* Preview */}
          <div>
            <div>
              <span>Base Cost:</span>
              <span>${baseCost.toLocaleString()}</span>
            </div>
            <div>
              <span>Your Profit ({markup}%):</span>
              <span>
                ${profit.toFixed(2).toLocaleString()}
              </span>
            </div>
            <div>
              <span>Customer Price:</span>
              <span>${total.toFixed(2).toLocaleString()}</span>
            </div>
          </div>
          
          {/* Profit Margin Indicator */}
          <div>
            <div>
              <span>Profit Margin</span>
              <span>{((profit / total) * 100).toFixed(1)}%</span>
            </div>
            <div>
              <div
               
                style={{ width: `${(profit / total) * 100}%` }}
              />
            </div>
          </div>
        </div>
        
        <div>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>
            Apply {markup}% Markup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}