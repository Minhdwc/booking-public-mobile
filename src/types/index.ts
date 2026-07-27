export interface IUser {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  avatarUrl?: string;
  emailVerified: boolean;
  verifyToken?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IVenue {
  id: string;
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICourt {
  id: string;
  venueId: string;
  sportId: string;
  name: string;
  description: string;
  basePriceVnd: number;
  minDurationMinutes: number;
  durationStepMinutes: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISport {
  id: string;
  name: string;
}

export interface IBooking {
  id: string;
  userId: string;
  courtId: string;
  bookingCode: string;
  status: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  note: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  items: IBookingItem[];
  court: ICourt;
  user: IUser;
}

export interface IBookingItem {
  id: string;
  bookingId: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  priceVnd: number;
  durationMinutes: number;
  pricePerHour: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPaymentMethod {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserPaymentMethod {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerToken?: string;
  maskedNumber?: string;
  holderName?: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: IUser;
}

export interface IVenuePaymentMethod {
  id: string;
  venueId: string;
  paymentMethodId: string;
  provider: string;
  accountNumber?: string;
  bankCode?: string;
  bankName?: string;
  qrCodeUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  venue: IVenue;
  paymentMethod: IPaymentMethod;
  accountName: string;
}

export interface IReview {
  id: string;
  userId: string;
  venueId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  user: IUser;
  venue: IVenue;
}

export interface IUserVenueFavorite {
  id: string;
  userId: string;
  venueId: string;
  createdAt: Date;
  updatedAt: Date;
  user: IUser;
  venue: IVenue;
}

export interface INotification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  readAt: Date;
  createdAt: Date;
  updatedAt: Date;
  user: IUser;
}

export interface IAmenities {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  venues: IVenueAmenities[];
}

export interface IVenueAmenities {
  id: string;
  venueId: string;
  amenitiesId: string;
  createdAt: Date;
  updatedAt: Date;
  venue: IVenue;
  amenities: IAmenities;
}

export interface IVenueImage {
  id: string;
  url: string;
  venueId: string;
  isThumbnail: boolean;
  position: number;
  createdAt: Date;
  updatedAt: Date;
  venue: IVenue;
}

export interface ICourtImage {
  id: string;
  url: string;
  courtId: string;
  isThumbnail: boolean;
  position: number;
  createdAt: Date;
  updatedAt: Date;
  court: ICourt;
}
