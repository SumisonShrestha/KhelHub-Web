import axiosInstance from "./axios-instance";
import { API } from "./endpoints";

export interface Rating {
  _id: string;
  venueId: string;
  userId: { _id: string; name: string };
  rating: number;
  review: string;
  createdAt: string;
}

export interface VenueRatings {
  ratings: Rating[];
  averageRating: number;
  totalReviews: number;
}

export async function getVenueRatings(venueId: string) {
  const res = await axiosInstance.get(API.RATINGS.BY_VENUE(venueId));
  return res.data.data as VenueRatings;
}
