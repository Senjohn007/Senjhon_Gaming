// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import { getCurrentUser, logout } from "../auth";

const API_BASE = "http://localhost:5000";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

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
        console.error("Profile fetch error:", err); // ADD THIS
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
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-6 max-w-md w-full text-center">
          <h1 className="text-xl font-semibold mb-2">Not logged in</h1>
          <p className="text-sm text-slate-300 mb-4">
            Please log in to view your gamer profile.
          </p>
          <a
            href="/login"
            className="inline-flex items-center justify-center rounded-md bg-purple-500 px-4 py-2 text-sm font-medium hover:bg-purple-400"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex justify-center px-4 py-10">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-purple-300">
              Player Profile
            </h1>
            <p className="text-sm text-slate-400">
              Manage your gamer identity across Senjhon Gaming.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="mt-3 md:mt-0 inline-flex items-center rounded-md border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800"
          >
            Logout
          </button>
        </div>

        {/* Messages */}
        {(error || success) && (
          <div className="mb-4">
            {error && (
              <div className="rounded-md border border-rose-500/60 bg-rose-950/40 px-3 py-2 text-sm text-rose-200">
                {error}
              </div>
            )}
            {success && (
              <div className="mt-2 rounded-md border border-emerald-500/60 bg-emerald-950/40 px-3 py-2 text-sm text-emerald-200">
                {success}
              </div>
            )}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex items-center justify-center">
            <p className="text-sm text-slate-300">Loading profile...</p>
          </div>
        )}

        {!loading && profile && (
          <div className="grid gap-6 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
            {/* Left: Avatar + status + meta */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="relative">
                  <img
                    src={avatarSrc}
                    alt={profile.name}
                    className="h-24 w-24 rounded-full border-2 border-purple-500/70 object-cover shadow-lg"
                  />
                  <label className="absolute bottom-0 right-0 inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-slate-900 border border-slate-700 shadow-md hover:bg-slate-800">
                    <span className="text-[10px] text-slate-200">
                      {avatarUploading ? "..." : "✏️"}
                    </span>
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
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold">
                      {profile.username || "New Gamer"}
                    </h2>
                    <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-300">
                      Gamer Tag
                    </span>
                  </div>
                  <p className="text-sm text-slate-400">
                    {profile.name || "No display name set"}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Member since {createdAtText || "N/A"}
                  </p>
                </div>
              </div>

              {/* Status + country */}
              <div className="mt-4 flex flex-wrap gap-3 text-xs">
                <div className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-3 py-1">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      profile.online ? "bg-emerald-400" : "bg-slate-500"
                    }`}
                  />
                  <span>
                    {profile.online ? "Online" : "Offline"}
                  </span>
                </div>

                <div className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-3 py-1">
                  <span className="text-slate-300">🌍</span>
                  <span>{profile.country || "Unknown region"}</span>
                </div>

                <div className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-3 py-1">
                  <span className="text-slate-300">📧</span>
                  <span className="truncate max-w-[180px]">
                    {profile.email}
                  </span>
                </div>
              </div>

              {/* Bio */}
              <div className="mt-5">
                <h3 className="text-sm font-semibold text-slate-200 mb-1.5">
                  About me
                </h3>
                <p className="text-sm text-slate-300 whitespace-pre-line">
                  {bio || "No bio yet. Tell other players who you are."}
                </p>
              </div>
            </div>

            {/* Right: Edit form */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-slate-200 mb-3">
                Edit profile
              </h3>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Gamer tag (username)
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-md bg-slate-950/70 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. ShadowKnight, SenjhonPro"
                  />
                  <p className="mt-1 text-[11px] text-slate-400">
                    This is shown on leaderboards and scoreboards.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Display name
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-md bg-slate-950/70 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your real or preferred name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Bio / About me
                  </label>
                  <textarea
                    className="w-full min-h-[80px] rounded-md bg-slate-950/70 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    maxLength={200}
                    placeholder="Short description about you, your favorite games, or play style."
                  />
                  <div className="mt-1 flex justify-end text-[11px] text-slate-500">
                    {bio.length}/200
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Country / Region
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-md bg-slate-950/70 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. Sri Lanka"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full mt-2 rounded-md bg-gradient-to-r from-purple-500 to-indigo-500 py-2 text-sm font-semibold shadow-lg hover:from-purple-400 hover:to-indigo-400 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
