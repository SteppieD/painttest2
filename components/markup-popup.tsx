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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Set Your Profit Margin
          </DialogTitle>
          <DialogDescription>
            Your base costs are ${baseCost.toLocaleString()}. Choose your markup percentage.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Preset Options */}
          {!customMode && (
            <div className="grid grid-cols-4 gap-2">
              {presetOptions.map((preset) => (
                <Button
                  key={preset}
                  variant={markup === preset ? "default" : "outline"}
                  onClick={() => setMarkup(preset)}
                  className="h-auto py-3 px-2"
                >
                  <div className="text-center">
                    <div className="font-bold text-lg">{preset}%</div>
                    <div className="text-xs opacity-70">
                      ${(baseCost * preset / 100).toFixed(0)}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          )}
          
          {/* Custom Input */}
          {customMode && (
            <div className="space-y-2">
              <Label htmlFor="custom-markup">Custom Markup Percentage</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="custom-markup"
                  type="number"
                  min="0"
                  max="100"
                  value={markup}
                  onChange={(e) => setMarkup(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm text-gray-600">%</span>
              </div>
            </div>
          )}
          
          {/* Toggle Custom Mode */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCustomMode(!customMode)}
            className="w-full"
          >
            {customMode ? "Use Preset Options" : "Enter Custom Percentage"}
          </Button>
          
          {/* Preview */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Base Cost:</span>
              <span>${baseCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Your Profit ({markup}%):</span>
              <span className="text-green-600 font-medium">
                ${profit.toFixed(2).toLocaleString()}
              </span>
            </div>
            <div className="border-t pt-2 flex justify-between font-medium">
              <span>Customer Price:</span>
              <span className="text-lg">${total.toFixed(2).toLocaleString()}</span>
            </div>
          </div>
          
          {/* Profit Margin Indicator */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-600">
              <span>Profit Margin</span>
              <span>{((profit / total) * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(profit / total) * 100}%` }}
              />
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleConfirm} className="flex-1">
            Apply {markup}% Markup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}