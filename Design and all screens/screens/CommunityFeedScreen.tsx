import React from "react";
import * as Icons from "lucide-react";

export interface CommunityFeedScreenProps {
  state: string;
}

/**
 * States:
 * - default: Displays the vertical scroll feed (Mobile) or Grid (Desktop) of community posts, including pinned admin announcements.
 * - createPost: The post creation interface is active (Modal on Desktop, Full screen on Mobile), allowing text input and media attachment.
 */
const CommunityFeedScreen: React.FC<CommunityFeedScreenProps> = ({ state }) => {
  const posts = state === "default" ? [
    {
      id: 1,
      author: "CreatorX Team",
      avatar: "./images/admin-avatar.png",
      isAdmin: true,
      time: "2 hours ago",
      content: "New feature drop: You can now negotiate campaign rates directly with brands! Check out the updated application flow.",
      image: null,
      likes: 234,
      comments: 45,
    },
    {
      id: 2,
      author: "Maya Chen",
      avatar: "./images/creator-avatar.png",
      isAdmin: false,
      time: "4 hours ago",
      content: "Just hit 150K! Thank you to everyone who's been part of this journey. The Glossier campaign really pushed me to create my best content yet.",
      image: "./images/community-post-1.png",
      likes: 892,
      comments: 127,
    },
    {
      id: 3,
      author: "Jordan Park",
      avatar: "./images/referral-2.png",
      isAdmin: false,
      time: "6 hours ago",
      content: "Tips for negotiating with brands: always know your worth, have your metrics ready, and don't be afraid to ask for what you deserve. The new negotiation feature makes this so much easier!",
      image: null,
      likes: 567,
      comments: 89,
    },
  ] : [];

  const trendingTopics = ["#CreatorEconomy", "#BrandDeals", "#ContentTips", "#SmallBusiness", "#GrowthHacking", "#Authenticity"];

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
          { icon: Icons.Users, label: "Community", active: true },
          { icon: Icons.Calendar, label: "Events", active: false },
          { icon: Icons.Wallet, label: "Wallet", active: false },
          { icon: Icons.User, label: "Profile", active: false, badge: 3 },
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
            <span className="block text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] truncate">Alex Rivera</span>
            <span className="text-[10px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">@alexcreates</span>
          </div>
          <Icons.Settings className="w-4 h-4 text-[#6B6B7B] cursor-pointer" />
        </div>
      </div>
    </aside>
  );

  const renderTopBar = () => (
    <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white border-b border-[#E8E4F0] ml-64 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <h1 className="text-[18px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">Community</h1>
        <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">Connect with fellow creators</span>
      </div>

      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 px-4 py-2 rounded-[10px] bg-[#5B4FE9] text-white text-[13px] font-['Plus_Jakarta_Sans'] font-semibold shadow-[0_2px_8px_rgba(91,79,233,0.16)]">
          <Icons.Plus className="w-4 h-4" />
          New Post
        </button>
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

  const renderStatusBar = () => (
    <div className="md:hidden relative z-10 px-5 pt-3 pb-1 flex items-center justify-between">
      <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E]">9:41</span>
      <div className="flex items-center gap-1">
        <Icons.Signal className="w-3.5 h-3.5 text-[#1A1A2E]" />
        <Icons.Wifi className="w-3.5 h-3.5 text-[#1A1A2E]" />
        <Icons.Battery className="w-3.5 h-3.5 text-[#1A1A2E]" />
      </div>
    </div>
  );

  const renderHeader = () => (
    <div className="md:hidden px-5 py-4 flex items-center justify-between">
      <div>
        <h1 className="font-['Plus_Jakarta_Sans'] text-[22px] font-bold leading-[1.2] tracking-[-0.02em] text-[#1A1A2E]">
          Community
        </h1>
        <p className="font-['Plus_Jakarta_Sans'] text-[13px] font-light text-[#6B6B7B]">
          Connect with fellow creators
        </p>
      </div>
      <button className="w-10 h-10 rounded-[12px] bg-[#5B4FE9] flex items-center justify-center shadow-[0_2px_8px_rgba(91,79,233,0.16)]">
        <Icons.Plus className="w-5 h-5 text-white" />
      </button>
    </div>
  );

  const renderTrendingSidebar = () => (
    <div className="hidden lg:block w-64 shrink-0 sticky top-24 h-fit">
      <div className="p-5 rounded-[16px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06]">
        <div className="flex items-center gap-2 mb-4 text-[#E07A5F]">
          <Icons.TrendingUp className="w-4 h-4" />
          <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-bold uppercase tracking-wider">Trending Topics</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {trendingTopics.map((topic) => (
            <button key={topic} className="px-3 py-1.5 rounded-full bg-[#FBF9F6] hover:bg-[#5B4FE9]/[0.06] text-[11px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B] hover:text-[#5B4FE9] transition-colors">
              {topic}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mt-6 p-5 rounded-[16px] bg-[#5B4FE9]/[0.04] border border-[#5B4FE9]/[0.08]">
        <h3 className="text-[13px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E] mb-2">Community Guidelines</h3>
        <p className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B] leading-[1.5]">
          Be respectful, stay on topic, and support your fellow creators. Spam and self-promotion are not allowed.
        </p>
        <button className="mt-3 text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#5B4FE9]">
          Read full rules &rarr;
        </button>
      </div>
    </div>
  );

  const renderPost = (post: any) => (
    <div key={post.id} className="rounded-[16px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06] overflow-hidden">
      {/* Author header */}
      <div className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-[10px] bg-[#FBF9F6] overflow-hidden relative">
          <img
            src={post.avatar}
            alt={`Profile photo of ${post.author}, content creator with warm friendly expression`}
            data-context="Community post author avatar"
            className="w-full h-full object-cover"
          />
          {post.isAdmin && (
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#5B4FE9] flex items-center justify-center border-2 border-white">
              <Icons.Shield className="w-2 h-2 text-white" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">{post.author}</span>
            {post.isAdmin && (
              <span className="px-2 py-0.5 rounded-[4px] bg-[#5B4FE9] text-[10px] font-['Plus_Jakarta_Sans'] font-bold text-white uppercase">
                Team
              </span>
            )}
          </div>
          <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0]">{post.time}</span>
        </div>
        <button className="w-8 h-8 rounded-[8px] flex items-center justify-center hover:bg-[#FBF9F6]">
          <Icons.MoreHorizontal className="w-4 h-4 text-[#9B96B0]" />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-[14px] font-['Plus_Jakarta_Sans'] font-light text-[#1A1A2E] leading-[1.6]">
          {post.content}
        </p>
      </div>

      {/* Media */}
      {post.image && (
        <div className="aspect-[16/10] bg-[#FBF9F6]">
          <img
            src={post.image}
            alt="Community post image showing creator content, lifestyle photography with warm natural lighting"
            data-context="Community post media attachment"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Engagement */}
      <div className="p-4 flex items-center gap-6">
        <button className="flex items-center gap-1.5 hover:text-[#E07A5F] transition-colors group">
          <Icons.Heart className={`w-4 h-4 ${post.likes > 0 ? 'text-[#E07A5F]' : 'text-[#9B96B0]'} group-hover:scale-110 transition-transform`} strokeWidth={1.5} />
          <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">{post.likes}</span>
        </button>
        <button className="flex items-center gap-1.5 hover:text-[#5B4FE9] transition-colors">
          <Icons.MessageCircle className="w-4 h-4 text-[#9B96B0]" strokeWidth={1.5} />
          <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">{post.comments}</span>
        </button>
        <button className="flex items-center gap-1.5 ml-auto hover:text-[#5B4FE9] transition-colors">
          <Icons.Share2 className="w-4 h-4 text-[#9B96B0]" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );

  const renderCreatePost = () => (
    state === "createPost" && (
      <div className="fixed inset-0 z-50 flex items-center justify-center md:items-center">
        <div className="absolute inset-0 bg-[#1A1A2E]/[0.30] backdrop-blur-sm" />
        <div className="relative w-full md:w-[600px] bg-white md:rounded-[24px] shadow-[0_-4px_24px_rgba(0,0,0,0.08)] md:shadow-[0_10px_40px_rgba(0,0,0,0.12)] flex flex-col max-h-[90vh]">
          {/* Desktop Header */}
          <div className="hidden md:flex items-center justify-between px-6 py-4 border-b border-[#E8E4F0] rounded-t-[24px]">
            <button className="text-[14px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B] hover:text-[#1A1A2E]">
              Cancel
            </button>
            <span className="text-[15px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">
              New post
            </span>
            <button className="px-5 py-2 rounded-[10px] bg-[#5B4FE9] text-[13px] font-['Plus_Jakarta_Sans'] font-semibold text-white shadow-[0_2px_8px_rgba(91,79,233,0.16)]">
              Post
            </button>
          </div>
          
          {/* Mobile Header */}
          <div className="md:hidden px-5 pt-3 pb-1 flex items-center justify-between">
            <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">9:41</span>
            <div className="flex items-center gap-1">
              <Icons.Signal className="w-3.5 h-3.5 text-[#6B6B7B]" />
              <Icons.Wifi className="w-3.5 h-3.5 text-[#6B6B7B]" />
              <Icons.Battery className="w-3.5 h-3.5 text-[#6B6B7B]" />
            </div>
          </div>
          <div className="md:hidden px-5 py-3 flex items-center justify-between border-b border-[#E8E4F0]">
            <button className="text-[14px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">
              Cancel
            </button>
            <span className="text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">
              New post
            </span>
            <button className="px-4 py-2 rounded-[10px] bg-[#5B4FE9] text-[13px] font-['Plus_Jakarta_Sans'] font-semibold text-white">
              Post
            </button>
          </div>

          {/* Composer */}
          <div className="flex-1 p-5 md:p-6 overflow-y-auto">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-[10px] bg-[#FBF9F6] overflow-hidden shrink-0">
                <img
                  src="./images/creator-avatar.png"
                  alt="Your profile photo"
                  data-context="Current user avatar in post composer"
                  className="w-full h-full object-cover"
                />
              </div>
              <textarea
                placeholder="What's on your mind? Share tips, wins, or ask the community..."
                className="flex-1 text-[16px] font-['Plus_Jakarta_Sans'] font-light text-[#1A1A2E] placeholder-[#C4C0D4] bg-transparent outline-none resize-none leading-[1.6] min-h-[150px]"
                autoFocus
                readOnly
              />
            </div>
          </div>

          {/* Attachment bar */}
          <div className="p-5 md:p-6 border-t border-[#E8E4F0] bg-white">
            <div className="flex items-center justify-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-[#FBF9F6] hover:bg-[#E8E4F0] transition-colors">
                <Icons.Image className="w-4 h-4 text-[#5B4FE9]" />
                <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">Photo</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-[#FBF9F6] hover:bg-[#E8E4F0] transition-colors">
                <Icons.Camera className="w-4 h-4 text-[#5B4FE9]" />
                <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">Camera</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-[#FBF9F6] hover:bg-[#E8E4F0] transition-colors">
                <Icons.Hash className="w-4 h-4 text-[#5B4FE9]" />
                <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">Topic</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );

  const renderBottomNav = () => (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-[#E8E4F0] z-40">
      <div className="flex items-center justify-around py-2 pb-6">
        <button className="flex flex-col items-center gap-1 px-3 py-1">
          <Icons.Compass className="w-5 h-5 text-[#9B96B0]" />
          <span className="text-[9px] font-['Plus_Jakarta_Sans'] font-medium text-[#9B96B0]">Explore</span>
        </button>
        <button className="flex flex-col items-center gap-1 px-3 py-1">
          <Icons.Users className="w-5 h-5 text-[#5B4FE9]" />
          <span className="text-[9px] font-['Plus_Jakarta_Sans'] font-semibold text-[#5B4FE9]">Community</span>
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
          <Icons.User className="w-5 h-5 text-[#9B96B0]" />
          <span className="text-[9px] font-['Plus_Jakarta_Sans'] font-medium text-[#9B96B0]">Profile</span>
          <div className="absolute top-0 right-1 w-4 h-4 rounded-full bg-[#E07A5F] flex items-center justify-center">
            <span className="text-[8px] font-['Plus_Jakarta_Sans'] font-bold text-white">3</span>
          </div>
        </button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#FBF9F6] font-['Plus_Jakarta_Sans'] relative overflow-hidden pb-28 md:pb-0">
      {/* Soft gradient mesh */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[5%] right-[-20px] w-[150px] h-[150px] rounded-full bg-[#8B82F0] opacity-[0.04] blur-[40px]" />
      </div>

      {renderSidebar()}

      <div className="md:ml-64 flex flex-col min-h-screen">
        {renderTopBar()}
        
        <main className="flex-1 p-5 md:p-8 overflow-y-auto">
          {/* Mobile Status Bar - outside grid */}
          {renderStatusBar()}
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
            {/* Feed Area */}
            <div className="lg:col-span-8 xl:col-span-7">
              {renderHeader()}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {posts.map(renderPost)}
              </div>
            </div>

            {/* Sidebar Area */}
            <div className="hidden lg:block lg:col-span-4 xl:col-span-5">
              {renderTrendingSidebar()}
            </div>
          </div>
        </main>
      </div>

      {renderCreatePost()}
      {state !== "createPost" && renderBottomNav()}
    </div>
  );
};

export default CommunityFeedScreen;