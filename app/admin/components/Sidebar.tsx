"use client";
import { 
  Menu, X, Home, Truck, FileText, Archive, 
  Newspaper, Image, LogOut, ChevronLeft, 
  ChevronRight, LayoutDashboard, Settings,
  Bell, User, BarChart3, MapPin, Database,
  ChevronDown, ChevronUp, Users, Map,Calendar
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface SidebarProps {
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
  onLogout: () => void;
}

export default function Sidebar({ activeMenu, setActiveMenu, onLogout }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // State untuk dropdown master data
  const [isMasterDataOpen, setIsMasterDataOpen] = useState(true); // Default terbuka

  // Handle responsive
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Menu items utama
  const mainMenuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard,
      color: 'from-blue-500 to-blue-600'
    },
  { 
    id: 'peta-sampah', 
    label: 'Peta GIS', 
    icon: Map, // Import Map dari lucide-react
    color: 'from-red-500 to-red-600'
  },
    { 
      id: 'daftar', 
      label: 'Laporan Masuk', 
      icon: FileText,
      color: 'from-yellow-500 to-yellow-600',
      badge: 3
    },
  { 
    id: 'penugasan', 
    label: 'Manajemen Penugasan', 
    icon: Calendar,
    color: 'from-purple-500 to-purple-600'
  },

    { 
      id: 'riwayat', 
      label: 'Riwayat', 
      icon: Archive,
      color: 'from-purple-500 to-purple-600'
    },
  ];

  // Sub-menu untuk Master Data
  const masterDataItems = [
    { 
      id: 'data-supir', 
      label: 'Data Supir', 
      icon: Users,
      color: 'from-orange-500 to-orange-600'
    },
    { 
      id: 'data-truk', 
      label: 'Data Truk', 
      icon: Truck,
      color: 'from-emerald-500 to-emerald-600'
    },
    { 
      id: 'data-wilayah', 
      label: 'Data Wilayah', 
      icon: Map,
      color: 'from-indigo-500 to-indigo-600'
    },
  ];

  // Menu setelah master data
  const contentMenuItems = [
    { 
      id: 'berita', 
      label: 'Kelola Berita', 
      icon: Newspaper,
      color: 'from-green-500 to-green-600'
    },
    { 
      id: 'galeri', 
      label: 'Kelola Galeri', 
      icon: Image,
      color: 'from-pink-500 to-pink-600'
    },
  ];

  const bottomMenuItems = [
    { id: 'settings', label: 'Pengaturan', icon: Settings },
    { id: 'profile', label: 'Profil', icon: User },
  ];

  const handleMenuClick = (menuId: string) => {
    setActiveMenu(menuId);
    if (window.innerWidth < 768) {
      setIsMobileOpen(false);
    }
  };

  const toggleMasterData = () => {
    setIsMasterDataOpen(!isMasterDataOpen);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Untuk mobile
  if (window.innerWidth < 768) {
    return (
      <>
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="fixed top-4 left-4 z-50 p-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Mobile Sidebar Overlay */}
        {isMobileOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <aside 
          className={`fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-gray-900 to-gray-800 z-50 transform transition-transform duration-300 ease-in-out ${
            isMobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">CB</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Clean<span className="text-green-400">Balige</span></h2>
                  <p className="text-xs text-gray-400 mt-0.5">Administrator</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 overflow-y-auto py-6 px-4">
              {/* Main Menu */}
              <div className="space-y-2 mb-4">
                {mainMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeMenu === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleMenuClick(item.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                        isActive
                          ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                          : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon size={20} />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-red-500 text-white">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Master Data Section with Dropdown */}
              <div className="mb-4">
                <button
                  onClick={toggleMasterData}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700/50 transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <Database size={20} />
                    <span className="font-medium">Manajemen Master Data</span>
                  </div>
                  {isMasterDataOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>

                {/* Sub-menu Master Data */}
                {isMasterDataOpen && (
                  <div className="ml-4 mt-2 space-y-1 pl-4 border-l-2 border-gray-700">
                    {masterDataItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeMenu === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleMenuClick(item.id)}
                          className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all text-sm ${
                            isActive
                              ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                              : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                          }`}
                        >
                          <Icon size={18} />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Content Menu */}
              <div className="space-y-2 mb-4">
                {contentMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeMenu === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleMenuClick(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                        isActive
                          ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                          : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Divider */}
              <div className="my-4 border-t border-gray-700" />

              {/* Bottom Menu */}
              <div className="space-y-2">
                {bottomMenuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleMenuClick(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                        activeMenu === item.id
                          ? 'bg-gradient-to-r from-gray-700 to-gray-600 text-white'
                          : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-gray-700">
              <button
                onClick={onLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all group"
              >
                <LogOut size={20} className="group-hover:rotate-180 transition-transform" />
                <span className="font-medium">Keluar</span>
              </button>
            </div>
          </div>
        </aside>
      </>
    );
  }

  // Desktop Sidebar
  const sidebarWidth = isCollapsed ? 'w-20' : 'w-72';
  const showFullContent = !isCollapsed || isHovered;

  return (
    <aside 
      className={`fixed left-0 top-0 h-full ${sidebarWidth} bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 ease-in-out z-30 shadow-2xl`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="relative p-6 border-b border-gray-700">
          {showFullContent ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-xl">CB</span>
                </div>
                <div className="overflow-hidden">
                  <h2 className="text-xl font-bold text-white whitespace-nowrap">Clean<span className="text-green-400">Balige</span></h2>
                  <p className="text-xs text-gray-400 mt-0.5">Administrator</p>
                </div>
              </div>
              <button
                onClick={toggleSidebar}
                className="p-1.5 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">CB</span>
              </div>
            </div>
          )}
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-6 px-3">
          {/* Main Menu */}
          <div className="space-y-1 mb-4">
            {mainMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.id)}
                  className={`w-full flex items-center ${showFullContent ? 'justify-between' : 'justify-center'} px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                      : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                  }`}
                  title={!showFullContent ? item.label : ''}
                >
                  <div className={`flex items-center ${showFullContent ? 'space-x-3' : ''}`}>
                    <Icon size={20} />
                    {showFullContent && <span className="font-medium">{item.label}</span>}
                  </div>
                  {showFullContent && item.badge && (
                    <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-red-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Master Data Section */}
          {showFullContent ? (
            // Tampilan expanded dengan dropdown
            <div className="mb-4">
              <button
                onClick={toggleMasterData}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700/50 transition-all"
              >
                <div className="flex items-center space-x-3">
                  <Database size={20} />
                  <span className="font-medium">Manajemen Master Data</span>
                </div>
                {isMasterDataOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              {isMasterDataOpen && (
                <div className="ml-4 mt-2 space-y-1 pl-4 border-l-2 border-gray-700">
                  {masterDataItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeMenu === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleMenuClick(item.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all text-sm ${
                          isActive
                            ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                            : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                        }`}
                      >
                        <Icon size={18} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            // Tampilan collapsed (hanya icon)
            <div className="space-y-2 mb-4">
              <div 
                className="flex justify-center px-4 py-3 text-gray-300"
                title="Manajemen Master Data"
              >
                <Database size={20} />
              </div>
              {masterDataItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeMenu === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleMenuClick(item.id)}
                    className={`w-full flex justify-center px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                        : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                    }`}
                    title={item.label}
                  >
                    <Icon size={20} />
                  </button>
                );
              })}
            </div>
          )}

          {/* Content Menu */}
          {showFullContent ? (
            <div className="space-y-1 mb-4">
              {contentMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeMenu === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleMenuClick(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                        : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2 mb-4">
              {contentMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeMenu === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleMenuClick(item.id)}
                    className={`w-full flex justify-center px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                        : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                    }`}
                    title={item.label}
                  >
                    <Icon size={20} />
                  </button>
                );
              })}
            </div>
          )}

          {showFullContent && (
            <>
              {/* Divider */}
              <div className="my-4 border-t border-gray-700" />

              {/* Bottom Menu */}
              <div className="space-y-1">
                {bottomMenuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleMenuClick(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                        activeMenu === item.id
                          ? 'bg-gradient-to-r from-gray-700 to-gray-600 text-white'
                          : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={onLogout}
            className={`w-full flex items-center ${showFullContent ? 'space-x-3' : 'justify-center'} px-4 py-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all group`}
            title={!showFullContent ? 'Keluar' : ''}
          >
            <LogOut size={20} className="group-hover:rotate-180 transition-transform" />
            {showFullContent && <span className="font-medium">Keluar</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}