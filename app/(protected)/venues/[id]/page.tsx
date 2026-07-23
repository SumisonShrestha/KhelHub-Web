"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MapPin, Star, ArrowLeft, Calendar, Clock, Building2, Check, Phone, Mail, User, Clock3, Percent, ExternalLink } from "lucide-react";
import Link from "next/link";
import { getVenueById, type Venue } from "@/lib/api/venue";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800";

export default function VenueDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getVenueById(id)
      .then(setVenue)
      .catch(() => setVenue(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 py-12 md:px-6">
          <div className="animate-pulse space-y-6">
            <div className="h-64 w-full rounded-3xl bg-gray-200" />
            <div className="h-8 w-2/3 rounded bg-gray-200" />
            <div className="h-4 w-1/3 rounded bg-gray-200" />
            <div className="h-20 w-full rounded bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Venue not found</p>
      </div>
    );
  }

  const listedDate = venue.createdAt
    ? new Date(venue.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-6">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-sm text-gray-500 transition hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
          <div className="relative h-64 md:h-80">
            <img
              src={venue.image || FALLBACK_IMAGE}
              alt={venue.name}
              className="h-full w-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
            />
            <div className="absolute right-4 top-4 rounded-full bg-[#121A2A] px-4 py-2 text-lg font-bold text-white shadow-lg">
              Rs. {venue.pricePerHour.toLocaleString()}<span className="text-sm font-normal">/hr</span>
            </div>
          </div>

          <div className="space-y-6 p-6 md:p-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">{venue.name}</h1>
              <p className="mt-2 flex items-center gap-1.5 text-gray-500">
                <MapPin className="h-4 w-4" /> {venue.location}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1 rounded-full bg-yellow-50 px-3 py-1 text-sm font-semibold text-yellow-700">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                {venue.rating} ({venue.reviews} reviews)
              </div>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">{venue.category || venue.sport}</span>
              <span className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
                <Building2 className="h-3.5 w-3.5" /> {venue.city}
              </span>
              {listedDate && (
                <span className="flex items-center gap-1 text-sm text-gray-400">
                  <Clock className="h-3.5 w-3.5" /> Listed {listedDate}
                </span>
              )}
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">About this venue</h2>
              <p className="mt-2 leading-relaxed text-gray-600">{venue.description}</p>
            </div>

            {venue.amenities.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Amenities</h2>
                <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-3">
                  {venue.amenities.map((item) => (
                    <div key={item} className="flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-2.5 text-sm text-gray-700">
                      <Check className="h-4 w-4 text-green-500" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
              {venue.ownerName && (
                <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Owner</p>
                    <p className="font-medium text-gray-900">{venue.ownerName}</p>
                  </div>
                </div>
              )}
              {venue.phone && (
                <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{venue.phone}</p>
                  </div>
                </div>
              )}
              {venue.email && (
                <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{venue.email}</p>
                  </div>
                </div>
              )}
              {venue.openingTime && venue.closingTime && (
                <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4">
                  <Clock3 className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Hours</p>
                    <p className="font-medium text-gray-900">{venue.openingTime} - {venue.closingTime}</p>
                  </div>
                </div>
              )}
              {(venue.weekendPrice || venue.nightPrice) && (
                <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4">
                  <Percent className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Pricing</p>
                    <p className="font-medium text-gray-900">
                      {venue.weekendPrice && <>Weekend: Rs {venue.weekendPrice.toLocaleString()}</>}
                      {venue.weekendPrice && venue.nightPrice && <span className="mx-1">|</span>}
                      {venue.nightPrice && <>Night: Rs {venue.nightPrice.toLocaleString()}</>}
                    </p>
                  </div>
                </div>
              )}
              {venue.discount && (
                <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4">
                  <Percent className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Discount</p>
                    <p className="font-medium text-green-600">{venue.discount}</p>
                  </div>
                </div>
              )}
            </div>

            {venue.googleMapsLink && (
              <a
                href={venue.googleMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                <ExternalLink className="h-4 w-4" />
                View on Google Maps
              </a>
            )}

            <div className="flex flex-wrap gap-3 border-t pt-6">
              <Link
                href={`/booking?venueId=${venue._id}`}
                className="inline-flex items-center gap-2 rounded-xl bg-[#121A2A] px-8 py-3 font-semibold text-white shadow transition hover:shadow-lg"
              >
                <Calendar className="h-4 w-4" />
                Book This Venue
              </Link>
              <button
                onClick={() => router.push("/venues")}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-8 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                View All Venues
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
