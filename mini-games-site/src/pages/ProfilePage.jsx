// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import { getCurrentUser, logout } from "../auth";
import GeometricBackground from "../components/GeometricBackground";
import { Link } from "react-router-dom";

const API_BASE = "http://localhost:5000";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [country, setCountry] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const authUser = getCurrentUser();
  const token =
    typeof window !== "undefined"
      ? window.localStorage.getItem("authToken")
      : null;

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError("You must be logged in to view your profile.");
      return;
    }

    async function fetchProfile() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`${API_BASE}/api/profile/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Failed to load profile");
          setLoading(false);
          return;
        }

        setProfile(data);
        setName(data.name || "");
        setUsername(data.username || "");
        setBio(data.bio || "");
        setCountry(data.country || "");
        setLoading(false);
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError("Network error while loading profile");
        setLoading(false);
      }
    }

    fetchProfile();
  }, [token]);

  async function handleSaveProfile(e) {
    e.preventDefault();
    if (!token) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const res = await fetch(`${API_BASE}/api/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, username, bio, country }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to update profile");
        setSaving(false);
        return;
      }

      setProfile(data);
      setSuccess("Profile updated successfully.");

      // Also sync display name in localStorage authUser for in-game use
      const stored = window.localStorage.getItem("authUser");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          parsed.name = data.name;
          window.localStorage.setItem("authUser", JSON.stringify(parsed));
        } catch {
          // ignore
        }
      }

      setSaving(false);
    } catch (err) {
      setError("Network error while saving profile");
      setSaving(false);
    }
  }

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setAvatarUploading(true);
      setError("");
      setSuccess("");

      const res = await fetch(`${API_BASE}/api/profile/avatar`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to upload avatar");
        setAvatarUploading(false);
        return;
      }

      setProfile((prev) =>
        prev ? { ...prev, avatarUrl: data.avatarUrl } : prev
      );
      setSuccess("Avatar updated successfully.");
      setAvatarUploading(false);
    } catch (err) {
      setError("Network error while uploading avatar");
      setAvatarUploading(false);
    }
  }

  function handleLogout() {
    logout();
    window.location.href = "/login";
  }

  const createdAtText = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString()
    : "";

  const avatarSrc = profile?.avatarUrl
    ? `${API_BASE}${profile.avatarUrl}`
    : "https://ui-avatars.com/api/?background=0F172A&color=E5E7EB&name=" +
      encodeURIComponent(profile?.name || authUser?.name || "Gamer");

  if (!authUser && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <GeometricBackground />
        <div className="w-full max-w-md relative z-10">
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 mb-2">
                Not logged in
              </h1>
              <p className="text-slate-400 mb-6">
                Please log in to view your gamer profile.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-3 text-sm font-medium text-white shadow-lg hover:from-purple-400 hover:to-indigo-400 transition-all duration-200 transform hover:scale-[1.02]"
              >
                Go to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <GeometricBackground />
      <div className="relative z-10 px-4 py-10">
        <div className="w-full max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 mb-2">
                  Player Profile
                </h1>
                <p className="text-slate-400">
                  Manage your gamer identity across Senjhon Gaming.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800 transition-all duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
                <Link
                  to="/"
                  className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800 transition-all duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Home
                </Link>
              </div>
            </div>
          </div>

          {/* Messages */}
          {(error || success) && (
            <div className="mb-6">
              {error && (
                <div className="rounded-lg border border-rose-500/30 bg-rose-950/40 backdrop-blur-sm p-4 flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-400 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-rose-200">{error}</p>
                </div>
              )}
              {success && (
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/40 backdrop-blur-sm p-4 flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-emerald-200">{success}</p>
                </div>
              )}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/50 rounded-2xl p-12 flex items-center justify-center">
              <div className="flex flex-col items-center">
                <svg className="animate-spin h-8 w-8 text-purple-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-sm text-slate-300">Loading profile...</p>
              </div>
            </div>
          )}

          {!loading && profile && (
            <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
              {/* Left: Profile Card */}
              <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-xl">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="relative group">
                      <img
                        src={avatarSrc}
                        alt={profile.name}
                        className="h-28 w-28 rounded-full border-2 border-purple-500/50 object-cover shadow-lg transition-all duration-300 group-hover:border-purple-400"
                      />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-t from-slate-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-2">
                        <span className="text-xs text-white">Change</span>
                      </div>
                    </div>
                    <label className="absolute bottom-0 right-0 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 border-2 border-slate-900 shadow-md hover:from-purple-400 hover:to-indigo-400 transition-all duration-200">
                      {avatarUploading ? (
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleAvatarChange}
                      />
                    </label>
                  </div>

                  {/* Basic info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-2xl font-bold text-white">
                        {profile.username || "New Gamer"}
                      </h2>
                      <span className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-500/20 to-indigo-500/20 px-2.5 py-0.5 text-xs font-medium text-purple-300 border border-purple-500/30">
                        Gamer Tag
                      </span>
                    </div>
                    <p className="text-slate-300 mb-2">
                      {profile.name || "No display name set"}
                    </p>
                    <div className="flex items-center text-xs text-slate-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Member since {createdAtText || "N/A"}
                    </div>
                  </div>
                </div>

                {/* Status badges */}
                <div className="mt-6 flex flex-wrap gap-2">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-800/70 px-3 py-1.5 border border-slate-700/50">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        profile.online ? "bg-emerald-400" : "bg-slate-500"
                      }`}
                    />
                    <span className="text-xs text-slate-300">
                      {profile.online ? "Online" : "Online"}
                    </span>
                  </div>

                  <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-800/70 px-3 py-1.5 border border-slate-700/50">
                    <span className="text-slate-300">🌍</span>
                    <span className="text-xs text-slate-300">{profile.country || "Unknown region"}</span>
                  </div>

                  <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-800/70 px-3 py-1.5 border border-slate-700/50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs text-slate-300 truncate max-w-[180px]">
                      {profile.email}
                    </span>
                  </div>
                </div>

                {/* Bio */}
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-slate-200 mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    About me
                  </h3>
                  <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                    <p className="text-sm text-slate-300 whitespace-pre-line">
                      {bio || "No bio yet. Tell other players who you are."}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-6 grid grid-cols-3 gap-3">
                  <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50 text-center">
                    <p className="text-2xl font-bold text-purple-400">0</p>
                    <p className="text-xs text-slate-400">Games Played</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50 text-center">
                    <p className="text-2xl font-bold text-indigo-400">0</p>
                    <p className="text-xs text-slate-400">High Scores</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50 text-center">
                    <p className="text-2xl font-bold text-emerald-400">0</p>
                    <p className="text-xs text-slate-400">Achievements</p>
                  </div>
                </div>
              </div>

              {/* Right: Edit form */}
              <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center mb-6">
                  <h3 className="text-lg font-semibold text-white">Edit Profile</h3>
                  <div className="ml-auto flex bg-slate-800/50 rounded-lg p-1">
                    <button
                      onClick={() => setActiveTab("profile")}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                        activeTab === "profile"
                          ? "bg-slate-700 text-white"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => setActiveTab("settings")}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                        activeTab === "settings"
                          ? "bg-slate-700 text-white"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Settings
                    </button>
                  </div>
                </div>

                {activeTab === "profile" && (
                  <form onSubmit={handleSaveProfile} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Gamer tag (username)
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-lg bg-slate-800/50 border border-slate-600/50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyDown={(e) => {
                          // Allow space key in username
                          if (e.key === ' ') {
                            e.stopPropagation();
                          }
                        }}
                        placeholder="e.g. ShadowKnight, SenjhonPro"
                      />
                      <p className="mt-1.5 text-xs text-slate-400">
                        This is shown on leaderboards and scoreboards.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        Display name
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-lg bg-slate-800/50 border border-slate-600/50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => {
                          // Allow space key in name
                          if (e.key === ' ') {
                            e.stopPropagation();
                          }
                        }}
                        placeholder="Your real or preferred name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Bio / About me
                      </label>
                      <textarea
                        className="w-full min-h-[100px] rounded-lg bg-slate-800/50 border border-slate-600/50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        onKeyDown={(e) => {
                          // Allow space key in bio
                          if (e.key === ' ') {
                            e.stopPropagation();
                          }
                        }}
                        maxLength={200}
                        placeholder="Short description about you, your favorite games, or play style."
                      />
                      <div className="mt-1.5 flex justify-between items-center">
                        <p className="text-xs text-slate-400">
                          Tell other players about yourself
                        </p>
                        <span className="text-xs text-slate-500">
                          {bio.length}/200
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Country / Region
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-lg bg-slate-800/50 border border-slate-600/50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        onKeyDown={(e) => {
                          // Allow space key in country
                          if (e.key === ' ') {
                            e.stopPropagation();
                          }
                        }}
                        placeholder="e.g. Sri Lanka"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold shadow-lg hover:from-purple-400 hover:to-indigo-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {saving ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </span>
                      ) : (
                        "Save changes"
                      )}
                    </button>
                  </form>
                )}

                {activeTab === "settings" && (
                  <div className="space-y-5">
                    <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/30">
                      <h4 className="text-sm font-medium text-white mb-2">Email Preferences</h4>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between cursor-pointer">
                          <span className="text-sm text-slate-300">Game updates and news</span>
                          <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900">
                            <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1"></span>
                          </div>
                        </label>
                        <label className="flex items-center justify-between cursor-pointer">
                          <span className="text-sm text-slate-300">New high score notifications</span>
                          <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-purple-500 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900">
                            <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6"></span>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/30">
                      <h4 className="text-sm font-medium text-white mb-2">Privacy Settings</h4>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between cursor-pointer">
                          <span className="text-sm text-slate-300">Show profile to other players</span>
                          <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-purple-500 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900">
                            <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6"></span>
                          </div>
                        </label>
                        <label className="flex items-center justify-between cursor-pointer">
                          <span className="text-sm text-slate-300">Display online status</span>
                          <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-purple-500 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900">
                            <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6"></span>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/30">
                      <h4 className="text-sm font-medium text-white mb-2">Account Actions</h4>
                      <div className="space-y-3">
                        <button className="w-full text-left px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-sm text-slate-300 hover:bg-slate-800 transition-colors duration-200 flex items-center justify-between">
                          <span>Change password</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                        <button className="w-full text-left px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-sm text-slate-300 hover:bg-slate-800 transition-colors duration-200 flex items-center justify-between">
                          <span>Download my data</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                        <button className="w-full text-left px-3 py-2 rounded-lg bg-rose-900/30 border border-rose-800/50 text-sm text-rose-300 hover:bg-rose-900/50 transition-colors duration-200 flex items-center justify-between">
                          <span>Delete account</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <button className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold shadow-lg hover:from-purple-400 hover:to-indigo-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 transform hover:scale-[1.02]">
                      Save settings
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}