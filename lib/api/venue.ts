import axiosInstance from "./axios-instance";
import { API } from "./endpoints";

export interface Venue {
  _id: string;
  name: string;
  description: string;
  category: string;
  sport: string;
  city: string;
  location: string;
  image: string;
  pricePerHour: number;
  rating: number;
  reviews: number;
  amenities: string[];
  featured: boolean;
  createdAt?: string;
  ownerName?: string;
  phone?: string;
  email?: string;
  googleMapsLink?: string;
  weekendPrice?: number;
  nightPrice?: number;
  discount?: string;
  openingTime?: string;
  closingTime?: string;
}

export async function getVenues(params?: {
  search?: string;
  sport?: string;
  city?: string;
  sort?: "rating" | "price-low" | "price-high";
}) {
  const res = await axiosInstance.get(API.VENUES.ALL, { params });
  return res.data.data as Venue[];
}

export async function getVenueById(id: string) {
  const res = await axiosInstance.get(API.VENUES.BY_ID(id));
  return res.data.data as Venue;
}

export async function createVenue(token: string, formData: FormData) {
  const res = await axiosInstance.post(API.VENUES.ALL, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
}
