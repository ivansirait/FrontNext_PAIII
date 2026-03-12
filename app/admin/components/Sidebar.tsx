"use client";
import { 
  Menu, X, Truck, FileText, Archive, 
  Newspaper, Image, LogOut, ChevronLeft, 
  ChevronRight, LayoutDashboard, Settings,
  User, Database, ChevronDown, ChevronUp, 
  Users, Map, Calendar, ClipboardList, AlertCircle
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
  
  // State untuk dropdown
  const [isMasterDataOpen, setIsMasterDataOpen] = useState(true);
  const [isTaskManagementOpen, setIsTaskManagementOpen] = useState(true); // Dropdown Manajemen Tugas

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

  const mainMenuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard,
      color: 'from-blue-500 to-blue-600'
    },

    { 
      id: 'daftar', 
      label: 'Laporan Masuk', 
      icon: FileText,
      color: 'from-yellow-500 to-yellow-600',
      badge: 3
    },
        { 
      id: 'peta-sampah', 
      label: 'Peta GIS', 
      icon: Map,
      color: 'from-red-500 to-red-600'
    },
    
  ];

  // Sub-menu untuk Manajemen Tugas
  const taskMenuItems = [
    { 
      id: 'penugasan', 
      label: 'Tugas Harian', 
      icon: ClipboardList,
      color: 'from-purple-500 to-purple-600'
    },
    { 
      id: 'penugasan', 
      label: 'Tugas Aduan', 
      icon: AlertCircle,
      color: 'from-pink-500 to-pink-600'
    },
  ];

  const masterDataItems = [
    { id: 'data-supir', label: 'Data Supir', icon: Users, color: 'from-orange-500 to-orange-600' },
    { id: 'data-truk', label: 'Data Truk', icon: Truck, color: 'from-emerald-500 to-emerald-600' },
    { id: 'data-wilayah', label: 'Data Wilayah', icon: Map, color: 'from-indigo-500 to-indigo-600' },
  ];

  const contentMenuItems = [
    { id: 'riwayat', label: 'Riwayat', icon: Archive, color: 'from-gray-500 to-gray-600' },
    { id: 'berita', label: 'Kelola Berita', icon: Newspaper, color: 'from-green-500 to-green-600' },
    { id: 'galeri', label: 'Kelola Galeri', icon: Image, color: 'from-pink-500 to-pink-600' },
  ];

  const bottomMenuItems = [
    { id: 'settings', label: 'Pengaturan', icon: Settings },
    { id: 'profile', label: 'Profil', icon: User },
  ];

  const handleMenuClick = (menuId: string) => {
    setActiveMenu(menuId);
    if (window.innerWidth < 768) setIsMobileOpen(false);
  };

  // Reusable Nav Item Component untuk menghindari duplikasi kode
  const NavItem = ({ item, isSubItem = false, collapsed = false }: { item: any, isSubItem?: boolean, collapsed?: boolean }) => {
    const Icon = item.icon;
    const isActive = activeMenu === item.id;
    const showLabel = !collapsed || isHovered || isMobileOpen;

    return (
      <button
        onClick={() => handleMenuClick(item.id)}
        className={`w-full flex items-center ${showLabel ? 'justify-between px-4' : 'justify-center'} py-2.5 rounded-xl transition-all ${
          isSubItem ? 'text-sm mb-1' : 'mb-2'
        } ${
          isActive
            ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
            : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
        }`}
        title={!showLabel ? item.label : ''}
      >
        <div className={`flex items-center ${showLabel ? 'space-x-3' : ''}`}>
          <Icon size={isSubItem ? 18 : 20} />
          {showLabel && <span className="font-medium">{item.label}</span>}
        </div>
        {showLabel && item.badge && (
          <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-red-500 text-white">
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  // Mobile Render Logic ... (Singkatnya sama dengan desktop namun selalu Expanded)
  
  const showFullContent = !isCollapsed || isHovered;

  return (
    <aside 
      className={`fixed left-0 top-0 h-full ${isCollapsed && !isHovered ? 'w-20' : 'w-72'} bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 ease-in-out z-30 shadow-2xl`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="h-full flex flex-col">
        {/* Header Section */}
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
            {showFullContent ? (
                <>
                    <div className="flex items-center space-x-3 overflow-hidden">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-xl">CB</div>
                        <div className="truncate">
                            <h2 className="text-xl font-bold text-white">Clean<span className="text-green-400">Balige</span></h2>
                            <p className="text-xs text-gray-400">Administrator</p>
                        </div>
                    </div>
                    <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-1.5 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    </button>
                </>
            ) : (
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto text-white font-bold text-xl">CB</div>
            )}
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {/* Main Items */}
          {mainMenuItems.map(item => <NavItem key={item.id} item={item} collapsed={isCollapsed} />)}

          {/* --- Dropdown Manajemen Tugas --- */}
          <div className="mb-2">
            <button
              onClick={() => showFullContent && setIsTaskManagementOpen(!isTaskManagementOpen)}
              className={`w-full flex items-center ${showFullContent ? 'justify-between px-4' : 'justify-center'} py-3 rounded-xl text-gray-300 hover:bg-gray-700/50 transition-all`}
            >
              <div className={`flex items-center ${showFullContent ? 'space-x-3' : ''}`}>
                <Calendar size={20} />
                {showFullContent && <span className="font-medium text-base">Manajemen Tugas</span>}
              </div>
              {showFullContent && (isTaskManagementOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />)}
            </button>
            
            {(isTaskManagementOpen || !showFullContent) && (
              <div className={`${showFullContent ? 'ml-4 mt-1 pl-4 border-l-2 border-gray-700' : 'mt-2'}`}>
                {taskMenuItems.map(item => (
                  <NavItem key={item.id} item={item} isSubItem={showFullContent} collapsed={isCollapsed} />
                ))}
              </div>
            )}
          </div>

          {/* --- Dropdown Manajemen Operasional --- */}
          <div className="mb-2">
            <button
              onClick={() => showFullContent && setIsMasterDataOpen(!isMasterDataOpen)}
              className={`w-full flex items-center ${showFullContent ? 'justify-between px-4' : 'justify-center'} py-3 rounded-xl text-gray-300 hover:bg-gray-700/50 transition-all`}
            >
              <div className={`flex items-center ${showFullContent ? 'space-x-3' : ''}`}>
                <Database size={20} />
                {showFullContent && <span className="font-medium text-base">Manajemen Operasional</span>}
              </div>
              {showFullContent && (isMasterDataOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />)}
            </button>
            
            {(isMasterDataOpen || !showFullContent) && (
              <div className={`${showFullContent ? 'ml-4 mt-1 pl-4 border-l-2 border-gray-700' : 'mt-2'}`}>
                {masterDataItems.map(item => (
                  <NavItem key={item.id} item={item} isSubItem={showFullContent} collapsed={isCollapsed} />
                ))}
              </div>
            )}
          </div>

          {/* Content Menu */}
          <div className="mt-4 pt-4 border-t border-gray-700">
            {contentMenuItems.map(item => <NavItem key={item.id} item={item} collapsed={isCollapsed} />)}
          </div>
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={onLogout}
            className={`w-full flex items-center ${showFullContent ? 'space-x-3 px-4' : 'justify-center'} py-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all group`}
          >
            <LogOut size={20} className="group-hover:rotate-180 transition-transform" />
            {showFullContent && <span className="font-medium">Keluar</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}