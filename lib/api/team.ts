import axiosInstance from "./axios-instance";
import { API } from "./endpoints";

export interface Team {
  _id: string;
  name: string;
  location: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  avatar: string;
  members: number;
  createdAt: string;
  updatedAt: string;
}

export async function getTeams() {
  const res = await axiosInstance.get(API.TEAMS.ALL);
  return res.data.data as Team[];
}

export async function getTeamById(id: string) {
  const res = await axiosInstance.get(API.TEAMS.BY_ID(id));
  return res.data.data as Team;
}
