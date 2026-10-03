'use client';

import React, { useState, useMemo } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import TopHeader from '@/components/layout/TopHeader';

interface TreeNode {
  id: string; // e.g. "p-1", "s-1", "sub-1"
  numericId: number;
  type: 'primary' | 'secondary' | 'sub';
  name: string;
  description?: string;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  tags?: string[];
  productCount?: number;
  children?: TreeNode[];
  parentId?: number;
  primaryId?: number;
  breadcrumb?: string;
  icon?: string;
}

// Initial Static UI Mock Catalog Data (No API calls / backend integration)
const INITIAL_TREE_DATA: TreeNode[] = [
  {
    id: 'p-1',
    numericId: 1,
    type: 'primary',
    name: 'Furniture',
    icon: 'folder',
    description: 'High quality architectural & residential furniture systems.',
    slug: 'furniture',
    children: [
      {
        id: 's-1',
        numericId: 1,
        type: 'secondary',
        name: 'Wardrobes',
        productCount: 12,
        breadcrumb: 'FURNITURE > WARDROBES',
        description: 'Bespoke modular and built-in wardrobe solutions.',
        slug: 'wardrobes',
        children: [
          {
            id: 'sub-1',
            numericId: 101,
            type: 'sub',
            name: 'Sliding Doors',
            breadcrumb: 'FURNITURE > WARDROBES',
            description: 'Smooth sliding door wardrobe systems with acoustic dampers.',
            slug: 'sliding-doors',
            tags: ['SLIDING', 'MODULAR'],
          },
          {
            id: 'sub-2',
            numericId: 102,
            type: 'sub',
            name: 'Premium Collection',
            breadcrumb: 'FURNITURE > WARDROBES',
            description:
              'Exclusive high-end wardrobe systems featuring premium Italian leather finishes, integrated smart lighting, and soft-close acoustic dampening technology.',
            slug: 'premium-collection',
            metaTitle: 'Luxury Italian Wardrobes | Premium Collection',
            metaDescription:
              'Discover our premium range of bespoke wardrobes. Handcrafted excellence meets modern luxury.',
            tags: ['LUXURY', 'IMPORTED', 'ITALIAN'],
          },
          {
            id: 'sub-3',
            numericId: 103,
            type: 'sub',
            name: 'Hinged Doors',
            breadcrumb: 'FURNITURE > WARDROBES',
            description: 'Classic hinged door wardrobes with custom milled profiles.',
            slug: 'hinged-doors',
            tags: ['HINGED', 'CLASSIC'],
          },
        ],
      },
      {
        id: 's-2',
        numericId: 2,
        type: 'secondary',
        name: 'Seating',
        productCount: 8,
        breadcrumb: 'FURNITURE > SEATING',
        description: 'Ergonomic chairs, lounges, and modular sectional sofas.',
        slug: 'seating',
        children: [
          {
            id: 'sub-4',
            numericId: 104,
            type: 'sub',
            name: 'Lounge Chairs',
            breadcrumb: 'FURNITURE > SEATING',
            description: 'Comfort-engineered accent and lounge chairs.',
            slug: 'lounge-chairs',
            tags: ['ACCENT', 'LOUNGE'],
          },
          {
            id: 'sub-5',
            numericId: 105,
            type: 'sub',
            name: 'Dining Chairs',
            breadcrumb: 'FURNITURE > SEATING',
            description: 'Solid wood and upholstered dining seating.',
            slug: 'dining-chairs',
            tags: ['DINING', 'SOLID WOOD'],
          },
        ],
      },
    ],
  },
  {
    id: 'p-2',
    numericId: 2,
    type: 'primary',
    name: 'Lighting',
    icon: 'bulb',
    description: 'Architectural lighting fixtures, pendants, and recessed LEDs.',
    slug: 'lighting',
    children: [
      {
        id: 's-3',
        numericId: 3,
        type: 'secondary',
        name: 'Pendants',
        productCount: 6,
        breadcrumb: 'LIGHTING > PENDANTS',
        description: 'Statement drop lights and island chandeliers.',
        slug: 'pendants',
        children: [],
      },
      {
        id: 's-4',
        numericId: 4,
        type: 'secondary',
        name: 'Recessed & Track',
        productCount: 14,
        breadcrumb: 'LIGHTING > RECESSED & TRACK',
        description: 'Directional track lighting and magnetic track fixtures.',
        slug: 'recessed-track',
        children: [],
      },
    ],
  },
  {
    id: 'p-3',
    numericId: 3,
    type: 'primary',
    name: 'Finishes',
    icon: 'palette',
    description: 'Veneers, laminates, quartz surfaces, and metallic coatings.',
    slug: 'finishes',
    children: [
      {
        id: 's-5',
        numericId: 5,
        type: 'secondary',
        name: 'Natural Veneers',
        productCount: 22,
        breadcrumb: 'FINISHES > NATURAL VENEERS',
        description: 'FSC-certified smoked oak, walnut, and teak veneers.',
        slug: 'natural-veneers',
        children: [],
      },
    ],
  },
  {
    id: 'p-4',
    numericId: 4,
    type: 'primary',
    name: 'Hardware',
    icon: 'wrench',
    description: 'Precision hinges, slide systems, and custom architectural pulls.',
    slug: 'hardware',
    children: [],
  },
];

