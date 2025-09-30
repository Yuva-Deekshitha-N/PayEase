// Location Service for PayEase
// Handles user location tracking for merchant security and payment recovery

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: Date;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface UserLocationTracking {
  userId: string;
  currentLocation?: LocationData;
  locationHistory: LocationData[];
  consentGiven: boolean;
  consentDate?: Date;
  lastUpdated: Date;
  trackingEnabled: boolean;
}

export interface LocationPermissionRequest {
  userId: string;
  merchantId: string;
  reason: 'security' | 'payment_recovery' | 'fraud_prevention';
  requestedAt: Date;
  status: 'pending' | 'granted' | 'denied';
  expiresAt?: Date;
}

export class LocationService {
  private static instance: LocationService;
  private userLocations: Map<string, UserLocationTracking> = new Map();
  private permissionRequests: Map<string, LocationPermissionRequest> = new Map();
  private watchIds: Map<string, number> = new Map();

  private constructor() {}

  public static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  // Request location permission from user
  public async requestLocationPermission(
    userId: string, 
    merchantId: string, 
    reason: 'security' | 'payment_recovery' | 'fraud_prevention'
  ): Promise<boolean> {
    return new Promise((resolve) => {
      const message = this.getPermissionMessage(reason);
      const userConsent = confirm(
        `${message}\n\nDo you want to allow location tracking? This helps protect both you and merchants from fraud.`
      );

      const requestId = `${userId}_${merchantId}`;
      const request: LocationPermissionRequest = {
        userId,
        merchantId,
        reason,
        requestedAt: new Date(),
        status: userConsent ? 'granted' : 'denied',
        expiresAt: userConsent ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : undefined // 30 days
      };

      this.permissionRequests.set(requestId, request);

      if (userConsent) {
        this.enableLocationTracking(userId);
      }

      resolve(userConsent);
    });
  }

  // Enable location tracking for a user
  public async enableLocationTracking(userId: string): Promise<void> {
    if (!navigator.geolocation) {
      throw new Error('Geolocation is not supported by this browser');
    }

    // Initialize or update user tracking
    let userTracking = this.userLocations.get(userId) || {
      userId,
      locationHistory: [],
      consentGiven: true,
      consentDate: new Date(),
      lastUpdated: new Date(),
      trackingEnabled: true
    };

    userTracking.consentGiven = true;
    userTracking.consentDate = new Date();
    userTracking.trackingEnabled = true;
    userTracking.lastUpdated = new Date();

    this.userLocations.set(userId, userTracking);

    // Start watching position
    this.startWatchingPosition(userId);
  }

  // Disable location tracking
  public disableLocationTracking(userId: string): void {
    const userTracking = this.userLocations.get(userId);
    if (userTracking) {
      userTracking.trackingEnabled = false;
      userTracking.lastUpdated = new Date();
      this.userLocations.set(userId, userTracking);
    }

    // Stop watching position
    this.stopWatchingPosition(userId);
  }

  // Start continuous position watching
  private startWatchingPosition(userId: string): void {
    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutes
    };

    const watchId = navigator.geolocation.watchPosition(
      (position) => this.handlePositionUpdate(userId, position),
      (error) => this.handlePositionError(userId, error),
      options
    );

