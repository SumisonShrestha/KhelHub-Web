export const API = {
  AUTH: {
    REGISTER: "/api/v1/auth/register",
    LOGIN: "/api/v1/auth/login",
    WHOAMI: "/api/v1/auth/whoami",
    UPDATE: "/api/v1/auth/update",
    CHANGE_PASSWORD: "/api/v1/auth/change-password",
    FORGOT_PASSWORD: "/api/v1/auth/forgot-password",
    RESET_PASSWORD: "/api/v1/auth/reset-password",
  },

  ADMIN: {
    USERS: "/api/v1/admin/users",
    USER_BY_ID: (id: string) => `/api/v1/admin/users/${id}`,
  },

  VENUES: {
    ALL: "/api/v1/venues",
    BY_ID: (id: string) => `/api/v1/venues/${id}`,
  },

  BOOKINGS: {
    ALL: "/api/v1/bookings",
    CANCEL: (id: string) => `/api/v1/bookings/${id}/cancel`,
  },

  TEAMS: {
    ALL: "/api/v1/teams",
    BY_ID: (id: string) => `/api/v1/teams/${id}`,
    MY_TEAMS: "/api/v1/teams/my-teams",
    LEAVE: (id: string) => `/api/v1/teams/${id}/leave`,
  },

  LEADERBOARD: {
    ALL: "/api/v1/leaderboard",
    BY_ID: (id: string) => `/api/v1/leaderboard/${id}`,
  },

  RATINGS: {
    BY_VENUE: (venueId: string) => `/api/v1/ratings/venue/${venueId}`,
    CREATE: "/api/v1/ratings",
  },
};