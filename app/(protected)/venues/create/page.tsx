"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, Check } from "lucide-react";
import { handleCreateVenue } from "@/lib/actions/venue-action";

const FACILITIES = [
  "Parking Available", "Showers", "Changing Rooms", "Floodlights",
  "Refreshments", "Equipment Rental", "WiFi", "Scoreboard", "Spectator Seating",
];

export default function CreateVenuePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [photos, setPhotos] = useState<{ file: File; url: string }[]>([]);
  const [qrPreview, setQrPreview] = useState<string | null>(null);
  const qrFiles = useRef<File[]>([]);
  const photoRef = useRef<HTMLInputElement>(null);
  const qrRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: "",
    ownerName: "",
    description: "",
    address: "",
    googleMapsLink: "",
    phone: "",
    email: "",
    city: "",
    standardPrice: "",
    weekendPrice: "",
    nightPrice: "",
    discount: "",
    openingTime: "6am",
    closingTime: "10pm",
    facilities: [] as string[],
  });

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: "photo" | "qr") => {
    const files = e.target.files;
    if (!files?.length) return;
    if (type === "photo") {
      const items = Array.from(files).slice(0, 5 - photos.length).map((f) => ({
        file: f,
        url: URL.createObjectURL(f),
      }));
      setPhotos((prev) => [...prev, ...items]);
    } else {
      qrFiles.current = [files[0]];
      setQrPreview(URL.createObjectURL(files[0]));
    }
    e.target.value = "";
  };

  const toggleFacility = (f: string) => {
    setForm((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(f)
        ? prev.facilities.filter((x) => x !== f)
        : [...prev.facilities, f],
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("description", form.description);
    fd.append("sport", "Futsal");
    fd.append("city", form.city);
    fd.append("location", form.address);
    fd.append("pricePerHour", form.standardPrice);
    form.facilities.forEach((f) => fd.append("amenities", f));
    photos.forEach((p) => fd.append("images", p.file));
    const result = await handleCreateVenue(fd);
    setSubmitting(false);
    if (result.success) {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="rounded-2xl border bg-white p-10 text-center shadow-sm max-w-md">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
            <Check className="h-7 w-7 text-green-600" />
          </div>
          <h2 className="mt-5 text-2xl font-bold text-gray-900">Venue Submitted!</h2>
          <p className="mt-2 text-gray-500">Your venue is now live and available for bookings.</p>
          <button
            onClick={() => router.push("/venues")}
            className="mt-8 rounded-xl bg-[#121A2A] px-6 py-3 font-semibold text-white shadow transition hover:shadow-lg"
          >
            View Venues
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative overflow-hidden bg-[#121A2A] px-4 py-12 text-white">
        <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold md:text-4xl">List Your Futsal Venue</h1>
          <p className="mt-3 text-blue-100">Share your venue with players in your area and increase bookings</p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8 md:px-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-xl font-bold text-gray-900">Venue Information</h2>
          <p className="mt-1 text-sm text-gray-500">Fill in the details about your futsal venue. All fields are required unless marked optional.</p>

          <div className="mt-8 space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Venue Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="e.g. Urban Futsal Arena"
                    className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Owner/Manager Name</label>
                  <input
                    type="text"
                    value={form.ownerName}
                    onChange={(e) => update("ownerName", e.target.value)}
                    placeholder="Your name"
                    className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Venue Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                    placeholder="Describe your venue, its unique features, and what makes it special..."
                    rows={4}
                    className="mt-1 w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Venue Photos</label>
                  <div className="mt-2 flex flex-wrap gap-3">
                    {photos.map((p, i) => (
                      <div key={i} className="relative h-24 w-24 overflow-hidden rounded-xl border">
                        <img src={p.url} alt="" className="h-full w-full object-cover" />
                        <button
                          onClick={() => setPhotos((prev) => prev.filter((_, j) => j !== i))}
                          className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                    {photos.length < 5 && (
                      <label className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-300 text-gray-400 hover:border-blue-500 hover:text-blue-500">
                        <Upload className="h-6 w-6" />
                        <input ref={photoRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFileSelect(e, "photo")} />
                      </label>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-gray-400">Upload up to 5 photos. Supported formats: JPG, PNG, WebP.</p>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900">Venue Location</h3>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Enter venue address</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => update("address", e.target.value)}
                    placeholder="Enter your venue's address"
                    className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Paste Google Maps link (optional)</label>
                  <input
                    type="url"
                    value={form.googleMapsLink}
                    onChange={(e) => update("googleMapsLink", e.target.value)}
                    placeholder="https://maps.google.com/..."
                    className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <p className="text-xs text-gray-400">This will be used to help players find your venue.</p>
              </div>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="e.g. 9841234567"
                    className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="e.g. venue@example.com"
                    className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => update("city", e.target.value)}
                    placeholder="e.g. Kathmandu"
                    className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900">Pricing Information (in NPR)</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Standard Price (per hour)</label>
                  <div className="relative mt-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">रू</span>
                    <input
                      type="number"
                      value={form.standardPrice}
                      onChange={(e) => update("standardPrice", e.target.value)}
                      placeholder="e.g. 1500"
                      className="w-full rounded-xl border border-gray-300 px-8 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Weekend Price (optional)</label>
                  <div className="relative mt-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">रू</span>
                    <input
                      type="number"
                      value={form.weekendPrice}
                      onChange={(e) => update("weekendPrice", e.target.value)}
                      placeholder="e.g. 2000"
                      className="w-full rounded-xl border border-gray-300 px-8 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Night Price (optional)</label>
                  <div className="relative mt-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">रू</span>
                    <input
                      type="number"
                      value={form.nightPrice}
                      onChange={(e) => update("nightPrice", e.target.value)}
                      placeholder="e.g. 1800"
                      className="w-full rounded-xl border border-gray-300 px-8 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Offer a discount or promotion</label>
                <input
                  type="text"
                  value={form.discount}
                  onChange={(e) => update("discount", e.target.value)}
                  placeholder="e.g. 10% off on first booking"
                  className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Opening Hours</label>
                <div className="mt-2 flex gap-4">
                  <div className="flex-1">
                    <label className="text-xs text-gray-500">Opening Time</label>
                    <input
                      type="text"
                      value={form.openingTime}
                      onChange={(e) => update("openingTime", e.target.value)}
                      placeholder="6am"
                      className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-500">Closing Time</label>
                    <input
                      type="text"
                      value={form.closingTime}
                      onChange={(e) => update("closingTime", e.target.value)}
                      placeholder="10pm"
                      className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-400">Format: 6am-10pm</p>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700">Facilities</label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {FACILITIES.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => toggleFacility(f)}
                      className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                        form.facilities.includes(f)
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-gray-200 text-gray-600 hover:border-blue-300"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900">Payment QR Code</h3>
              <p className="mt-1 text-sm text-gray-500">
                Upload your payment QR code (eSewa, Khalti, bank, etc.) so teams can pay for match bookings directly to your account.
              </p>
              {qrPreview ? (
                <div className="relative mt-4 inline-block">
                  <img src={qrPreview} alt="QR Code" className="h-32 w-32 rounded-xl border object-cover" />
                  <button onClick={() => setQrPreview(null)} className="absolute -right-2 -top-2 rounded-full bg-red-500 p-0.5 text-white">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="mt-4 flex h-32 w-full cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-300 text-gray-400 hover:border-blue-500 hover:text-blue-500">
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8" />
                    <p className="mt-2 text-sm font-medium">Upload Payment QR Code</p>
                  </div>
                  <input ref={qrRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileSelect(e, "qr")} />
                </label>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting || !form.name || !form.city || !form.standardPrice}
              className="w-full rounded-xl bg-[#121A2A] py-4 text-lg font-semibold text-white shadow transition hover:shadow-lg disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Venue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