    this.watchIds.set(userId, watchId);
  }

  // Stop position watching
  private stopWatchingPosition(userId: string): void {
    const watchId = this.watchIds.get(userId);
    if (watchId !== undefined) {
      navigator.geolocation.clearWatch(watchId);
      this.watchIds.delete(userId);
    }
  }

  // Handle position updates
  private async handlePositionUpdate(userId: string, position: GeolocationPosition): Promise<void> {
    const locationData: LocationData = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      timestamp: new Date(position.timestamp)
    };

    // Reverse geocoding (mock implementation)
    try {
      const addressInfo = await this.reverseGeocode(
        locationData.latitude, 
        locationData.longitude
      );
      Object.assign(locationData, addressInfo);
    } catch (error) {
      console.warn('Failed to reverse geocode location:', error);
    }

    const userTracking = this.userLocations.get(userId);
    if (userTracking && userTracking.trackingEnabled) {
      userTracking.currentLocation = locationData;
      userTracking.locationHistory.push(locationData);
      userTracking.lastUpdated = new Date();

      // Keep only last 100 locations to prevent memory issues
      if (userTracking.locationHistory.length > 100) {
        userTracking.locationHistory = userTracking.locationHistory.slice(-100);
      }

      this.userLocations.set(userId, userTracking);
    }
  }

  // Handle position errors
  private handlePositionError(userId: string, error: GeolocationPositionError): void {
    console.warn(`Location error for user ${userId}:`, error.message);
    
    const userTracking = this.userLocations.get(userId);
    if (userTracking) {
      userTracking.lastUpdated = new Date();
      this.userLocations.set(userId, userTracking);
    }
  }

  // Mock reverse geocoding
  private async reverseGeocode(lat: number, lon: number): Promise<{
    address?: string;
    city?: string;
    state?: string;
    country?: string;
  }> {
    // In a real implementation, this would call a geocoding API
    // For demo, we'll return mock data based on coordinates
    
    // Mock US cities based on approximate coordinates
    const mockLocations = [
      { lat: 40.7128, lon: -74.0060, city: 'New York', state: 'NY', country: 'USA' },
      { lat: 34.0522, lon: -118.2437, city: 'Los Angeles', state: 'CA', country: 'USA' },
      { lat: 41.8781, lon: -87.6298, city: 'Chicago', state: 'IL', country: 'USA' },
      { lat: 29.7604, lon: -95.3698, city: 'Houston', state: 'TX', country: 'USA' },
      { lat: 37.7749, lon: -122.4194, city: 'San Francisco', state: 'CA', country: 'USA' }
    ];

    // Find closest mock location
    let closest = mockLocations[0];
    let minDistance = this.calculateDistance(lat, lon, closest.lat, closest.lon);

    for (const location of mockLocations) {
      const distance = this.calculateDistance(lat, lon, location.lat, location.lon);
      if (distance < minDistance) {
        minDistance = distance;
        closest = location;
      }
    }

    return {
      city: closest.city,
      state: closest.state,
      country: closest.country,
      address: `${closest.city}, ${closest.state}`
    };
  }

  // Calculate distance between two coordinates (Haversine formula)
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Get permission message based on reason
  private getPermissionMessage(reason: 'security' | 'payment_recovery' | 'fraud_prevention'): string {
    switch (reason) {
      case 'security':
        return 'This merchant requires location access for security verification purposes.';
      case 'payment_recovery':
        return 'Location tracking helps with payment recovery processes for overdue payments.';
      case 'fraud_prevention':
        return 'Location verification helps prevent fraudulent transactions and protects your account.';
      default:
        return 'Location access is required for enhanced security features.';
    }
  }

  // Get user's current location
  public getCurrentLocation(userId: string): LocationData | null {
    const userTracking = this.userLocations.get(userId);
    return userTracking?.currentLocation || null;
  }

  // Get user's location history
  public getLocationHistory(userId: string, limit?: number): LocationData[] {
    const userTracking = this.userLocations.get(userId);
    if (!userTracking) return [];

    const history = userTracking.locationHistory;
    return limit ? history.slice(-limit) : history;
  }

  // Check if user has given location consent
  public hasLocationConsent(userId: string): boolean {
    const userTracking = this.userLocations.get(userId);
    return userTracking?.consentGiven || false;
  }

  // Check if location tracking is active
  public isTrackingActive(userId: string): boolean {
    const userTracking = this.userLocations.get(userId);
    return userTracking?.trackingEnabled || false;
  }

  // For merchants: Get customer location (with proper authorization)
  public getCustomerLocation(
    customerId: string, 
    merchantId: string, 
    reason: 'security' | 'payment_recovery' | 'fraud_prevention'
  ): LocationData | null {
    // Check if merchant has permission to access customer location
    const requestId = `${customerId}_${merchantId}`;
    const request = this.permissionRequests.get(requestId);
    
    if (!request || request.status !== 'granted') {
      return null;
    }

    // Check if permission has expired
    if (request.expiresAt && new Date() > request.expiresAt) {
      return null;
    }

    return this.getCurrentLocation(customerId);
  }

  // Get all location permissions for a user
  public getUserLocationPermissions(userId: string): LocationPermissionRequest[] {
    return Array.from(this.permissionRequests.values())
      .filter(request => request.userId === userId);
  }

  // Revoke location permission
  public revokeLocationPermission(userId: string, merchantId: string): void {
    const requestId = `${userId}_${merchantId}`;
    const request = this.permissionRequests.get(requestId);
    
    if (request) {
      request.status = 'denied';
      this.permissionRequests.set(requestId, request);
    }

    // If no active permissions remain, disable tracking
    const activePermissions = this.getUserLocationPermissions(userId)
      .filter(req => req.status === 'granted');
    
    if (activePermissions.length === 0) {
      this.disableLocationTracking(userId);
    }
  }

  // Cleanup: Remove expired permissions and old location data
  public cleanup(): void {
    const now = new Date();
    
    // Remove expired permissions
    for (const [key, request] of this.permissionRequests.entries()) {
      if (request.expiresAt && now > request.expiresAt) {
        this.permissionRequests.delete(key);
      }
    }

    // Clean old location history (keep only last 30 days)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    for (const [userId, tracking] of this.userLocations.entries()) {
      tracking.locationHistory = tracking.locationHistory.filter(
        location => location.timestamp > thirtyDaysAgo
      );
      this.userLocations.set(userId, tracking);
    }
  }
}

export const locationService = LocationService.getInstance();