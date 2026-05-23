import React from "react";
import * as Icons from "lucide-react";

export interface ProfileSettingsScreenProps {
  state: string;
}

/**
 * States:
 * - default: Displays the list of profile settings sections and account information.
 * - editing: The profile information section is in edit mode, allowing text changes and image updates.
 * - socialAccounts: Shows connected social accounts with platform details, metrics, and connection management options.
 */
const ProfileSettingsScreen: React.FC<ProfileSettingsScreenProps> = ({ state }) => {
  const isEditing = state === "editing";
  const isSocialAccounts = state === "socialAccounts";

  const renderSidebar = () => (
    <aside className="hidden md:flex w-64 flex-col bg-white border-r border-[#E8E4F0] h-screen fixed left-0 top-0 z-30">
      <div className="flex items-center gap-3 p-6 mb-4">
        <div className="w-8 h-8 rounded-[10px] bg-[#5B4FE9] flex items-center justify-center">
          <Icons.Hexagon className="w-4 h-4 text-white" />
        </div>
        <span className="text-[15px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E] tracking-[-0.01em]">
          CreatorX
        </span>
      </div>

      <nav className="space-y-1 flex-1 px-3">
        {[
          { icon: Icons.Compass, label: "Explore", active: false },
          { icon: Icons.Users, label: "Community", active: false },
          { icon: Icons.Calendar, label: "Events", active: false },
          { icon: Icons.Wallet, label: "Wallet", active: false },
          { icon: Icons.User, label: "Profile", active: true, badge: 3 },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-left transition-colors ${
                item.active
                  ? "bg-[#5B4FE9]/[0.06] text-[#5B4FE9]"
                  : "text-[#6B6B7B] hover:bg-[#FBF9F6]"
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={1.5} />
              <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-medium">{item.label}</span>
              {item.badge && (
                <span className="ml-auto px-2 py-0.5 rounded-full bg-[#E07A5F] text-[10px] font-['Plus_Jakarta_Sans'] font-bold text-white">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#E8E4F0]">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-[#FBF9F6] overflow-hidden">
             <img
              src="./images/creator-avatar.png"
              alt="Creator profile avatar"
              data-context="Sidebar user avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <span className="block text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] truncate">Maya Chen</span>
            <span className="text-[10px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">@mayachencreates</span>
          </div>
          <Icons.Settings className="w-4 h-4 text-[#6B6B7B] cursor-pointer" />
        </div>
      </div>
    </aside>
  );

  const renderTopBar = () => (
    <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white border-b border-[#E8E4F0] ml-64">
      <div>
        <h1 className="text-[18px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">Settings</h1>
        <p className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">Manage your account preferences</p>
      </div>
      <div className="flex items-center gap-3">
        <button className="w-10 h-10 rounded-[10px] bg-[#FBF9F6] flex items-center justify-center relative">
          <Icons.Bell className="w-5 h-5 text-[#1A1A2E]" strokeWidth={1.5} />
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E07A5F]" />
        </button>
        <div className="w-9 h-9 rounded-full bg-[#FBF9F6] overflow-hidden border border-[#E8E4F0]">
           <img
            src="./images/creator-avatar.png"
            alt="Creator profile avatar"
            data-context="Top bar user avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );

  const renderSettingsNav = () => (
    <div className="hidden md:block w-64 shrink-0">
      <nav className="space-y-1 sticky top-24">
        {[
          { icon: Icons.User, label: "Profile Information", active: !isSocialAccounts },
          { icon: Icons.Shield, label: "KYC Verification", active: false },
          { icon: Icons.Link, label: "Connected Accounts", active: isSocialAccounts },
          { icon: Icons.CreditCard, label: "Payment Methods", active: false },
          { icon: Icons.Bell, label: "Notifications", active: false },
          { icon: Icons.Globe, label: "Language & Region", active: false },
          { icon: Icons.ShieldCheck, label: "Privacy & Security", active: false },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-[10px] text-left transition-colors ${
                item.active
                  ? "bg-[#5B4FE9]/[0.06] text-[#5B4FE9]"
                  : "text-[#6B6B7B] hover:bg-white hover:text-[#1A1A2E]"
              }`}
            >
              <Icon className="w-4 h-4" strokeWidth={1.5} />
              <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-medium">{item.label}</span>
            </button>
          );
        })}

        <div className="pt-4 mt-4 border-t border-[#E8E4F0]">
             <button className="w-full flex items-center gap-3 px-4 py-3 rounded-[10px] text-[#E07A5F] hover:bg-[#FFB4A2]/[0.08] transition-colors">
            <Icons.LogOut className="w-4 h-4" strokeWidth={1.5} />
            <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-medium">Sign out</span>
          </button>
        </div>
      </nav>
    </div>
  );

  const renderProfileContent = () => (
    <div className="flex-1 max-w-2xl">
      {/* Profile Header */}
      <div className="p-6 rounded-[16px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06] mb-6">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="relative shrink-0">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-[20px] bg-[#FBF9F6] overflow-hidden">
              <img
                src="./images/creator-avatar.png"
                alt="Your profile photo, young female creator with natural lighting, warm friendly expression"
                data-context="Profile settings avatar"
                className="w-full h-full object-cover"
              />
            </div>
            {isEditing && (
              <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#5B4FE9] flex items-center justify-center shadow-[0_2px_6px_rgba(91,79,233,0.20)] border-2 border-white">
                <Icons.Camera className="w-4 h-4 text-white" />
              </button>
            )}
          </div>

          <div className="flex-1 w-full">
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  defaultValue="Maya Chen"
                  className="w-full px-4 py-3 rounded-[12px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.08] text-[18px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E] outline-none"
                />
                <input
                  type="text"
                  defaultValue="@mayachencreates"
                  className="w-full px-4 py-3 rounded-[12px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.08] text-[14px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B] outline-none"
                />
                <div className="flex gap-3 pt-2">
                  <button className="flex-1 py-2.5 rounded-[12px] bg-[#E8E4F0] text-[14px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">
                    Cancel
                  </button>
                  <button className="flex-1 py-2.5 rounded-[12px] bg-[#5B4FE9] text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-white shadow-[0_2px_8px_rgba(91,79,233,0.16)]">
                    Save changes
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-[24px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E] mb-1">Maya Chen</h2>
                <p className="text-[14px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B] mb-4">@mayachencreates</p>
                <button className="flex items-center gap-2 px-4 py-2 rounded-[10px] bg-[#FBF9F6] text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E] hover:bg-[#E8E4F0]">
                  <Icons.Edit className="w-4 h-4" />
                  Edit profile
                </button>
              </>
            )}

            <div className="flex gap-6 mt-6">
              <div>
                <span className="block text-[20px] font-['Plus_Jakarta_Sans'] font-bold text-[#5B4FE9]">142K</span>
                <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0] uppercase tracking-wide">Followers</span>
              </div>
              <div>
                <span className="block text-[20px] font-['Plus_Jakarta_Sans'] font-bold text-[#5B4FE9]">4.8%</span>
                <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0] uppercase tracking-wide">Engagement</span>
              </div>
              <div>
                <span className="block text-[20px] font-['Plus_Jakarta_Sans'] font-bold text-[#5B4FE9]">12</span>
                <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0] uppercase tracking-wide">Campaigns</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
          <div className="p-6 rounded-[16px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06]">
             <h3 className="text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-4">
              Account Details
            </h3>
            <div className="space-y-4">
               <div>
                <label className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#6B6B7B] uppercase tracking-wider mb-2 block">Email</label>
                <div className="px-4 py-3 rounded-[12px] bg-[#FBF9F6] text-[14px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E]">
                  maya.creates@example.com
                </div>
              </div>
              <div>
                <label className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#6B6B7B] uppercase tracking-wider mb-2 block">Location</label>
                <div className="px-4 py-3 rounded-[12px] bg-[#FBF9F6] text-[14px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E]">
                  San Francisco, CA
                </div>
              </div>
            </div>
          </div>

           <div className="p-6 rounded-[16px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06]">
             <h3 className="text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-4">
              Notification Preferences
            </h3>
            <div className="space-y-4">
              {[
                { label: "Email notifications", enabled: true },
                { label: "Push notifications", enabled: true },
                { label: "SMS alerts", enabled: false },
              ].map((pref) => (
                <div key={pref.label} className="flex items-center justify-between">
                  <span className="text-[14px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E]">{pref.label}</span>
                  <div className={`w-11 h-6 rounded-full relative transition-colors ${pref.enabled ? "bg-[#5B4FE9]" : "bg-[#E8E4F0]"}`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${pref.enabled ? "right-1" : "left-1"}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
    </div>
  );

  const renderSocialAccountsContent = () => (
    <div className="flex-1 max-w-2xl">
      {/* Header Section */}
      <div className="p-6 rounded-[16px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06] mb-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-[12px] bg-[#5B4FE9]/[0.1] flex items-center justify-center shrink-0">
            <Icons.Link className="w-6 h-6 text-[#5B4FE9]" strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-[20px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E] mb-2">Connected Accounts</h2>
            <p className="text-[13px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B] leading-relaxed">
              Link your social media accounts to showcase your reach and get matched with relevant campaigns. Your metrics are automatically synced.
            </p>
          </div>
        </div>
      </div>

      {/* Connected Accounts List */}
      <div className="space-y-4">
        {/* Instagram - Connected (Primary) */}
        <div className="p-5 rounded-[16px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06]">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-[12px] bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] flex items-center justify-center">
                <Icons.Instagram className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[15px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">Instagram</h3>
                  <span className="px-2 py-0.5 rounded-full bg-[#5B4FE9]/[0.1] text-[10px] font-['Plus_Jakarta_Sans'] font-bold text-[#5B4FE9] uppercase tracking-wide">
                    Primary
                  </span>
                </div>
                <p className="text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">@mayachencreates</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#10B981]/[0.1]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-semibold text-[#10B981]">Connected</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="px-3 py-2.5 rounded-[10px] bg-[#FBF9F6]">
              <span className="block text-[18px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">142K</span>
              <span className="text-[10px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0] uppercase tracking-wide">Followers</span>
            </div>
            <div className="px-3 py-2.5 rounded-[10px] bg-[#FBF9F6]">
              <span className="block text-[18px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">4.8%</span>
              <span className="text-[10px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0] uppercase tracking-wide">Engagement</span>
            </div>
            <div className="px-3 py-2.5 rounded-[10px] bg-[#FBF9F6]">
              <span className="block text-[18px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">312</span>
              <span className="text-[10px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0] uppercase tracking-wide">Posts</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#E8E4F0]">
            <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0]">Last synced: 2 hours ago</span>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#E07A5F] hover:bg-[#FFB4A2]/[0.08] transition-colors">
              <Icons.Unlink className="w-3.5 h-3.5" strokeWidth={1.5} />
              Unlink
            </button>
          </div>
        </div>

        {/* YouTube - Connected */}
        <div className="p-5 rounded-[16px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06]">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-[12px] bg-[#FF0000] flex items-center justify-center">
                <Icons.Youtube className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-[15px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">YouTube</h3>
                <p className="text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">Maya Creates</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#10B981]/[0.1]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-semibold text-[#10B981]">Connected</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="px-3 py-2.5 rounded-[10px] bg-[#FBF9F6]">
              <span className="block text-[18px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">28.5K</span>
              <span className="text-[10px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0] uppercase tracking-wide">Subscribers</span>
            </div>
            <div className="px-3 py-2.5 rounded-[10px] bg-[#FBF9F6]">
              <span className="block text-[18px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">6.2%</span>
              <span className="text-[10px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0] uppercase tracking-wide">Engagement</span>
            </div>
            <div className="px-3 py-2.5 rounded-[10px] bg-[#FBF9F6]">
              <span className="block text-[18px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">87</span>
              <span className="text-[10px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0] uppercase tracking-wide">Videos</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#E8E4F0]">
            <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0]">Last synced: 5 hours ago</span>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#E07A5F] hover:bg-[#FFB4A2]/[0.08] transition-colors">
              <Icons.Unlink className="w-3.5 h-3.5" strokeWidth={1.5} />
              Unlink
            </button>
          </div>
        </div>

        {/* TikTok - Pending */}
        <div className="p-5 rounded-[16px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06]">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-[12px] bg-[#000000] flex items-center justify-center">
                <Icons.Music className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-[15px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">TikTok</h3>
                <p className="text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">@maya.creates</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F59E0B]/[0.1]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
              <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-semibold text-[#F59E0B]">Pending</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="px-3 py-2.5 rounded-[10px] bg-[#FBF9F6]">
              <span className="block text-[18px] font-['Plus_Jakarta_Sans'] font-bold text-[#9B96B0]">--</span>
              <span className="text-[10px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0] uppercase tracking-wide">Followers</span>
            </div>
            <div className="px-3 py-2.5 rounded-[10px] bg-[#FBF9F6]">
              <span className="block text-[18px] font-['Plus_Jakarta_Sans'] font-bold text-[#9B96B0]">--</span>
              <span className="text-[10px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0] uppercase tracking-wide">Engagement</span>
            </div>
            <div className="px-3 py-2.5 rounded-[10px] bg-[#FBF9F6]">
              <span className="block text-[18px] font-['Plus_Jakarta_Sans'] font-bold text-[#9B96B0]">--</span>
              <span className="text-[10px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0] uppercase tracking-wide">Videos</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#E8E4F0]">
            <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0]">Awaiting authorization</span>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#E07A5F] hover:bg-[#FFB4A2]/[0.08] transition-colors">
              <Icons.X className="w-3.5 h-3.5" strokeWidth={1.5} />
              Cancel
            </button>
          </div>
        </div>

        {/* Twitter/X - Disconnected */}
        <div className="p-5 rounded-[16px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06] border-dashed">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-[12px] bg-[#000000] flex items-center justify-center">
                <Icons.Twitter className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-[15px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">X (Twitter)</h3>
                <p className="text-[13px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0]">Not connected</p>
              </div>
            </div>
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-[10px] bg-[#5B4FE9] text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-white shadow-[0_2px_6px_rgba(91,79,233,0.16)] hover:bg-[#4B41D9] transition-colors">
              <Icons.Plus className="w-3.5 h-3.5" strokeWidth={2} />
              Connect
            </button>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-6 p-4 rounded-[12px] bg-[#5B4FE9]/[0.04] border border-[#5B4FE9]/[0.1]">
        <div className="flex items-start gap-3">
          <Icons.Info className="w-4 h-4 text-[#5B4FE9] shrink-0 mt-0.5" strokeWidth={1.5} />
          <p className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B] leading-relaxed">
            <span className="font-semibold text-[#1A1A2E]">Why connect accounts?</span> Brands use your social metrics to evaluate campaign fit. Connected accounts with verified metrics receive 3x more collaboration opportunities.
          </p>
        </div>
      </div>
    </div>
  );

  const renderBottomNav = () => (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-[#E8E4F0] z-40">
      <div className="flex items-center justify-around py-2 pb-6">
        <button className="flex flex-col items-center gap-1 px-3 py-1">
          <Icons.Compass className="w-5 h-5 text-[#9B96B0]" />
          <span className="text-[9px] font-['Plus_Jakarta_Sans'] font-medium text-[#9B96B0]">Explore</span>
        </button>
        <button className="flex flex-col items-center gap-1 px-3 py-1">
          <Icons.Users className="w-5 h-5 text-[#9B96B0]" />
          <span className="text-[9px] font-['Plus_Jakarta_Sans'] font-medium text-[#9B96B0]">Community</span>
        </button>
        <button className="flex flex-col items-center gap-1 px-3 py-1">
          <Icons.Calendar className="w-5 h-5 text-[#9B96B0]" />
          <span className="text-[9px] font-['Plus_Jakarta_Sans'] font-medium text-[#9B96B0]">Events</span>
        </button>
        <button className="flex flex-col items-center gap-1 px-3 py-1">
          <Icons.Wallet className="w-5 h-5 text-[#9B96B0]" />
          <span className="text-[9px] font-['Plus_Jakarta_Sans'] font-medium text-[#9B96B0]">Wallet</span>
        </button>
        <button className="flex flex-col items-center gap-1 px-3 py-1 relative">
          <Icons.User className="w-5 h-5 text-[#5B4FE9]" />
          <span className="text-[9px] font-['Plus_Jakarta_Sans'] font-semibold text-[#5B4FE9]">Profile</span>
          <div className="absolute top-0 right-1 w-4 h-4 rounded-full bg-[#E07A5F] flex items-center justify-center">
            <span className="text-[8px] font-['Plus_Jakarta_Sans'] font-bold text-white">3</span>
          </div>
        </button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#FBF9F6] font-['Plus_Jakarta_Sans'] relative flex flex-col md:flex-row">
      {renderSidebar()}

      {/* Main Content Wrapper */}
      <div className="md:ml-64 flex-1 flex flex-col min-h-screen">
        {/* Top Bar (Desktop) / Header (Mobile) */}
        {renderTopBar()}

        {/* Mobile Header */}
        <div className="md:hidden px-5 py-4">
          <h1 className="text-[22px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">Settings</h1>
        </div>

        {/* Content */}
        <main className="flex-1 p-5 md:p-8 pb-28 md:pb-8">
          <div className="flex flex-col md:flex-row gap-8">
             {renderSettingsNav()}
             {isSocialAccounts ? renderSocialAccountsContent() : renderProfileContent()}
          </div>
        </main>
      </div>

      {renderBottomNav()}
    </div>
  );
};

export default ProfileSettingsScreen;