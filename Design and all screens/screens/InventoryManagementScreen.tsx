import React from "react";
import * as Icons from "lucide-react";

export interface InventoryManagementScreenProps {
  state: string;
}

/**
 * States:
 * - default: Displays the list of inventory items with their details and stock levels.
 * - editModalOpen: A modal is open for adding a new product or editing an existing one, showing the form fields.
 */
const InventoryManagementScreen: React.FC<InventoryManagementScreenProps> = ({ state }) => {
  const isEditModal = state === "editModalOpen";

  const products = [
    { id: 1, name: "Glossier You Perfume", sku: "GLS-PERF-001", stock: 24, value: "$48.00", image: "./images/glossier-product-set.png", campaigns: ["Spring Glow"], lowStock: false },
    { id: 2, name: "Balm Dotcom Trio", sku: "GLS-BALM-003", stock: 8, value: "$36.00", image: "./images/product-balm.png", campaigns: ["Spring Glow", "Holiday 2023"], lowStock: true },
    { id: 3, name: "Cloud Paint Set", sku: "GLS-CLDP-002", stock: 45, value: "$30.00", image: "./images/product-cloud.png", campaigns: [], lowStock: false },
    { id: 4, name: "Milky Jelly Cleanser", sku: "GLS-CLNS-004", stock: 0, value: "$22.00", image: "./images/product-cleanser.png", campaigns: ["Skincare Basics"], lowStock: true },
  ];

  const renderSidebar = () => (
    <aside className="hidden md:flex w-64 flex-col bg-white border-r border-[#E8E4F0] h-screen fixed left-0 top-0 z-30">
      <div className="flex items-center gap-3 p-6 mb-6">
        <div className="w-8 h-8 rounded-[10px] bg-[#5B4FE9] flex items-center justify-center">
          <Icons.Hexagon className="w-4 h-4 text-white" />
        </div>
        <span className="text-[15px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E] tracking-[-0.01em]">
          CreatorX
        </span>
      </div>

      <nav className="space-y-1 flex-1 px-3">
        {[
          { icon: Icons.LayoutDashboard, label: "Dashboard", active: false },
          { icon: Icons.Target, label: "Campaigns", active: false },
          { icon: Icons.Inbox, label: "Applications", active: false },
          { icon: Icons.CheckSquare, label: "Deliverables", active: false },
          { icon: Icons.Package, label: "Inventory", active: true },
          { icon: Icons.Calendar, label: "Events", active: false },
          { icon: Icons.Users, label: "Team", active: false },
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
    <header className="flex items-center justify-between px-6 md:px-8 py-4 bg-white border-b border-[#E8E4F0] ml-0 md:ml-64 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-[18px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">Inventory</h1>
          <p className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">Manage gifting products</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 px-5 py-3 rounded-[12px] bg-[#5B4FE9] text-[13px] font-['Plus_Jakarta_Sans'] font-semibold text-white shadow-[0_2px_8px_rgba(91,79,233,0.16)]">
          <Icons.Plus className="w-4 h-4" />
          Add product
        </button>
        <button className="w-10 h-10 rounded-[10px] bg-[#FBF9F6] flex items-center justify-center relative">
          <Icons.Bell className="w-5 h-5 text-[#1A1A2E]" strokeWidth={1.5} />
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E07A5F]" />
        </button>
        <div className="w-9 h-9 rounded-[10px] bg-[#FBF9F6] overflow-hidden">
           <img
            src="./images/brand-rep-avatar.png"
            alt="Brand user avatar"
            data-context="Top bar user avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );

  const renderStats = () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {[
        { label: "Total products", value: "24", icon: Icons.Package },
        { label: "In stock", value: "18", icon: Icons.CheckCircle2 },
        { label: "Low stock", value: "4", icon: Icons.AlertTriangle, color: "#E07A5F" },
        { label: "Out of stock", value: "2", icon: Icons.XCircle, color: "#6B6B7B" },
      ].map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="p-4 rounded-[14px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06]">
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-4 h-4" style={{ color: stat.color || "#5B4FE9" }} strokeWidth={1.5} />
              <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B] uppercase tracking-wider">{stat.label}</span>
            </div>
            <span className="block text-[24px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">{stat.value}</span>
          </div>
        );
      })}
    </div>
  );

  const renderProductCard = (product: typeof products[0]) => (
    <div
      key={product.id}
      className="p-4 rounded-[14px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06] group hover:shadow-[0_4px_12px_rgba(91,79,233,0.12)] transition-all duration-300"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="w-20 h-20 rounded-[10px] bg-[#FBF9F6] overflow-hidden shrink-0">
          <img
            src={product.image}
            alt={`${product.name} product photography, beauty product on soft surface with natural lighting`}
            data-context="Inventory product image"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-[15px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] truncate">{product.name}</h3>
            {product.lowStock && (
              <span className="px-2 py-0.5 rounded-full bg-[#FFB4A2]/[0.10] text-[10px] font-['Plus_Jakarta_Sans'] font-bold text-[#E07A5F] shrink-0">
                Low stock
              </span>
            )}
            {product.stock === 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#E8E4F0] text-[10px] font-['Plus_Jakarta_Sans'] font-bold text-[#6B6B7B] shrink-0">
                Out of stock
              </span>
            )}
          </div>
          <span className="block text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B] mb-1">{product.sku}</span>
          <span className="text-[15px] font-['Plus_Jakarta_Sans'] font-bold text-[#5B4FE9]">{product.value}</span>
        </div>
      </div>

      {/* Stock control */}
      <div className="flex items-center justify-between p-3 rounded-[10px] bg-[#FBF9F6] mb-3">
        <div className="flex items-center gap-3">
          <button className="w-8 h-8 rounded-[8px] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex items-center justify-center hover:bg-[#E8E4F0] transition-colors">
            <Icons.Minus className="w-4 h-4 text-[#6B6B7B]" />
          </button>
          <span className={`text-[16px] font-['Plus_Jakarta_Sans'] font-bold ${product.stock === 0 ? "text-[#E07A5F]" : "text-[#1A1A2E]"}`}>
            {product.stock}
          </span>
          <button className="w-8 h-8 rounded-[8px] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex items-center justify-center hover:bg-[#E8E4F0] transition-colors">
            <Icons.Plus className="w-4 h-4 text-[#6B6B7B]" />
          </button>
        </div>
        <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0]">units</span>
      </div>

      {/* Campaign tags */}
      {product.campaigns.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {product.campaigns.map((campaign) => (
            <span key={campaign} className="px-2 py-1 rounded-[6px] bg-[#5B4FE9]/[0.06] text-[11px] font-['Plus_Jakarta_Sans'] font-medium text-[#5B4FE9]">
              {campaign}
            </span>
          ))}
        </div>
      )}

      {/* Hover actions */}
      <div className="flex gap-2 mt-3 pt-3 border-t border-[#E8E4F0] opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
        <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-[#5B4FE9]/[0.06] text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#5B4FE9] hover:bg-[#5B4FE9]/[0.10]">
          <Icons.Pencil className="w-3 h-3" />
          Edit
        </button>
        <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-[#FFB4A2]/[0.06] text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#E07A5F] hover:bg-[#FFB4A2]/[0.10]">
          <Icons.Trash2 className="w-3 h-3" />
          Delete
        </button>
      </div>
    </div>
  );

  const renderEditModal = () => (
    isEditModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[#1A1A2E]/[0.30] backdrop-blur-sm" />
        <div className="relative w-full max-w-[520px] bg-white rounded-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] max-h-[90vh] flex flex-col">
          <div className="p-6 pb-4 border-b border-[#E8E4F0]">
            <div className="flex items-center justify-between">
              <h2 className="text-[20px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">
                Add new product
              </h2>
              <button className="w-9 h-9 rounded-[10px] bg-[#FBF9F6] flex items-center justify-center hover:bg-[#E8E4F0]">
                <Icons.X className="w-4 h-4 text-[#6B6B7B]" />
              </button>
            </div>
          </div>

        <div className="flex-1 overflow-y-auto p-6 pt-4">
          {/* Image upload */}
          <div className="mb-5">
            <label className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-2 block">
              Product image
            </label>
            <button className="w-full aspect-video rounded-[14px] bg-[#FBF9F6] border-2 border-dashed border-[#E8E4F0] flex flex-col items-center justify-center gap-3 hover:border-[#5B4FE9] transition-colors">
              <div className="w-12 h-12 rounded-[12px] bg-[#5B4FE9]/[0.06] flex items-center justify-center">
                <Icons.UploadCloud className="w-6 h-6 text-[#5B4FE9]" />
              </div>
              <div className="text-center">
                <span className="block text-[14px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E]">Drop image or click to upload</span>
                <span className="block text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0]">PNG, JPG up to 5MB</span>
              </div>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-2 block">
                Product name
              </label>
              <input
                type="text"
                placeholder="e.g. Glossier You Perfume"
                className="w-full px-4 py-3 rounded-[12px] bg-[#FBF9F6] border border-[#E8E4F0] text-[14px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E] placeholder-[#C4C0D4] outline-none focus:border-[#5B4FE9]"
              />
            </div>
            <div>
              <label className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-2 block">
                SKU
              </label>
              <input
                type="text"
                placeholder="e.g. GLS-001"
                className="w-full px-4 py-3 rounded-[12px] bg-[#FBF9F6] border border-[#E8E4F0] text-[14px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E] placeholder-[#C4C0D4] outline-none focus:border-[#5B4FE9]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-2 block">
                Value
              </label>
              <div className="flex items-center gap-2 px-4 py-3 rounded-[12px] bg-[#FBF9F6] border border-[#E8E4F0]">
                <span className="text-[14px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">$</span>
                <input
                  type="text"
                  placeholder="0.00"
                  className="flex-1 text-[14px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E] bg-transparent outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-2 block">
                Initial stock
              </label>
              <input
                type="number"
                placeholder="0"
                className="w-full px-4 py-3 rounded-[12px] bg-[#FBF9F6] border border-[#E8E4F0] text-[14px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E] placeholder-[#C4C0D4] outline-none focus:border-[#5B4FE9]"
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-2 block">
              Description
            </label>
            <textarea
              placeholder="Brief product description..."
              className="w-full px-4 py-3 rounded-[12px] bg-[#FBF9F6] border border-[#E8E4F0] text-[14px] font-['Plus_Jakarta_Sans'] font-light text-[#1A1A2E] placeholder-[#C4C0D4] outline-none resize-none h-20 leading-[1.6] focus:border-[#5B4FE9]"
            />
          </div>
        </div>

        <div className="p-6 pt-0 border-t border-[#E8E4F0]">
          <div className="flex gap-3">
            <button className="flex-1 py-3 rounded-[12px] bg-white border border-[#E8E4F0] text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#6B6B7B]">
              Cancel
            </button>
            <button className="flex-1 py-3 rounded-[12px] bg-[#5B4FE9] text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-white shadow-[0_2px_8px_rgba(91,79,233,0.16)]">
              Save product
            </button>
          </div>
        </div>
        </div>
      </div>
    )
  );

  return (
    <div className="min-h-screen bg-[#FBF9F6] font-['Plus_Jakarta_Sans'] flex flex-col md:flex-row">
      {renderSidebar()}

      <div className="flex-1 flex flex-col min-w-0">
        {renderTopBar()}

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {renderStats()}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(renderProductCard)}
          </div>
        </main>
      </div>

      {renderEditModal()}
    </div>
  );
};

export default InventoryManagementScreen;