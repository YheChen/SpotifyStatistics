"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LogOut, Music2, User } from "lucide-react";
import type { Track, Artist } from "@/lib/types";
import TrackCard from "@/components/track-card";
import ArtistCard from "@/components/artist-card";

export default function Dashboard() {
  const router = useRouter();
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [topArtists, setTopArtists] = useState<Artist[]>([]);
  const [timeRange, setTimeRange] = useState("medium_term");
  const [limit, setLimit] = useState("10");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("tracks");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const trackRes = await fetch(
          `/api/spotify/top?type=tracks&limit=${limit}&time_range=${timeRange}`
        );
        if (
          !trackRes.ok ||
          !trackRes.headers.get("content-type")?.includes("application/json")
        ) {
          throw new Error("Invalid track response");
        }
        const tracksData = await trackRes.json();
        if (!Array.isArray(tracksData)) {
          throw new Error("Expected tracksData to be an array");
        }
        setTopTracks(tracksData);

        const artistRes = await fetch(
          `/api/spotify/top?type=artists&limit=${limit}&time_range=${timeRange}`
        );
        if (
          !artistRes.ok ||
          !artistRes.headers.get("content-type")?.includes("application/json")
        ) {
          throw new Error("Invalid artist response");
        }
        const artistsData = await artistRes.json();
        if (!Array.isArray(artistsData)) {
          throw new Error("Expected artistsData to be an array");
        }
        setTopArtists(artistsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        router.push("/?error=invalid_response");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange, limit, router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="container mx-auto py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Music2 className="h-8 w-8 text-green-500" />
            <span className="text-xl font-bold">Spotify Stats</span>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Spotify Stats</h1>

        <Tabs
          defaultValue="tracks"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <div className="flex flex-col md:flex-row gap-4 mb-8 items-start md:items-center justify-between">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger
                value="tracks"
                className="data-[state=active]:bg-green-500 data-[state=active]:text-black"
              >
                <Music2 className="h-4 w-4 mr-2" /> Top Tracks
              </TabsTrigger>
              <TabsTrigger
                value="artists"
                className="data-[state=active]:bg-green-500 data-[state=active]:text-black"
              >
                <User className="h-4 w-4 mr-2" /> Top Artists
              </TabsTrigger>
            </TabsList>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short_term">Last 4 Weeks</SelectItem>
                  <SelectItem value="medium_term">Last 6 Months</SelectItem>
                  <SelectItem value="long_term">All Time</SelectItem>
                </SelectContent>
              </Select>

              <Select value={limit} onValueChange={setLimit}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Limit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">Top 10</SelectItem>
                  <SelectItem value="50">Top 50</SelectItem>
                  <SelectItem value="100">Top 100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="tracks">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {topTracks.map((track, index) => (
                  <TrackCard key={track.id} track={track} rank={index + 1} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="artists">
            {loading ? null : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {topArtists.map((artist, index) => (
                  <ArtistCard
                    key={artist.id}
                    artist={artist}
                    rank={index + 1}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
