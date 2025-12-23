"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Location } from "@/types/location";
import {DisplayPrayerTimes, PrayerName} from "@/types/paryerTime";
import { useDebounce } from "@uidotdev/usehooks";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import PrayerTimeCard from "./_components/PrayerTimeCard";

const getUserLocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error("Geolocation is not supported by your browser."));
    }
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const getAddressFromCoords = async (latitude: number, longitude: number) => {
  try {
    // Make a fetch request to the Nominatim API
    // const response = await fetch(
    //   `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
    // );
    if (!latitude || !longitude) {
      throw new Error("Invalid coordinates provided.");
    }
    const response = await fetch(
      `https://us1.locationiq.com/v1/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=ar&key=${process.env.NEXT_PUBLIC_LOCATION_API_KEY}`,
      { method: "GET", headers: { accept: "application/json" } }
    );
    if (!response.ok) {
      throw new Error("Unable to fetch address.");
    }

    const data = await response.json();
    console.log(data, "data from nominatim");
    // The full address is in the 'display_name' property
    if (data) {
      return data;
    } else {
      throw new Error("Address not found for these coordinates.");
    }
  } catch (error) {
    console.error("Error in getAddressFromCoords:", error);
    // Re-throw the error to be caught by the caller
    throw error;
  }
};

const PrayerTimesPage = () => {
  const t = useTranslations("PrayerTimes");
  const [location, setLocation] = useState<Location | null>(null);
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [isListOpen, setIsListOpen] = useState(false);
  const [prayerTimes, setPrayerTimes] = useState<DisplayPrayerTimes | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const formattedDate = useMemo(
    () =>
      new Date().toLocaleDateString("ar-EG", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedValue = useDebounce(searchQuery, 300);
  const displayedPrayerTimes = prayerTimes
    ? Object.entries(prayerTimes).filter(([name]) =>
        ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].includes(name)
      )
    : [];
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setIsListOpen(true);
  };
  const handleSelectLocation = (selectedLocation: Location) => {
    setLocation(selectedLocation);
    setIsListOpen(false);
    setSearchQuery("");
    setSuggestions([]);
  };

  const handleGetCurrentLocation = async () => {
    try {
      setLoading(true);
      const position = await getUserLocation();
      const { latitude, longitude } = position.coords;
      console.log({ latitude, longitude }, "coords");
      const address = await getAddressFromCoords(latitude, longitude);
      console.log(address, "fetched address");
      setLocation(address);
    } catch (err) {
      console.error("Error getting location:", err);
      // setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrayerTimes = useCallback(async (lat: string, lon: string) => {
    try {
      const date = new Date();
      const formattedDate = `${date.getDate()}-${
        date.getMonth() + 1
      }-${date.getFullYear()}`;
      const url = `https://api.aladhan.com/v1/timings/${formattedDate}?latitude=${lat}&longitude=${lon}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch prayer times");
      }
      const data = await response.json();
      console.log(data, "prayer times data");
      setPrayerTimes(data.data.timings);
    } catch (error) {
      console.error("Error fetching prayer times:", error);
    }
  }, []);

  useEffect(() => {
    if (debouncedValue.trim().length < 3) return;
    const fetchLocation = async () => {
      try {
        const url = `https://us1.locationiq.com/v1/autocomplete?q=${debouncedValue.trim()}&accept-language=ar&key=${
          process.env.NEXT_PUBLIC_LOCATION_API_KEY
        }`;
        const response = await fetch(url, {
          method: "GET",
          headers: { accept: "application/json" },
        });
        if (response.status !== 200) {
          throw new Error("Failed to fetch location");
        }
        const data = await response.json();
        console.log(data, "location data");
        setSuggestions(data);
      } catch (err) {
        console.error("Error fetching location:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    };

    fetchLocation();
  }, [debouncedValue]);

  useEffect(() => {
    if (location) {
      fetchPrayerTimes(location.lat, location.lon);
    }
  }, [location, fetchPrayerTimes]);

  return (
    <div>
      <div className="max-w-7xl mx-auto p-6 ">
        <div className="text-center py-10 rounded">
          <h2 className="font-bold text-5xl mb-4 font-tajawal">{t("title")}</h2>
          <p className="">{formattedDate}</p>
        </div>
        <div className="bg-card p-4">
          <div className="flex items-center gap-2">
            <Input
              onChange={handleSearchChange}
              value={searchQuery}
              className="w-full"
              placeholder={t("placeholder")}
            />
            <Button
              className="px-2 py-3 cursor-pointer"
              onClick={handleGetCurrentLocation}
            >
              {t("button")}
            </Button>
          </div>
          {!loading && suggestions.length > 0 && isListOpen && (
            <div className="mt-2 max-h-60 overflow-y-auto">
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.display_name}
                  className="p-2 hover:bg-accent cursor-pointer"
                  onClick={() => handleSelectLocation(suggestion)}
                >
                  {suggestion.display_name}
                </div>
              ))}
            </div>
          )}
          {!loading && location && (
            <div className="mt-4 flex gap-3">
              <h3 className="font-semibold mb-2">{t("currentLocation")} :</h3>
              <p>{location.address.city}</p>
            </div>
          )}
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500 mt-2"> {error}</p>}
        </div>
        <div className="mt-6 space-y-4">
          {prayerTimes &&
            displayedPrayerTimes.map(([name, time]) => (
              <PrayerTimeCard key={name} name={name as PrayerName} time={time} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default PrayerTimesPage;
