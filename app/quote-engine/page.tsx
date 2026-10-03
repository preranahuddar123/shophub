'use client';

import React, { useState, useMemo, useEffect } from 'react';
import QuoteTopNav from '@/components/quote-engine/QuoteTopNav';
import QuoteContextSidebar from '@/components/quote-engine/QuoteContextSidebar';
import QuoteCatalogSection, { CatalogProduct } from '@/components/quote-engine/QuoteCatalogSection';
import QuoteSidebar from '@/components/quote-engine/QuoteSidebar';
import QuoteBottomBar from '@/components/quote-engine/QuoteBottomBar';
import { getAllPrimaryCategories, getAllSecondaryCategories } from '@/lib/api/category.service';
import { getProjectsForQuoteEngine, getCustomersFromLeads } from '@/lib/api/leads.service';
import { getRequirementScope, transformScopeToRooms } from '@/lib/api/requirement-scope.service';

// Local UI-only Interfaces
export interface Customer {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
}

export interface Project {
  id: number;
  projectName: string;
  customerId?: number;
  status?: string;
}

export interface Room {
  id: number;
  roomName: string;
  projectId?: number;
  units?: string[];
  falseCeilingRequired?: boolean;
  notes?: string | null;
}

export interface QuoteItemModel {
  id: number;
  prodId: number;
  offeringName: string;
  category?: string;
  skuId?: string;
  room: string;
  quantity: number;
  unitPrice: number;
  originalPrice?: number;
  totalPrice?: number;
  costPrice?: number;
  imageUrl?: string;
}

export interface QuoteModel {
  id: number;
  quoteNumber?: string;
  customerId?: number;
  customerName?: string;
  projectId?: number;
  projectName?: string;
  currentRoom?: string;
  validityPeriod?: string;
  internalNotes?: string;
  subtotal: number;
  discountPercentage?: number;
  totalDiscount?: number;
  estimatedFreight?: number;
  grandTotal: number;
  designerMarginPercentage?: number;
  designerMarginAmount?: number;
  projectedProfit?: number;
  status?: string;
  items: QuoteItemModel[];
}

interface RawProductData {
  prodId?: number | string;
  offering_name?: string;
  category?: string;
  sku_id?: string;
  brand?: string;
  description?: string;
  pricing?: {
    selling_price?: number;
    cost_price?: number;
    margin_percentage?: number;
  };
  inventory?: {
    current_stock?: number;
    minimum_stock_level?: number;
  };
  media?: {
    primary_image?: string;
  };
  lead_time?: number;
  [key: string]: unknown;
}

interface RawCategoryData {
  primaryCategoryName?: string;
  secondaryCategoryName?: string;
  products?: RawProductData[] | unknown[];
  [key: string]: unknown;
}

// ============================================================================
// Helper to compute quote metrics
// ============================================================================
const computeTotals = (items: QuoteItemModel[], discountPct = 5) => {
  const subtotal = items.reduce((sum, item) => sum + (item.totalPrice || item.unitPrice * item.quantity), 0);
  const totalCost = items.reduce((sum, item) => sum + ((item.costPrice || 0) * item.quantity), 0);
  const totalDiscount = Math.round(subtotal * (discountPct / 100));
  const estimatedFreight = items.length > 0 ? 1500 : 0;
  const grandTotal = Math.max(0, subtotal - totalDiscount + estimatedFreight);
  const projectedProfit = Math.max(0, (subtotal - totalDiscount) - totalCost);
  const designerMarginPercentage = subtotal > 0 ? Number(((projectedProfit / subtotal) * 100).toFixed(1)) : 24.5;
  const designerMarginAmount = projectedProfit;

  return {
    subtotal,
    discountPercentage: discountPct,
    totalDiscount,
    estimatedFreight,
    grandTotal,
    projectedProfit,
    designerMarginPercentage,
    designerMarginAmount,
  };
};