export default function CategoriesPage() {
  // Static In-Memory Tree State (UI Only)
  const [treeData, setTreeData] = useState<TreeNode[]>(INITIAL_TREE_DATA);

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Tree expanded nodes
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'p-1': true, // Furniture expanded
    's-1': true, // Wardrobes expanded
  });

  // Selected Category
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(
    INITIAL_TREE_DATA[0].children![0].children![1] // Default to "Premium Collection"
  );

  // Form Edit State
  const [categoryName, setCategoryName] = useState('Premium Collection');
  const [urlSlug, setUrlSlug] = useState('premium-collection');
  const [description, setDescription] = useState(
    'Exclusive high-end wardrobe systems featuring premium Italian leather finishes, integrated smart lighting, and soft-close acoustic dampening technology.'
  );
  const [metaTitle, setMetaTitle] = useState('Luxury Italian Wardrobes | Premium Collection');
  const [metaDescription, setMetaDescription] = useState(
    'Discover our premium range of bespoke wardrobes. Handcrafted excellence meets modern luxury.'
  );
  const [tags, setTags] = useState<string[]>(['LUXURY', 'IMPORTED', 'ITALIAN']);
  const [newTagInput, setNewTagInput] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);

  // Category Asset
  const [assetFile, setAssetFile] = useState<{
    name: string;
    size: string;
    dimensions: string;
  } | null>({
    name: 'hero_wardrobe_leather.jpg',
    size: '2.4 MB',
    dimensions: '2400 × 1200',
  });

  // Feedback & Toasts
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal State for adding new category
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalTargetParent, setModalTargetParent] = useState<{
    type: 'primary' | 'secondary';
    id: number;
    name: string;
  } | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDesc, setNewCategoryDesc] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Select a node and populate editor form
  const selectNode = (node: TreeNode) => {
    setSelectedNode(node);
    setCategoryName(node.name);
    setUrlSlug(node.slug || node.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
    setDescription(
      node.description ||
        (node.name === 'Premium Collection'
          ? 'Exclusive high-end wardrobe systems featuring premium Italian leather finishes, integrated smart lighting, and soft-close acoustic dampening technology.'
          : `Collection of premium ${node.name.toLowerCase()} offerings and architectural solutions.`)
    );
    setMetaTitle(
      node.metaTitle ||
        (node.name === 'Premium Collection'
          ? 'Luxury Italian Wardrobes | Premium Collection'
          : `${node.name} | Modern Architectural Catalog`)
    );
    setMetaDescription(
      node.metaDescription ||
        (node.name === 'Premium Collection'
          ? 'Discover our premium range of bespoke wardrobes. Handcrafted excellence meets modern luxury.'
          : `Explore bespoke ${node.name.toLowerCase()} designed for modern residential and commercial interiors.`)
    );
    setTags(node.tags || ['MODERN', 'ARCHITECTURAL']);
  };

  const toggleExpand = (id: string) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Filter tree based on search input
  const filteredTreeData = useMemo(() => {
    if (!searchQuery.trim()) return treeData;
    const q = searchQuery.toLowerCase();

    return treeData
      .map((p) => {
        const matchesPrimary = p.name.toLowerCase().includes(q);
        const matchingChildren = (p.children || [])
          .map((sec) => {
            const matchesSec = sec.name.toLowerCase().includes(q);
            const matchingSubs = (sec.children || []).filter((sub) =>
              sub.name.toLowerCase().includes(q)
            );
            if (matchesSec || matchingSubs.length > 0) {
              return { ...sec, children: matchingSubs };
            }
            return null;
          })
          .filter(Boolean) as TreeNode[];

        if (matchesPrimary || matchingChildren.length > 0) {
          return { ...p, children: matchingChildren };
        }
        return null;
      })
      .filter(Boolean) as TreeNode[];
  }, [treeData, searchQuery]);

  // ============================================================================
  // UI-ONLY ACTIONS: SAVE, DISCARD, ADD TAG, REMOVE TAG, ADD CATEGORY
  // ============================================================================

  const handleSaveCategory = () => {
    if (!selectedNode) return;

    // Update in-memory tree state
    const updateRecursive = (nodes: TreeNode[]): TreeNode[] => {
      return nodes.map((n) => {
        if (n.id === selectedNode.id) {
          return {
            ...n,
            name: categoryName,
            slug: urlSlug,
            description,
            metaTitle,
            metaDescription,
            tags,
          };
        }
        if (n.children && n.children.length > 0) {
          return { ...n, children: updateRecursive(n.children) };
        }
        return n;
      });
    };

    setTreeData((prev) => updateRecursive(prev));
    setSelectedNode((prev) =>
      prev
        ? {
            ...prev,
            name: categoryName,
            slug: urlSlug,
            description,
            metaTitle,
            metaDescription,
            tags,
          }
        : null
    );

    showToast(`Category "${categoryName}" updated successfully!`);
  };

  const handleDiscard = () => {
    if (selectedNode) {
      selectNode(selectedNode);
      showToast('Changes discarded.');
    }
  };

  const handleAddTag = () => {
    if (newTagInput.trim()) {
      const formatted = newTagInput.trim().toUpperCase();
      if (!tags.includes(formatted)) {
        setTags([...tags, formatted]);
      }
      setNewTagInput('');
      setIsAddingTag(false);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleCreateNewCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    const newId = Date.now();
    const slug = newCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (!modalTargetParent) {
      // Create root primary category
      const newPrimary: TreeNode = {
        id: `p-${newId}`,
        numericId: newId,
        type: 'primary',
        name: newCategoryName.trim(),
        description: newCategoryDesc.trim(),
        slug,
        icon: 'folder',
        children: [],
      };
      setTreeData((prev) => [...prev, newPrimary]);
      selectNode(newPrimary);
    } else if (modalTargetParent.type === 'primary') {
      // Create secondary category under primary
      const newSecondary: TreeNode = {
        id: `s-${newId}`,
        numericId: newId,
        type: 'secondary',
        name: newCategoryName.trim(),
        description: newCategoryDesc.trim(),
        slug,
        breadcrumb: `${modalTargetParent.name.toUpperCase()} > ${newCategoryName.toUpperCase()}`,
        children: [],
      };

      setTreeData((prev) =>
        prev.map((p) => {
          if (p.numericId === modalTargetParent.id) {
            return { ...p, children: [...(p.children || []), newSecondary] };
          }
          return p;
        })
      );
      setExpandedNodes((prev) => ({ ...prev, [`p-${modalTargetParent.id}`]: true }));
      selectNode(newSecondary);
    } else {
      // Create subcategory under secondary
      const newSub: TreeNode = {
        id: `sub-${newId}`,
        numericId: newId,
        type: 'sub',
        name: newCategoryName.trim(),
        description: newCategoryDesc.trim(),
        slug,
        breadcrumb: `${modalTargetParent.name.toUpperCase()} > ${newCategoryName.toUpperCase()}`,
      };

      setTreeData((prev) =>
        prev.map((p) => ({
          ...p,
          children: (p.children || []).map((sec) => {
            if (sec.numericId === modalTargetParent.id) {
              return { ...sec, children: [...(sec.children || []), newSub] };
            }
            return sec;
          }),
        }))
      );
      setExpandedNodes((prev) => ({ ...prev, [`s-${modalTargetParent.id}`]: true }));
      selectNode(newSub);
    }

    showToast(`Category "${newCategoryName}" created!`);
    setNewCategoryName('');
    setNewCategoryDesc('');
    setShowAddModal(false);
    setModalTargetParent(null);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex font-sans select-none">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-16 right-8 z-50 bg-neutral-900 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 border border-neutral-700 animate-fade-in">
          <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Sidebar */}
      <Sidebar />

      {/* Top Header */}
      <TopHeader onSearch={(q) => setSearchQuery(q)} />

      {/* Main Container */}
      <div className="ml-56 pt-16 flex-1 flex h-[calc(100vh-4rem)] overflow-hidden">
        {/* ===================================================================== */}
        {/* MIDDLE COLUMN: CATALOG STRUCTURE (Tree View) */}
        {/* ===================================================================== */}
        <section className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900 tracking-tight">Catalog Structure</h2>
            <button
              onClick={() => {
                setModalTargetParent(null);
                setShowAddModal(true);
              }}
              className="w-7 h-7 rounded-full border border-gray-300 hover:border-black text-gray-600 hover:text-black flex items-center justify-center text-sm font-semibold transition-colors"
              title="Add Root Category"
            >
              +
            </button>
          </div>

          {/* Tree Navigation */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {filteredTreeData.map((primary) => {
              const isExpanded = !!expandedNodes[primary.id];
              return (
                <div key={primary.id} className="space-y-0.5">
                  {/* Primary Category Row */}
                  <div
                    onClick={() => toggleExpand(primary.id)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-gray-100 text-xs font-bold text-gray-800 cursor-pointer transition-colors"
                  >
                    <svg
                      className={`w-3.5 h-3.5 text-gray-400 transition-transform ${
                        isExpanded ? 'rotate-90' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>

                    {/* Icon */}
                    {primary.icon === 'folder' && <span className="text-sm">📁</span>}
                    {primary.icon === 'bulb' && <span className="text-sm">💡</span>}
                    {primary.icon === 'palette' && <span className="text-sm">🎨</span>}
                    {primary.icon === 'wrench' && <span className="text-sm">🔧</span>}

                    <span className="truncate">{primary.name}</span>
                  </div>

                  {/* Secondary Categories Container */}
                  {isExpanded && primary.children && (
                    <div className="ml-5 pl-2 border-l border-gray-200 space-y-0.5">
                      {primary.children.map((sec) => {
                        const isSecExpanded = !!expandedNodes[sec.id];
                        const isSelected = selectedNode?.id === sec.id;

                        return (
                          <div key={sec.id} className="space-y-0.5">
                            {/* Secondary Category Row */}
                            <div
                              onClick={() => {
                                toggleExpand(sec.id);
                                selectNode(sec);
                              }}
                              className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs cursor-pointer transition-colors ${
                                isSelected
                                  ? 'bg-gray-100 font-bold text-black border border-gray-200'
                                  : 'hover:bg-gray-50 text-gray-700 font-semibold'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                {sec.children && sec.children.length > 0 && (
                                  <svg
                                    className={`w-3 h-3 text-gray-400 transition-transform ${
                                      isSecExpanded ? 'rotate-90' : ''
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                )}
                                <span className="text-gray-400 text-xs">▦</span>
                                <span className="truncate">{sec.name}</span>
                              </div>

                              {sec.productCount !== undefined && (
                                <span className="text-[10px] bg-gray-100 text-gray-500 font-bold px-1.5 py-0.2 rounded-full">
                                  {sec.productCount}
                                </span>
                              )}
                            </div>

                            {/* Sub-Categories Container */}
                            {isSecExpanded && sec.children && (
                              <div className="ml-4 pl-2 border-l border-gray-200 space-y-0.5">
                                {sec.children.map((sub) => {
                                  const isSubSelected = selectedNode?.id === sub.id;
                                  const isPremium = sub.name.toLowerCase().includes('premium');

                                  return (
                                    <div
                                      key={sub.id}
                                      onClick={() => selectNode(sub)}
                                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs cursor-pointer transition-colors ${
                                        isSubSelected
                                          ? 'bg-gray-100 font-bold text-black border border-gray-200 shadow-2xs'
                                          : 'hover:bg-gray-50 text-gray-600'
                                      }`}
                                    >
                                      {isPremium ? (
                                        <span className="text-amber-500 text-xs">★</span>
                                      ) : sub.name.toLowerCase().includes('sliding') ? (
                                        <span className="text-gray-400 text-xs">＝</span>
                                      ) : (
                                        <span className="text-gray-400 text-xs">▢</span>
                                      )}
                                      <span className="truncate">{sub.name}</span>
                                    </div>
                                  );
                                })}

                                {/* Add Sub-Category Button */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setModalTargetParent({
                                      type: 'secondary',
                                      id: sec.numericId,
                                      name: sec.name,
                                    });
                                    setShowAddModal(true);
                                  }}
                                  className="w-full text-left flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold text-gray-400 hover:text-black uppercase tracking-wider transition-colors"
                                >
                                  <span>+</span>
                                  <span>ADD SUB-CATEGORY</span>
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ===================================================================== */}
        {/* RIGHT COLUMN: CATEGORY DETAILS & EDITING */}
        {/* ===================================================================== */}
        <main className="flex-1 bg-white p-8 overflow-y-auto">
          {/* Top Breadcrumb & Actions */}
          <div className="flex items-center justify-between mb-2">
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              {selectedNode?.breadcrumb || 'FURNITURE > WARDROBES'}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleDiscard}
                className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg shadow-xs transition-colors"
              >
                Discard
              </button>
              <button
                onClick={handleSaveCategory}
                className="px-4 py-2 bg-black hover:bg-gray-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
              >
                Save Category
              </button>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-8">
            {categoryName || 'Category Details'}
          </h1>

          {/* Grid Layout for Settings Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Columns: General Information & SEO Settings */}
            <div className="lg:col-span-2 space-y-6">
              {/* Card 1: General Information */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-2xs">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-bold">
                    i
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">General Information</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  {/* Category Name */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                      CATEGORY NAME
                    </label>
                    <input
                      type="text"
                      value={categoryName}
                      onChange={(e) => {
                        setCategoryName(e.target.value);
                        setUrlSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                      }}
                      className="w-full text-xs font-medium text-gray-900 border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>

                  {/* URL Slug */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                      URL SLUG
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-black">
                      <span className="px-3 py-2.5 bg-gray-50 text-gray-400 text-xs font-medium border-r border-gray-300">
                        /cat/
                      </span>
                      <input
                        type="text"
                        value={urlSlug}
                        onChange={(e) => setUrlSlug(e.target.value)}
                        className="w-full text-xs font-medium text-gray-900 p-2.5 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    DESCRIPTION
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter category description..."
                    className="w-full text-xs text-gray-800 border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-black leading-relaxed resize-none"
                  />
                </div>
              </div>

              {/* Card 2: SEO Settings */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-2xs">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <h3 className="text-sm font-bold text-gray-900">SEO Settings</h3>
                </div>

                {/* Meta Title */}
                <div className="mb-4">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    META TITLE
                  </label>
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    className="w-full text-xs font-medium text-gray-900 border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>

                {/* Meta Description */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    META DESCRIPTION
                  </label>
                  <textarea
                    rows={3}
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="Enter meta description for search engines..."
                    className="w-full text-xs text-gray-800 border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-black leading-relaxed resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Category Asset & Internal Tags */}
            <div className="space-y-6">
              {/* Card 3: Category Asset */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-2xs">
                <h3 className="text-sm font-bold text-gray-900 mb-4">Category Asset</h3>

                {/* Upload Box */}
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-gray-400 transition-colors cursor-pointer bg-gray-50/50">
                  <div className="w-10 h-10 mx-auto mb-2 text-gray-400 flex items-center justify-center">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
                    DRAG & DROP TO UPDATE
                  </div>
                  <div className="text-[10px] text-gray-400">PNG, JPG up to 10MB</div>
                </div>

                {/* Current Asset Info */}
                {assetFile && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded bg-gray-200 flex items-center justify-center text-gray-500 flex-shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-gray-900 truncate">{assetFile.name}</div>
                        <div className="text-[10px] text-gray-400">
                          {assetFile.size} • {assetFile.dimensions}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setAssetFile(null)}
                      className="p-1 text-red-500 hover:text-red-700 transition-colors"
                      title="Delete asset"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Card 4: Internal Tags */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-2xs">
                <h3 className="text-sm font-bold text-gray-900 mb-4">Internal Tags</h3>

                <div className="flex flex-wrap items-center gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-md"
                    >
                      <span>{tag}</span>
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="text-gray-400 hover:text-red-500 font-normal transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}

                  {/* Add Tag Button / Input */}
                  {isAddingTag ? (
                    <div className="inline-flex items-center gap-1 border border-gray-300 rounded-md px-2 py-0.5">
                      <input
                        type="text"
                        value={newTagInput}
                        onChange={(e) => setNewTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddTag();
                          if (e.key === 'Escape') setIsAddingTag(false);
                        }}
                        placeholder="Tag name..."
                        className="text-xs focus:outline-none w-20 uppercase"
                        autoFocus
                      />
                      <button onClick={handleAddTag} className="text-xs font-bold text-black">
                        ✓
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsAddingTag(true)}
                      className="inline-flex items-center gap-1 px-3 py-1 border border-dashed border-gray-300 hover:border-black text-gray-500 hover:text-black text-xs font-bold rounded-md transition-colors"
                    >
                      <span>+ ADD TAG</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ========================================================================= */}
      {/* ADD CATEGORY MODAL */}
      {/* ========================================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6">
            <h3 className="text-base font-bold text-gray-900 mb-2">
              {modalTargetParent ? `Add to "${modalTargetParent.name}"` : 'Create Root Category'}
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Enter details for the new category to add to the catalog structure.
            </p>

            <form onSubmit={handleCreateNewCategory} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  CATEGORY NAME
                </label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g. Walk-in Closets"
                  className="w-full text-xs border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-black"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  DESCRIPTION (OPTIONAL)
                </label>
                <textarea
                  rows={2}
                  value={newCategoryDesc}
                  onChange={(e) => setNewCategoryDesc(e.target.value)}
                  placeholder="Brief description..."
                  className="w-full text-xs border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-black resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-black hover:bg-gray-800 rounded-lg shadow-xs transition-colors"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
