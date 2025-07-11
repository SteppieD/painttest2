"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X, Plus, Pencil } from "lucide-react";
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
    <Card>
      <CardContent>
        <div>
          <div>
            <h3>
              {room.name} ({room.dimensions}, {room.height}ft ceiling)
            </h3>
            {room.surfaces && room.surfaces.length > 0 && (
              <p>
                Surfaces: {room.surfaces.join(", ")}
              </p>
            )}
          </div>
          <div>
            {!isConfirmed ? (
              <>
                <Button 
                  onClick={onConfirm}
                  size="sm"
                 
                >
                  <Check />
                  Confirm
                </Button>
                <Button 
                  onClick={onEdit}
                  size="sm"
                  variant="outline"
                 
                >
                  <X />
                  Edit
                </Button>
              </>
            ) : (
              <Button 
                onClick={onEdit}
                size="sm"
                variant="outline"
               
              >
                <Pencil />
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
     
    >
      <div>
        <span>{surface}</span>
        {roomName && (
          <span>
            {roomName}
          </span>
        )}
        {details && (
          <span>
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
  const;

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
     
    >
      {icon}
      <span>{label}</span>
    </Button>
  );
}

// Predefined action buttons for common use cases
export function AddRoomButton({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <ActionButton
      icon={<Plus />}
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
      icon={<Check />}
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
    <div>
      {title && (
        <h4>{title}</h4>
      )}
      <div>
        {children}
      </div>
    </div>
  );
}