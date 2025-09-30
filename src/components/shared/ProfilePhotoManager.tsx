import React, { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Card, CardContent } from '../ui/card';
import { Camera, Upload, User, X } from 'lucide-react';
import { toast } from 'sonner';

interface ProfilePhotoManagerProps {
  currentPhoto?: string;
  userName: string;
  onPhotoChange: (photoUrl: string | null) => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function ProfilePhotoManager({ 
  currentPhoto, 
  userName, 
  onPhotoChange, 
  size = 'md' 
}: ProfilePhotoManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPhoto || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-32 h-32'
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleRandomPhoto = async () => {
    setIsLoading(true);
    try {
      // For demo purposes, use a placeholder professional photo
      // In a real app, this would use an API like Unsplash
      const photoUrls = [
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face'
      ];
      
      const randomPhoto = photoUrls[Math.floor(Math.random() * photoUrls.length)];
      setPreviewUrl(randomPhoto);
      toast.success('Random professional photo selected');
    } catch (error) {
      toast.error('Failed to load random photo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    onPhotoChange(previewUrl);
    setIsOpen(false);
    toast.success('Profile photo updated successfully');
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    onPhotoChange(null);
    setIsOpen(false);
    toast.success('Profile photo removed');
  };

  const handleCancel = () => {
    setPreviewUrl(currentPhoto || null);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="relative cursor-pointer group">
          <Avatar className={`${sizeClasses[size]} transition-opacity group-hover:opacity-75`}>
            <AvatarImage src={currentPhoto || undefined} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              {getInitials(userName)}
            </AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-full">
            <Camera className="w-4 h-4 text-white" />
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Profile Photo</DialogTitle>
          <DialogDescription>
            Upload a new photo or use the default initial-based avatar
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Preview */}
          <div className="flex justify-center">
            <Avatar className="w-32 h-32">
              <AvatarImage src={previewUrl || undefined} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl">
                {getInitials(userName)}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 gap-3">
            <Card className="cursor-pointer hover:bg-accent transition-colors" onClick={() => fileInputRef.current?.click()}>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Upload className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium">Upload Photo</p>
                  <p className="text-sm text-muted-foreground">Choose from your device</p>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:bg-accent transition-colors" 
              onClick={handleRandomPhoto}
            >
              <CardContent className="flex items-center gap-3 p-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Camera className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="font-medium">Random Professional Photo</p>
                  <p className="text-sm text-muted-foreground">Get a professional headshot</p>
                </div>
                {isLoading && (
                  <div className="ml-auto">
                    <div className="w-4 h-4 border-2 border-purple-600/30 border-t-purple-600 rounded-full animate-spin"></div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:bg-accent transition-colors" onClick={() => setPreviewUrl(null)}>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <p className="font-medium">Use Initials</p>
                  <p className="text-sm text-muted-foreground">Default avatar with your initials</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button onClick={handleCancel} variant="outline" className="flex-1">
              Cancel
            </Button>
            {currentPhoto && (
              <Button onClick={handleRemove} variant="destructive" size="sm">
                <X className="w-4 h-4" />
              </Button>
            )}
            <Button onClick={handleSave} className="flex-1">
              Save Changes
            </Button>
          </div>
        </div>

        {/* Hidden file input */}
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </DialogContent>
    </Dialog>
  );
}