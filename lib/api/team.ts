import axiosInstance from "./axios-instance";
import { API } from "./endpoints";

export interface Team {
  _id: string;
  sport: string;
  name: string;
  location: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  avatar: string;
  members: number;
  maxPlayers: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  memberIds?: string[];
  phone?: string;
}

export async function getTeams() {
  const res = await axiosInstance.get(API.TEAMS.ALL);
  return res.data.data as Team[];
}

export async function getTeamById(id: string) {
  const res = await axiosInstance.get(API.TEAMS.BY_ID(id));
  return res.data.data as Team;
}

export async function getMyTeams() {
  const res = await axiosInstance.get(API.TEAMS.MY_TEAMS);
  return res.data.data as Team[];
}

export async function leaveTeam(token: string, teamId: string) {
  const res = await axiosInstance.post(API.TEAMS.LEAVE(teamId), {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
