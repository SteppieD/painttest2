"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X, Plus, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoomData {
  name: string;
  dimensions: string;
  height: number;
  surfaces?: string[];
}

interface RoomConfirmationButtonProps {
  room: RoomData;
  onConfirm: () => void;
  onEdit: () => void;
  isConfirmed?: boolean;
}

export function RoomConfirmationButton({ 
  room, 
  onConfirm, 
  onEdit, 
  isConfirmed = false 
}: RoomConfirmationButtonProps) {
  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md",
      isConfirmed ? "bg-green-50 border-green-200" : "bg-blue-50 border-blue-200"
    )}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">
              {room.name} ({room.dimensions}, {room.height}ft ceiling)
            </h3>
            {room.surfaces && room.surfaces.length > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                Surfaces: {room.surfaces.join(", ")}
              </p>
            )}
          </div>
          <div className="flex gap-2 ml-4">
            {!isConfirmed ? (
              <>
                <Button 
                  onClick={onConfirm}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Confirm
                </Button>
                <Button 
                  onClick={onEdit}
                  size="sm"
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  <X className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              </>
            ) : (
              <Button 
                onClick={onEdit}
                size="sm"
                variant="outline"
                className="border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                <Pencil className="w-4 h-4 mr-1" />
                Edit
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface SurfaceButtonProps {
  surface: string;
  roomName?: string;
  details?: string;
  isSelected?: boolean;
  onClick: () => void;
}

export function SurfaceButton({ 
  surface, 
  roomName, 
  details, 
  isSelected = false,
  onClick 
}: SurfaceButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant={isSelected ? "default" : "outline"}
      className={cn(
        "h-auto p-4 justify-start text-left",
        isSelected 
          ? "bg-blue-600 hover:bg-blue-700 text-white" 
          : "border-gray-200 hover:bg-gray-50"
      )}
    >
      <div className="flex flex-col items-start">
        <span className="font-medium">{surface}</span>
        {roomName && (
          <span className="text-xs opacity-70 mt-1">
            {roomName}
          </span>
        )}
        {details && (
          <span className="text-xs opacity-70 mt-1">
            {details}
          </span>
        )}
      </div>
    </Button>
  );
}

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "success";
  disabled?: boolean;
}

export function ActionButton({ 
  icon, 
  label, 
  onClick, 
  variant = "primary",
  disabled = false 
}: ActionButtonProps) {
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "border-gray-200 text-gray-600 hover:bg-gray-50",
    success: "bg-green-600 hover:bg-green-700 text-white"
  };

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "h-12 px-6 text-base",
        variants[variant],
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </Button>
  );
}

// Predefined action buttons for common use cases
export function AddRoomButton({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <ActionButton
      icon={<Plus className="w-5 h-5" />}
      label="Add Another Room"
      onClick={onClick}
      variant="secondary"
      disabled={disabled}
    />
  );
}

export function ConfirmQuoteButton({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <ActionButton
      icon={<Check className="w-5 h-5" />}
      label="Confirm Quote"
      onClick={onClick}
      variant="success"
      disabled={disabled}
    />
  );
}

// Container for organizing buttons in the chat
interface ButtonGroupProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function ButtonGroup({ title, children, className }: ButtonGroupProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {title && (
        <h4 className="text-sm font-medium text-gray-700 mb-2">{title}</h4>
      )}
      <div className="flex flex-wrap gap-2">
        {children}
      </div>
    </div>
  );
}