export default function QuoteEnginePage() {
  // Navigation & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Customer, Project, Room State
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);

  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);

  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);

  const [validityPeriod, setValidityPeriod] = useState<string>('30 Days (Standard)');
  const [internalNotes, setInternalNotes] = useState<string>(
    'Client requested brushed brass finish for all hardware and fittings.'
  );

  // Quote State - starts empty, populated as user adds items
  const initialTotals = computeTotals([], 5);
  const [quote, setQuote] = useState<QuoteModel>({
    id: 1,
    quoteNumber: 'QTE-2026-1001',
    customerId: undefined,
    customerName: undefined,
    projectId: undefined,
    projectName: undefined,
    currentRoom: '',
    validityPeriod: '30 Days (Standard)',
    internalNotes: '',
    items: [],
    ...initialTotals,
  });

  // Products State - Load from API
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Quote Sidebar State - Only show when user clicks shopping cart
  const [isQuoteSidebarOpen, setIsQuoteSidebarOpen] = useState(false);
  
  // Calculate cart item count for the shopping cart badge
  const cartItemCount = quote.items.reduce((sum, item) => sum + item.quantity, 0);

  // UI Feedback / Alerts
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // ============================================================================
  // Load data from APIs on mount
  // ============================================================================
  
  // ============================================================================
  // Handle URL parameters for adding items from other pages
  // ============================================================================
  useEffect(() => {
    const handleURLParams = () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const shouldAddToCart = urlParams.get('addToCart');
        
        if (shouldAddToCart === 'true') {
          const prodId = urlParams.get('prodId');
          const offeringName = urlParams.get('offeringName');
          const price = urlParams.get('price');
          
          if (prodId && offeringName && price) {
            const priceNum = parseFloat(price);
            const costNum = parseFloat(urlParams.get('cost') || '0');
            const room = selectedRoom || 'Kitchen Island';

            setQuote((prev) => {
              const newItem: QuoteItemModel = {
                id: Date.now(),
                prodId: parseInt(prodId),
                offeringName: offeringName,
                category: urlParams.get('category') || 'GENERAL',
                skuId: urlParams.get('skuId') || '',
                room,
                quantity: 1,
                unitPrice: priceNum,
                originalPrice: priceNum,
                totalPrice: priceNum,
                costPrice: costNum,
                imageUrl: urlParams.get('image') || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400',
              };

              const updatedItems = [...prev.items, newItem];
              const totals = computeTotals(updatedItems, prev.discountPercentage ?? 5);

              return {
                ...prev,
                items: updatedItems,
                ...totals,
              };
            });
            
            // Open the quote sidebar automatically
            setIsQuoteSidebarOpen(true);
            
            // Clean up URL parameters
            window.history.replaceState({}, '', window.location.pathname);
            
            // Show success message
            setToastMessage(`Added "${offeringName}" to your quote!`);
            setTimeout(() => setToastMessage(''), 3000);
          }
        }
      } catch {
        // Silently handle URL parameter errors
      }
    };

    setTimeout(handleURLParams, 100);
  }, [selectedRoom]);

  // ============================================================================
  // Load data from APIs on mount
  // ============================================================================
  
  // Load customers + projects from leads API in one shot
  useEffect(() => {
    const loadFromLeads = async () => {
      // Customers
      try {
        const customersData = await getCustomersFromLeads();
        setCustomers(customersData);
        if (customersData.length > 0) {
          setSelectedCustomerId(customersData[0].id);
          setQuote((prev) => ({
            ...prev,
            customerId: customersData[0].id,
            customerName: customersData[0].name,
          }));
        }
      } catch { /* leave empty */ }

      // Projects
      try {
        setIsLoadingProjects(true);
        const projectsData = await getProjectsForQuoteEngine();
        setProjects(projectsData);
        if (projectsData.length > 0) {
          const first = projectsData[0];
          setSelectedProjectId(first.id);
          setQuote((prev) => ({
            ...prev,
            projectId: first.id,
            projectName: first.projectName,
          }));
        }
      } catch { /* leave empty */ } finally {
        setIsLoadingProjects(false);
      }
    };

    loadFromLeads();
  }, []);

  // ============================================================================
  // Load Requirement Scope & Rooms from CRM API whenever active project changes
  // ============================================================================
  useEffect(() => {
    if (!selectedProjectId) return;

    const loadRoomsFromScope = async () => {
      try {
        const currentProject = projects.find((p) => p.id === selectedProjectId);
        let leadType = 'glead';
        const projName = currentProject?.projectName || '';
        if (projName.includes('ML-') || projName.toLowerCase().includes('meta')) {
          leadType = 'mlead';
        } else if (projName.includes('AL-') || projName.toLowerCase().includes('add lead')) {
          leadType = 'addlead';
        } else if (projName.includes('FL-') || projName.toLowerCase().includes('form')) {
          leadType = 'formlead';
        }

        // Call the CRM requirement scope API
        const scopeData = await getRequirementScope(selectedProjectId, leadType);
        const transformedRooms = transformScopeToRooms(scopeData, selectedProjectId);

        if (transformedRooms.length > 0) {
          setRooms(transformedRooms);
          setSelectedRoom((prevRoom) => {
            const exists = transformedRooms.some(
              (r) => r.roomName.toLowerCase() === prevRoom.toLowerCase()
            );
            const nextRoom = exists && prevRoom ? prevRoom : transformedRooms[0].roomName;
            setQuote((prev) => ({ ...prev, currentRoom: nextRoom }));
            return nextRoom;
          });
        }
      } catch (err) {
        console.error('Failed to load requirement scope for project:', err);
      }
    };

    loadRoomsFromScope();
  }, [selectedProjectId, projects]);

  // Load products from API
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoadingProducts(true);
        
        // Call both primary and secondary categories APIs
        const [primaryResponse, secondaryResponse] = await Promise.all([
          getAllPrimaryCategories(),
          getAllSecondaryCategories(),
        ]);

        // Extract products from both responses and deduplicate by prodId
        const productsMap = new Map<number, CatalogProduct>();

        // Process primary categories
        if (Array.isArray(primaryResponse)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          primaryResponse.forEach((category: any) => {
            if (category.products && Array.isArray(category.products)) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              category.products.forEach((product: any) => {
                const numId = typeof product.prodId === 'string' ? parseInt(product.prodId, 10) : product.prodId;
                if (numId && !productsMap.has(numId)) {
                  productsMap.set(numId, {
                    prodId: numId || 0,
                    offering_name: product.offering_name || 'Unknown Product',
                    category: product.category || category.primaryCategoryName || 'GENERAL',
                    sku_id: product.sku_id || '',
                    brand: product.brand || '',
                    short_desc: product.description || '',
                    pricing: {
                      selling_price: product.pricing?.selling_price || 0,
                      cost_price: product.pricing?.cost_price || 0,
                      margin_percentage: product.pricing?.margin_percentage || 0,
                    },
                    inventory: {
                      current_stock: product.inventory?.current_stock || 0,
                      minimum_stock_level: product.inventory?.minimum_stock_level || 0,
                    },
                    media: {
                      primary_image: product.media?.primary_image || '',
                    },
                    lead_time: product.lead_time || 0,
                  });
                }
              });
            }
          });
        }

        // Process secondary categories
        if (Array.isArray(secondaryResponse)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          secondaryResponse.forEach((category: any) => {
            if (category.products && Array.isArray(category.products)) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              category.products.forEach((product: any) => {
                const numId = typeof product.prodId === 'string' ? parseInt(product.prodId, 10) : product.prodId;
                if (numId && !productsMap.has(numId)) {
                  productsMap.set(numId, {
                    prodId: numId || 0,
                    offering_name: product.offering_name || 'Unknown Product',
                    category: product.category || category.secondaryCategoryName || 'GENERAL',
                    sku_id: product.sku_id || '',
                    brand: product.brand || '',
                    short_desc: product.description || '',
                    pricing: {
                      selling_price: product.pricing?.selling_price || 0,
                      cost_price: product.pricing?.cost_price || 0,
                      margin_percentage: product.pricing?.margin_percentage || 0,
                    },
                    inventory: {
                      current_stock: product.inventory?.current_stock || 0,
                      minimum_stock_level: product.inventory?.minimum_stock_level || 0,
                    },
                    media: {
                      primary_image: product.media?.primary_image || '',
                    },
                    lead_time: product.lead_time || 0,
                  });
                }
              });
            }
          });
        }

        const loadedProducts = Array.from(productsMap.values());
        setProducts(loadedProducts);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    loadProducts();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Filter products by search query and selected unit from CRM requirement scope
  const searchedProducts = useMemo(() => {
    let list = products;
    if (selectedUnit) {
      const u = selectedUnit.toLowerCase();
      const filtered = list.filter(
        (p) =>
          p.offering_name.toLowerCase().includes(u) ||
          (p.category && p.category.toLowerCase().includes(u)) ||
          (p.sku_id && p.sku_id.toLowerCase().includes(u)) ||
          (p.short_desc && p.short_desc.toLowerCase().includes(u))
      );
      if (filtered.length > 0) {
        list = filtered;
      }
    }
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (p) =>
        p.offering_name.toLowerCase().includes(q) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.sku_id && p.sku_id.toLowerCase().includes(q)) ||
        (p.short_desc && p.short_desc.toLowerCase().includes(q))
    );
  }, [products, searchQuery, selectedUnit]);

  // ============================================================================
  // UI-ONLY HANDLERS (No API Calls)
  // ============================================================================

  const handleSelectCustomer = (id: number) => {
    setSelectedCustomerId(id);
    const selected = customers.find((c) => c.id === id);
    setQuote((prev) => ({
      ...prev,
      customerId: id,
      customerName: selected?.name,
    }));
    const matchingProject = projects.find((p) => p.id === id);
    if (matchingProject) {
      setSelectedProjectId(matchingProject.id);
      setSelectedUnit(null);
      setQuote((prev) => ({
        ...prev,
        projectId: matchingProject.id,
        projectName: matchingProject.projectName,
      }));
    }
  };

  const handleSelectProject = (id: number) => {
    setSelectedProjectId(id);
    setSelectedUnit(null);
    const selected = projects.find((p) => p.id === id);
    setQuote((prev) => ({
      ...prev,
      projectId: id,
      projectName: selected?.projectName,
    }));
    const matchingCustomer = customers.find((c) => c.id === id);
    if (matchingCustomer) {
      setSelectedCustomerId(matchingCustomer.id);
      setQuote((prev) => ({
        ...prev,
        customerId: matchingCustomer.id,
        customerName: matchingCustomer.name,
      }));
    }
  };

  const handleSelectRoom = (roomName: string) => {
    setSelectedRoom(roomName);
    setSelectedUnit(null);
    setQuote((prev) => ({
      ...prev,
      currentRoom: roomName,
    }));
  };

  const handleAddRoom = (newRoomName: string) => {
    const newRoom: Room = {
      id: Date.now(),
      roomName: newRoomName,
      projectId: selectedProjectId || undefined,
    };
    setRooms((prev) => [...prev, newRoom]);
    setSelectedRoom(newRoomName);
    setQuote((prev) => ({
      ...prev,
      currentRoom: newRoomName,
    }));
    showToast(`Room "${newRoomName}" added!`);
  };

  const handleValidityChange = (val: string) => {
    setValidityPeriod(val);
    setQuote((prev) => ({
      ...prev,
      validityPeriod: val,
    }));
  };

  const handleNotesChange = (notes: string) => {
    setInternalNotes(notes);
    setQuote((prev) => ({
      ...prev,
      internalNotes: notes,
    }));
  };

  const handleAddToCart = (product: CatalogProduct, quantity: number = 1) => {
    const price = product.pricing?.selling_price || 0;
    const cost = product.pricing?.cost_price || 0;
    const room = selectedRoom || 'Kitchen Island';

    setQuote((prev) => {
      // Check if product already exists in the selected room
      const existingIndex = prev.items.findIndex(
        (item) => item.prodId === product.prodId && item.room === room
      );

      let updatedItems: QuoteItemModel[];
      if (existingIndex > -1) {
        // Increment quantity
        updatedItems = prev.items.map((item, idx) => {
          if (idx === existingIndex) {
            const newQty = item.quantity + quantity;
            return {
              ...item,
              quantity: newQty,
              totalPrice: item.unitPrice * newQty,
            };
          }
          return item;
        });
      } else {
        // Add new line item
        const newItem: QuoteItemModel = {
          id: Date.now(),
          prodId: product.prodId,
          offeringName: product.offering_name,
          category: product.category,
          skuId: product.sku_id,
          room,
          quantity,
          unitPrice: price,
          originalPrice: price,
          totalPrice: price * quantity,
          costPrice: cost,
          imageUrl: product.media?.primary_image || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400',
        };
        updatedItems = [...prev.items, newItem];
      }

      const totals = computeTotals(updatedItems, prev.discountPercentage ?? 5);
      return {
        ...prev,
        items: updatedItems,
        ...totals,
      };
    });

    // Open the sidebar and confirm
    setIsQuoteSidebarOpen(true);
    showToast(`Added ${quantity}x "${product.offering_name}" to ${room}`);
  };

  const handleUpdateQuantity = (itemId: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(itemId);
      return;
    }

    setQuote((prev) => {
      const updatedItems = prev.items.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity: newQty,
            totalPrice: item.unitPrice * newQty,
          };
        }
        return item;
      });

      const totals = computeTotals(updatedItems, prev.discountPercentage ?? 5);
      return {
        ...prev,
        items: updatedItems,
        ...totals,
      };
    });
  };

  const handleRemoveItem = (itemId: number) => {
    setQuote((prev) => {
      const updatedItems = prev.items.filter((item) => item.id !== itemId);
      const totals = computeTotals(updatedItems, prev.discountPercentage ?? 5);
      return {
        ...prev,
        items: updatedItems,
        ...totals,
      };
    });
    showToast('Item removed from quote');
  };

  const handleClearQuote = () => {
    if (confirm('Are you sure you want to clear all items in this quote?')) {
      setQuote((prev) => {
        const totals = computeTotals([], prev.discountPercentage ?? 5);
        return {
          ...prev,
          items: [],
          ...totals,
        };
      });
      showToast('Quote cleared');
    }
  };

  const handleShareQuote = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href);
      showToast('Quote link copied to clipboard!');
    }
  };

  const handleGeneratePdf = () => {
    setIsGeneratingPdf(true);
    setTimeout(() => {
      setIsGeneratingPdf(false);
      window.print();
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans select-none">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-16 right-8 z-50 bg-neutral-900 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 animate-bounce">
          <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation */}
      <QuoteTopNav
        searchQuery={searchQuery}
        onSearchChange={(q) => setSearchQuery(q)}
        cartItemCount={cartItemCount}
        onToggleSidebar={() => setIsQuoteSidebarOpen(!isQuoteSidebarOpen)}
        isSidebarOpen={isQuoteSidebarOpen}
      />

      {/* Main Workspace with Three-Column Layout */}
      <div className="flex-1 flex w-full">
        {/* Left Column: Customer, Project & Room Context */}
        <QuoteContextSidebar
          customers={customers}
          selectedCustomerId={selectedCustomerId}
          onSelectCustomer={handleSelectCustomer}
          projects={projects}
          selectedProjectId={selectedProjectId}
          onSelectProject={handleSelectProject}
          isLoadingProjects={isLoadingProjects}
          rooms={rooms}
          selectedRoom={selectedRoom}
          onSelectRoom={handleSelectRoom}
          onAddRoom={handleAddRoom}
          selectedUnit={selectedUnit}
          onSelectUnit={setSelectedUnit}
          validityPeriod={validityPeriod}
          onValidityChange={handleValidityChange}
          internalNotes={internalNotes}
          onNotesChange={handleNotesChange}
        />

        {/* Center Column: Interactive Catalog & Smart Suggestions */}
        <main className={`ml-64 ${isQuoteSidebarOpen ? 'mr-80' : 'mr-0'} pt-14 pb-24 flex-1 bg-white min-h-[calc(100vh-3.5rem-5rem)] overflow-y-auto transition-all duration-300`}>
          <QuoteCatalogSection
            products={searchedProducts}
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => setSelectedCategory(cat)}
            onAddToCart={handleAddToCart}
            isLoading={isLoadingProducts}
          />
        </main>

        {/* Right Column: Live Quote Sidebar - Only show when cart icon is clicked */}
        {isQuoteSidebarOpen && (
          <QuoteSidebar
            quote={quote}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearQuote={handleClearQuote}
            onClose={() => {
              setIsQuoteSidebarOpen(false);
            }}
          />
        )}
      </div>

      {/* Bottom Sticky Action Bar */}
      <QuoteBottomBar
        grandTotal={quote.grandTotal}
        designerMarginPct={quote.designerMarginPercentage ?? 24.5}
        designerMarginAmount={quote.designerMarginAmount ?? 3802.0}
        projectedProfit={quote.projectedProfit ?? 5240.0}
        onShareQuote={handleShareQuote}
        onGeneratePdf={handleGeneratePdf}
        isGeneratingPdf={isGeneratingPdf}
      />
    </div>
  );
}
