import React from "react";
import * as Icons from "lucide-react";

export interface TeamManagementScreenProps {
  state: string;
}

/**
 * States:
 * - default: Displays the list of current team members and the "Invite Member" button.
 * - inviteModal: A modal is active for inviting a new member, showing email input and role selection options.
 */
const TeamManagementScreen: React.FC<TeamManagementScreenProps> = ({ state }) => {
  const isInviteModalOpen = state === "inviteModal";

  const members = [
    { id: 1, name: "Sarah Chen", email: "sarah@glossier.com", role: "Owner", status: "active", avatar: "./images/brand-rep-avatar.png" },
    { id: 2, name: "Emily Wong", email: "emily@glossier.com", role: "Manager", status: "active", avatar: "./images/team-member-2.png" },
    { id: 3, name: "David Park", email: "david@glossier.com", role: "Viewer", status: "active", avatar: "./images/team-member-3.png" },
    { id: 4, name: "Lisa Thompson", email: "lisa@glossier.com", role: "Manager", status: "pending", avatar: "./images/team-member-4.png" },
  ];

  const roleColors: Record<string, string> = {
    Owner: "#5B4FE9",
    Manager: "#8B82F0",
    Viewer: "#6B6B7B",
  };

  const renderSidebar = () => (
    <aside className="hidden md:flex w-64 flex-col bg-white border-r border-[#E8E4F0] p-6">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-8 h-8 rounded-[10px] bg-[#5B4FE9] flex items-center justify-center">
          <Icons.Hexagon className="w-4 h-4 text-white" />
        </div>
        <span className="text-[15px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E] tracking-[-0.01em]">
          CreatorX
        </span>
      </div>

      <nav className="space-y-1 flex-1">
        {[
          { icon: Icons.LayoutDashboard, label: "Dashboard", active: false },
          { icon: Icons.Target, label: "Campaigns", active: false },
          { icon: Icons.Inbox, label: "Applications", active: false },
          { icon: Icons.CheckSquare, label: "Deliverables", active: false },
          { icon: Icons.Package, label: "Inventory", active: false },
          { icon: Icons.Calendar, label: "Events", active: false },
          { icon: Icons.Users, label: "Team", active: true },
          { icon: Icons.Wallet, label: "Wallet", active: false },
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
              <Icon className="w-4 h-4" strokeWidth={1.5} />
              <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );

  const renderTopBar = () => (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#E8E4F0]">
      <div className="flex items-center gap-4">
        <button className="md:hidden w-9 h-9 rounded-[10px] bg-[#FBF9F6] flex items-center justify-center">
          <Icons.Menu className="w-4 h-4 text-[#1A1A2E]" />
        </button>
        <div>
          <h1 className="text-[18px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">Team Management</h1>
          <p className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">Manage roles and permissions</p>
        </div>
      </div>

      <button
        className="flex items-center gap-2 px-5 py-3 rounded-[12px] bg-[#5B4FE9] text-[13px] font-['Plus_Jakarta_Sans'] font-semibold text-white shadow-[0_2px_8px_rgba(91,79,233,0.16)]"
      >
        <Icons.UserPlus className="w-4 h-4" strokeWidth={1.5} />
        Invite member
      </button>
    </header>
  );

  const renderRoleLegend = () => (
    <div className="hidden md:flex gap-6 mb-6">
      {[
        { role: "Owner", desc: "Full control", color: "#5B4FE9" },
        { role: "Manager", desc: "Campaigns + payments", color: "#8B82F0" },
        { role: "Viewer", desc: "Read-only access", color: "#6B6B7B" },
      ].map((item) => (
        <div key={item.role} className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
          <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E]">{item.role}</span>
          <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0]">— {item.desc}</span>
        </div>
      ))}
    </div>
  );

  const renderMemberList = () => (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-hidden rounded-[16px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E8E4F0] bg-[#FBF9F6]/50">
              <th className="text-left py-4 px-6 text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#6B6B7B] uppercase tracking-wider">
                Member
              </th>
              <th className="text-left py-4 px-6 text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#6B6B7B] uppercase tracking-wider">
                Role
              </th>
              <th className="text-left py-4 px-6 text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#6B6B7B] uppercase tracking-wider">
                Status
              </th>
              <th className="text-right py-4 px-6 text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#6B6B7B] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} className="border-b border-[#E8E4F0] last:border-0 hover:bg-[#FBF9F6]/30 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[10px] bg-[#FBF9F6] overflow-hidden shrink-0">
                      <img
                        src={member.avatar}
                        alt={`Professional headshot of ${member.name}, business casual attire, neutral background`}
                        data-context="Team member avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <span className="block text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">
                        {member.name}
                      </span>
                      <span className="block text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">
                        {member.email}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span
                    className="px-3 py-1.5 rounded-full text-[12px] font-['Plus_Jakarta_Sans'] font-semibold inline-block"
                    style={{
                      backgroundColor: `${roleColors[member.role]}10`,
                      color: roleColors[member.role],
                    }}
                  >
                    {member.role}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${member.status === "active" ? "bg-[#5B4FE9]" : "bg-[#E07A5F]"}`} />
                    <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E] capitalize">
                      {member.status}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6 text-right">
                  <button className="w-8 h-8 rounded-[8px] bg-[#FBF9F6] hover:bg-[#E8E4F0] flex items-center justify-center ml-auto">
                    <Icons.MoreHorizontal className="w-4 h-4 text-[#6B6B7B]" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-4 p-4 rounded-[14px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06]"
          >
            <div className="w-12 h-12 rounded-[12px] bg-[#FBF9F6] overflow-hidden shrink-0">
              <img
                src={member.avatar}
                alt={`Professional headshot of ${member.name}, business casual attire, neutral background`}
                data-context="Team member avatar"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">
                  {member.name}
                </span>
                {member.status === "pending" && (
                  <span className="px-2 py-0.5 rounded-full bg-[#FFB4A2]/[0.10] text-[10px] font-['Plus_Jakarta_Sans'] font-bold text-[#E07A5F] uppercase">
                    Pending
                  </span>
                )}
              </div>
              <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">
                {member.email}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span
                className="px-3 py-1.5 rounded-full text-[12px] font-['Plus_Jakarta_Sans'] font-semibold"
                style={{
                  backgroundColor: `${roleColors[member.role]}10`,
                  color: roleColors[member.role],
                }}
              >
                {member.role}
              </span>

              <button className="w-8 h-8 rounded-[8px] bg-[#FBF9F6] flex items-center justify-center">
                <Icons.MoreHorizontal className="w-4 h-4 text-[#6B6B7B]" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const renderPermissionMatrix = () => (
    <div className="mt-8 p-5 rounded-[16px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06]">
      <h2 className="text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] mb-4">
        Role Permissions
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E8E4F0]">
              <th className="text-left py-3 px-2 text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B] uppercase tracking-wider">
                Permission
              </th>
              <th className="text-center py-3 px-2 text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#5B4FE9]">
                Owner
              </th>
              <th className="text-center py-3 px-2 text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#8B82F0]">
                Manager
              </th>
              <th className="text-center py-3 px-2 text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#6B6B7B]">
                Viewer
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              { label: "Create campaigns", owner: true, manager: true, viewer: false },
              { label: "Approve applications", owner: true, manager: true, viewer: false },
              { label: "Manage payments", owner: true, manager: true, viewer: false },
              { label: "View financials", owner: true, manager: true, viewer: false },
              { label: "Edit team roles", owner: true, manager: false, viewer: false },
              { label: "Delete campaigns", owner: true, manager: false, viewer: false },
              { label: "View analytics", owner: true, manager: true, viewer: true },
              { label: "Export reports", owner: true, manager: true, viewer: true },
            ].map((perm, index) => (
              <tr key={index} className="border-b border-[#E8E4F0] last:border-0">
                <td className="py-3 px-2 text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E]">
                  {perm.label}
                </td>
                <td className="text-center py-3 px-2">
                  {perm.owner ? (
                    <Icons.Check className="w-4 h-4 text-[#5B4FE9] mx-auto" strokeWidth={3} />
                  ) : (
                    <Icons.X className="w-4 h-4 text-[#C4C0D4] mx-auto" strokeWidth={2} />
                  )}
                </td>
                <td className="text-center py-3 px-2">
                  {perm.manager ? (
                    <Icons.Check className="w-4 h-4 text-[#8B82F0] mx-auto" strokeWidth={3} />
                  ) : (
                    <Icons.X className="w-4 h-4 text-[#C4C0D4] mx-auto" strokeWidth={2} />
                  )}
                </td>
                <td className="text-center py-3 px-2">
                  {perm.viewer ? (
                    <Icons.Check className="w-4 h-4 text-[#6B6B7B] mx-auto" strokeWidth={3} />
                  ) : (
                    <Icons.X className="w-4 h-4 text-[#C4C0D4] mx-auto" strokeWidth={2} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderInviteModal = () => (
    isInviteModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[#1A1A2E]/[0.30] backdrop-blur-sm" />
        <div className="relative w-full max-w-[480px] bg-white rounded-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-[20px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">
                Invite team member
              </h2>
              <p className="text-[13px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">
                They'll receive an email invitation to join.
              </p>
            </div>
            <button className="w-9 h-9 rounded-[10px] bg-[#FBF9F6] flex items-center justify-center">
              <Icons.X className="w-4 h-4 text-[#6B6B7B]" />
            </button>
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-2 block">
                Email address
              </label>
              <input
                type="email"
                placeholder="colleague@company.com"
                className="w-full px-4 py-3.5 rounded-[12px] bg-[#FBF9F6] border border-[#E8E4F0] text-[14px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E] placeholder-[#C4C0D4] outline-none focus:border-[#5B4FE9] focus:shadow-[0_0_0_3px_rgba(91,79,233,0.08)]"
              />
            </div>

            <div>
              <label className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-3 block">
                Role
              </label>
              <div className="space-y-2">
                {[
                  { role: "Manager", desc: "Can create campaigns, approve applications, and manage payments", color: "#8B82F0" },
                  { role: "Viewer", desc: "Can view analytics and reports, read-only access", color: "#6B6B7B" },
                ].map((option) => (
                  <button
                    key={option.role}
                    className="w-full flex items-start gap-3 p-4 rounded-[12px] bg-[#FBF9F6] border border-[#E8E4F0] text-left hover:border-[#5B4FE9]/[0.20] transition-colors"
                  >
                    <div
                      className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5"
                      style={{ borderColor: option.color }}
                    >
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: option.color }} />
                    </div>
                    <div>
                      <span className="block text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">
                        {option.role}
                      </span>
                      <span className="block text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">
                        {option.desc}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button className="w-full py-4 rounded-[14px] bg-[#5B4FE9] flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(91,79,233,0.16)]">
              <Icons.Send className="w-4 h-4 text-white" />
              <span className="text-[15px] font-['Plus_Jakarta_Sans'] font-semibold text-white">
                Send invitation
              </span>
            </button>
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className="min-h-screen bg-[#FBF9F6] font-['Plus_Jakarta_Sans'] flex">
      {renderSidebar()}

      <div className="flex-1 flex flex-col min-w-0">
        {renderTopBar()}

        <main className="flex-1 p-6 overflow-y-auto">
          {renderRoleLegend()}
          {renderMemberList()}
          {renderPermissionMatrix()}
        </main>
      </div>

      {renderInviteModal()}
    </div>
  );
};

export default TeamManagementScreen;