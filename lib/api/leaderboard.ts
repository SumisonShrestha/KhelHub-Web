import axiosInstance from "./axios-instance";
import { API } from "./endpoints";

export interface LeaderboardEntry {
  _id: string;
  teamName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  pts: number;
}

export async function getLeaderboard() {
  const res = await axiosInstance.get(API.LEADERBOARD.ALL);
  return res.data.data as LeaderboardEntry[];
}
