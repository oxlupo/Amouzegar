import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { BrandSloganSection } from './components/BrandSloganSection';
import { HeroVideoPiecesDetail } from './components/HeroVideoPiecesDetail';
import { CollectionSection } from './components/CollectionSection';
import { JewelryCategoryEdit } from './components/JewelryCategoryEdit';
import { JewelryCraftsmanship } from './components/JewelryCraftsmanship';
import { JewelryNameIndex } from './components/JewelryNameIndex';
import { JewelryCategoryPage } from './components/JewelryCategoryPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { AboutBrand } from './components/AboutBrand';
import { BespokeAtelier } from './components/BespokeAtelier';
import { Footer } from './components/Footer';
import { ProductModal } from './components/ProductModal';
import { VipBookingModal } from './components/VipBookingModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { AdminPanel } from './components/AdminPanel';
import { JEWELRY_ITEMS } from './data/jewelryData';
import { JewelryItem } from './types';

export default function App() {
  // Custom added items persisted in localStorage
  const [customJewelryItems, setCustomJewelryItems] = useState<JewelryItem[]>(() => {
    try {
      const saved = localStorage.getItem('amuzegar_custom_jewelry_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const jewelryItems = useMemo(() => {
    // Older saved items may reference salons that no longer exist; there is only the Ahmadabad gallery.
    const normalized = customJewelryItems.map((item) =>
      item.availability === 'موجود در گالری احمدآباد' || item.availability === 'تک‌نسخه آتلیه آموزگار'
        ? item
        : { ...item, availability: 'موجود در گالری احمدآباد' as const }
    );
    return [...normalized, ...JEWELRY_ITEMS];
  }, [customJewelryItems]);

  const [selectedProduct, setSelectedProduct] = useState<JewelryItem | null>(null);
  const [viewedProduct, setViewedProduct] = useState<JewelryItem | null>(null);
  const [isVipModalOpen, setIsVipModalOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Navigation view: Home full experience vs Dedicated Jewelry Products Category Page vs Product Detail Full Page vs Admin
  const [activeView, setActiveView] = useState<'home' | 'jewelry-catalog' | 'product-detail' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/admin' || path.startsWith('/admin/') || hash === '#/admin' || hash === '#admin') {
        return 'admin';
      }
    }
    return 'home';
  });
  const [catalogCategory, setCatalogCategory] = useState<string>('all');

  // URL listener for /admin route
  useEffect(() => {
    const handleUrlRouting = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/admin' || path.startsWith('/admin/') || hash === '#/admin' || hash === '#admin') {
        setActiveView('admin');
      } else if (activeView === 'admin' && path !== '/admin' && !hash.includes('admin')) {
        setActiveView('home');
      }
    };

    handleUrlRouting();
    window.addEventListener('popstate', handleUrlRouting);
    window.addEventListener('hashchange', handleUrlRouting);
    return () => {
      window.removeEventListener('popstate', handleUrlRouting);
      window.removeEventListener('hashchange', handleUrlRouting);
    };
  }, [activeView]);

  // Wishlist stored in localStorage
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('amuzegar_catalog_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Toast feedback notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleAddJewelry = (item: JewelryItem) => {
    setCustomJewelryItems((prev) => {
      const updated = [item, ...prev];
      localStorage.setItem('amuzegar_custom_jewelry_items', JSON.stringify(updated));
      return updated;
    });
    showToast(`اثر «${item.nameFa}» با موفقیت به کاتالوگ افزوده شد.`);
  };

  const handleDeleteJewelry = (id: string) => {
    setCustomJewelryItems((prev) => {
      const updated = prev.filter((i) => i.id !== id);
      localStorage.setItem('amuzegar_custom_jewelry_items', JSON.stringify(updated));
      return updated;
    });
    showToast('اثر مورد نظر حذف شد.');
  };

  const handleOpenAdmin = () => {
    window.history.pushState(null, '', '/admin');
    setActiveView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExitAdmin = () => {
    window.history.pushState(null, '', '/');
    setActiveView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleWishlist = (item: JewelryItem) => {
    setWishlistIds((prev) => {
      let updated: string[];
      if (prev.includes(item.id)) {
        updated = prev.filter((id) => id !== item.id);
        showToast(`«${item.nameFa}» از نشان‌شده‌ها حذف شد.`);
      } else {
        updated = [...prev, item.id];
        showToast(`«${item.nameFa}» به نشان‌شده‌های کاتالوگ افزوده شد.`);
      }
      localStorage.setItem('amuzegar_catalog_wishlist', JSON.stringify(updated));
      return updated;
    });
  };

  const handleScrollToSection = (id: string) => {
    if (activeView !== 'home') {
      window.history.pushState(null, '', '/');
      setActiveView('home');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    handleScrollToSection('collections');
  };

  const handleNavigateToCategory = (category: string) => {
    if (activeView === 'admin') {
      window.history.pushState(null, '', '/');
    }
    setCatalogCategory(category);
    setActiveView('jewelry-catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenProductDetail = (item: JewelryItem) => {
    if (activeView === 'admin') {
      window.history.pushState(null, '', '/');
    }
    setViewedProduct(item);
    setActiveView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHome = () => {
    if (activeView === 'admin') {
      window.history.pushState(null, '', '/');
    }
    setActiveView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const wishlistedItems = jewelryItems.filter((i) => wishlistIds.includes(i.id));

  return (
    <div className="min-h-screen bg-[#000000] text-stone-100 flex flex-col font-['Vazirmatn',sans-serif] selection:bg-rose-900/40 selection:text-rose-200">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 px-4 py-2.5 rounded-xl bg-[#111111] border border-stone-800 text-stone-200 text-xs shadow-2xl shadow-black animate-in fade-in slide-in-from-bottom-2">
          {toastMessage}
        </div>
      )}

      {activeView === 'admin' ? (
        /* Full Dedicated Ultra-Minimalist Admin Panel */
        <AdminPanel
          onAddJewelry={handleAddJewelry}
          onDeleteJewelry={handleDeleteJewelry}
          jewelryItems={jewelryItems}
          onExit={handleExitAdmin}
          onViewProduct={handleOpenProductDetail}
        />
      ) : (
        <>
          {/* Main Luxury Header */}
          <Navbar
            wishlistCount={wishlistIds.length}
            onOpenWishlist={() => setIsWishlistOpen(true)}
            onOpenVipBooking={() => setIsVipModalOpen(true)}
            onScrollToSection={handleScrollToSection}
            onSelectCategory={handleSelectCategory}
            onNavigateToCategory={handleNavigateToCategory}
            isCategoryPageActive={activeView === 'jewelry-catalog' || activeView === 'product-detail'}
            onGoHome={handleGoHome}
          />

          <main className="flex-1">
            {activeView === 'product-detail' && viewedProduct ? (
              /* Dedicated Full Product Showcase Page */
              <ProductDetailPage
                item={viewedProduct}
                allItems={jewelryItems}
                onSelectItem={handleOpenProductDetail}
                onBackToCategory={() => {
                  setCatalogCategory(viewedProduct.category);
                  setActiveView('jewelry-catalog');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onBackToHome={handleGoHome}
                wishlistIds={wishlistIds}
                onToggleWishlist={toggleWishlist}
                onOpenVipBooking={() => setIsVipModalOpen(true)}
              />
            ) : activeView === 'jewelry-catalog' ? (
              /* Dedicated Jewelry Products Page with lines dividing items (Van Cleef & Arpels style) */
              <JewelryCategoryPage
                category={catalogCategory}
                onSelectCategory={(cat) => setCatalogCategory(cat)}
                items={jewelryItems}
                onSelectItem={handleOpenProductDetail}
                wishlistIds={wishlistIds}
                onToggleWishlist={toggleWishlist}
                onBackToHome={handleGoHome}
                onOpenVipBooking={() => setIsVipModalOpen(true)}
              />
            ) : (
              /* Home View with all immersive sections */
              <>
                {/* 1. Hero Section with User's Uploaded Video (hero.webm) looping & lazy loaded */}
                <HeroSection
                  onOpenVipBooking={() => setIsVipModalOpen(true)}
                  onSelectJewelryItem={handleOpenProductDetail}
                  onExploreCatalog={() => handleScrollToSection('brand-slogan')}
                  heroItems={jewelryItems}
                />

                {/* 1.25 Brand Slogan & Manifesto ("Where light learns to stay.") */}
                <BrandSloganSection
                  onScrollNext={() => handleScrollToSection('hero-video-detail')}
                />

                {/* 2. Detailed Technical Showcase of Pieces Featured in hero.webm */}
                <HeroVideoPiecesDetail
                  items={jewelryItems}
                  onSelectItem={handleOpenProductDetail}
                  wishlistIds={wishlistIds}
                  onToggleWishlist={toggleWishlist}
                  onOpenVipBooking={() => setIsVipModalOpen(true)}
                />

                {/* 2.5 White typographic index: English names left, piece right */}
                <JewelryNameIndex
                  items={jewelryItems}
                  onSelectItem={handleOpenProductDetail}
                  onNavigateToCategory={handleNavigateToCategory}
                  onViewAll={() => handleNavigateToCategory('all')}
                />

                {/* 3. Catalog & Lookbook Showcase (Filterable, Searchable, No Prices) */}
                <CollectionSection
                  items={jewelryItems}
                  onSelectItem={handleOpenProductDetail}
                  wishlistIds={wishlistIds}
                  onToggleWishlist={toggleWishlist}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  onNavigateToCategory={handleNavigateToCategory}
                />

                <JewelryCategoryEdit onNavigateToCategory={handleNavigateToCategory} />
                <JewelryCraftsmanship />

                {/* 3.5 Bespoke custom-order service */}
                <BespokeAtelier onOpenVipBooking={() => setIsVipModalOpen(true)} />

                {/* 4. Contact Us, Google Maps Location & Exclusive Salon */}
                <AboutBrand onOpenVipBooking={() => setIsVipModalOpen(true)} />
              </>
            )}
          </main>

          {/* Luxury Minimalist Footer */}
          <Footer onOpenAdmin={handleOpenAdmin} />
        </>
      )}

      {/* Product Detail Modal (Gemological Passport & Inquiry) */}
      <ProductModal
        item={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        isWishlisted={selectedProduct ? wishlistIds.includes(selectedProduct.id) : false}
        onToggleWishlist={toggleWishlist}
        onOpenVipBooking={() => {
          setSelectedProduct(null);
          setIsVipModalOpen(true);
        }}
      />

      {/* VIP Private Salon Reservation Modal */}
      <VipBookingModal
        isOpen={isVipModalOpen}
        onClose={() => setIsVipModalOpen(false)}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        items={wishlistedItems}
        onRemoveItem={(id) => {
          setWishlistIds((prev) => {
            const updated = prev.filter((item) => item !== id);
            localStorage.setItem('amuzegar_catalog_wishlist', JSON.stringify(updated));
            return updated;
          });
        }}
        onSelectItem={(item) => {
          setIsWishlistOpen(false);
          handleOpenProductDetail(item);
        }}
        onOpenVipBooking={() => {
          setIsWishlistOpen(false);
          setIsVipModalOpen(true);
        }}
      />

    </div>
  );
}
