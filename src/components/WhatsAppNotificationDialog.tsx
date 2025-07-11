
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { MessageCircle, Loader2 } from 'lucide-react';

interface WhatsAppNotificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  medicineName: string;
}

const WhatsAppNotificationDialog = ({ isOpen, onClose, medicineName }: WhatsAppNotificationDialogProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber.trim()) {
      toast({
        title: "Phone number required",
        description: "Please enter your WhatsApp number to receive notifications.",
        variant: "destructive"
      });
      return;
    }

    // Basic phone number validation
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid WhatsApp number with country code.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Save notification request to localStorage
      const notifications = JSON.parse(localStorage.getItem('medicineNotifications') || '[]');
      const newNotification = {
        id: Date.now().toString(),
        medicineName,
        phoneNumber: cleanPhone,
        createdAt: new Date().toISOString(),
        status: 'active'
      };
      notifications.push(newNotification);
      localStorage.setItem('medicineNotifications', JSON.stringify(notifications));

      toast({
        title: "Notification set successfully!",
        description: `We'll send you a WhatsApp message when ${medicineName} becomes available.`,
      });

      onClose();
      setPhoneNumber('');
    } catch (error) {
      toast({
        title: "Failed to set notification",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-green-600" />
            Get Notified via WhatsApp
          </DialogTitle>
          <DialogDescription>
            Enter your WhatsApp number and we'll notify you when <strong>{medicineName}</strong> becomes available.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">WhatsApp Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+243 XXX XXX XXX"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={isSubmitting}
              className="w-full"
            />
            <p className="text-sm text-gray-500">
              Include your country code (e.g., +243 for DRC)
            </p>
          </div>
          
          <DialogFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-500 hover:bg-green-600"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Setting up...
                </>
              ) : (
                <>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Notify Me
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WhatsAppNotificationDialog;
