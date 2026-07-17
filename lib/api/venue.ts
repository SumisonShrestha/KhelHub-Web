import axiosInstance from "./axios-instance";
import { API } from "./endpoints";

export interface Venue {
  _id: string;
  name: string;
  description: string;
  sport: string;
  city: string;
  location: string;
  image: string;
  pricePerHour: number;
  rating: number;
  reviews: number;
  amenities: string[];
  featured: boolean;
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
