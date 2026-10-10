'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import TopHeader from '@/components/layout/TopHeader';
import {
  getAllPrimaryCategories,
  getAllSecondaryCategories,
  getCategoriesByPrimary,
  createPrimaryCategory,
  createSecondaryCategory,
  createSubCategory,
  updatePrimaryCategory,
  updateSecondaryCategory,
  getPrimaryCategoryById,
  getSecondaryCategoryById,
  deletePrimaryCategory,
  deleteSecondaryCategory,
} from '@/lib/api/category.service';

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
  pathNames?: string[];
  icon?: string;
  imageUrl?: string;
}

function toBreadcrumb(names: string[]) {
  return names.map((name) => name.trim().toUpperCase()).filter(Boolean).join(' > ');
}

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function mapSecondary(
  cat: any,
  ancestors: string[] = [],
  type: TreeNode['type'] = 'secondary',
  primaryId?: number
): TreeNode {
  const id = Number(cat.secondaryCategoryId ?? cat.id ?? 0);
  const name = cat.secondaryCategoryName || cat.name || 'Category';
  const nested = Array.isArray(cat.subCategory) ? cat.subCategory : [];
  const parentPrimary = Number(cat.primaryCategoryId ?? primaryId ?? 0) || undefined;
  const pathNames = [...ancestors, name];
  return {
    id: `${type === 'sub' ? 'sub' : 's'}-${id}`,
    numericId: id,
    type,
    name,
    description: cat.secondaryCategoryDescription || cat.description || '',
    slug: cat.seo?.url_slug || slugify(name),
    metaTitle: cat.seo?.page_title || '',
    metaDescription: cat.seo?.meta_desc || '',
    tags: cat.internalTags || cat.seo?.keywords || [],
    imageUrl: cat.imageUrl || '',
    primaryId: parentPrimary,
    productCount: Array.isArray(cat.products) ? cat.products.length : undefined,
    pathNames,
    breadcrumb: toBreadcrumb(pathNames),
    children: nested.map((child: any) => mapSecondary(child, pathNames, 'sub', parentPrimary)),
  };
}

function mapPrimary(cat: any, secondaries: any[] = []): TreeNode {
  const id = Number(cat.primaryCategoryId ?? cat.id ?? 0);
  const name = cat.primaryCategoryName || cat.name || 'Category';
  const pathNames = [name];
  const kids = (secondaries.length ? secondaries : cat.subCategory || []).map((s: any) =>
    mapSecondary(s, pathNames, 'secondary', id)
  );
  return {
    id: `p-${id}`,
    numericId: id,
    type: 'primary',
    name,
    icon: 'folder',
    description: cat.primaryCategoryDescription || cat.description || '',
    slug: cat.seo?.url_slug || slugify(name),
    metaTitle: cat.seo?.page_title || '',
    metaDescription: cat.seo?.meta_desc || '',
    tags: cat.internalTags || cat.seo?.keywords || [],
    imageUrl: cat.imageUrl || '',
    productCount: Array.isArray(cat.products) ? cat.products.length : undefined,
    pathNames,
    breadcrumb: toBreadcrumb(pathNames),
    children: kids,
  };
}

export default function CategoriesPage() {
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [isLoadingTree, setIsLoadingTree] = useState(true);

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Tree expanded nodes
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});

  // Selected Category
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);

  // Form Edit State
  const [categoryName, setCategoryName] = useState('');
  const [urlSlug, setUrlSlug] = useState('');
  const [description, setDescription] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [newTagInput, setNewTagInput] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);

  // Category Asset
  const [assetFile, setAssetFile] = useState<{
    name: string;
    size: string;
    dimensions: string;
  } | null>(null);

  // Feedback & Toasts
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

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

  const loadCategories = useCallback(async (selectId?: string) => {
    setIsLoadingTree(true);
    try {
      const [primaries, allSecondaries] = await Promise.all([
        getAllPrimaryCategories(),
        getAllSecondaryCategories(),
      ]);
      const grouped = new Map<number, any[]>();
      for (const s of allSecondaries as any[]) {
        const pid = Number(s.primaryCategoryId ?? s.primary_category_id ?? s.primaryCategory?.primaryCategoryId ?? 0);
        if (!pid) continue;
        const list = grouped.get(pid) || [];
        list.push(s);
        grouped.set(pid, list);
      }
      const tree = await Promise.all(
        primaries.map(async (primary) => {
          const id = primary.primaryCategoryId;
          const nested = Array.isArray(primary.subCategory) ? primary.subCategory : [];
          let secondaries = nested.length ? nested : id != null ? await getCategoriesByPrimary(id) : [];
          if (!secondaries.length && id != null) secondaries = grouped.get(Number(id)) || [];
          return mapPrimary(primary, secondaries);
        })
      );
      setTreeData(tree);
      setExpandedNodes((prev) => {
        const next = { ...prev };
        tree.forEach((node) => {
          if (next[node.id] === undefined) next[node.id] = true;
        });
        return next;
      });
      const flat = tree.flatMap((p) => [p, ...(p.children || []).flatMap((s) => [s, ...(s.children || [])])]);
      const chosen = (selectId && flat.find((n) => n.id === selectId)) || flat[0] || null;
      if (chosen) {
        setSelectedNode(chosen);
        setCategoryName(chosen.name);
        setUrlSlug(chosen.slug || slugify(chosen.name));
        setDescription(chosen.description || '');
        setMetaTitle(chosen.metaTitle || '');
        setMetaDescription(chosen.metaDescription || '');
        setTags(chosen.tags || []);
        setImageUrl(chosen.imageUrl || '');
        setAssetFile(chosen.imageUrl ? { name: chosen.imageUrl.split('/').pop() || 'image', size: '', dimensions: '' } : null);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to load categories');
    } finally {
      setIsLoadingTree(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const writePayload = () => ({
    name: categoryName.trim(),
    description: description.trim(),
    imageUrl,
    seo: {
      page_title: metaTitle.trim() || categoryName.trim(),
      meta_desc: metaDescription.trim() || description.trim(),
      url_slug: urlSlug.trim() || slugify(categoryName),
      keywords: tags,
    },
    internalTags: tags,
  });

  const applyNodeToForm = (node: TreeNode) => {
    setSelectedNode(node);
    setCategoryName(node.name);
    setUrlSlug(node.slug || slugify(node.name));
    setDescription(node.description || '');
    setMetaTitle(node.metaTitle || '');
    setMetaDescription(node.metaDescription || '');
    setTags(node.tags || []);
    setImageUrl(node.imageUrl || '');
    setAssetFile(node.imageUrl ? { name: node.imageUrl.split('/').pop() || 'image', size: '', dimensions: '' } : null);
  };

  const selectNode = async (node: TreeNode) => {
    applyNodeToForm(node);
    try {
      if (node.type === 'primary') {
        const detail = await getPrimaryCategoryById(node.numericId);
        if (detail) {
          const mapped = mapPrimary(detail, []);
          applyNodeToForm({ ...mapped, children: node.children, id: node.id });
        }
      } else {
        const detail = await getSecondaryCategoryById(node.numericId);
        if (detail) {
          const ancestors = (node.pathNames || []).slice(0, -1);
          applyNodeToForm({
            ...mapSecondary(detail, ancestors, node.type, node.primaryId),
            id: node.id,
            children: node.children,
            primaryId: node.primaryId,
          });
        }
      }
    } catch {
      /* keep list data if detail fetch fails */
    }
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

  const liveBreadcrumb = useMemo(() => {
    const current = categoryName.trim() || selectedNode?.name || '';
    const ancestors = (selectedNode?.pathNames || []).slice(0, -1);
    return toBreadcrumb(current ? [...ancestors, current] : ancestors);
  }, [selectedNode, categoryName]);

  // ============================================================================
  // UI-ONLY ACTIONS: SAVE, DISCARD, ADD TAG, REMOVE TAG, ADD CATEGORY
  // ============================================================================

  const handleSaveCategory = async () => {
    if (!categoryName.trim()) {
      showToast('Enter a category name before saving.');
      return;
    }
    setIsSaving(true);
    try {
      const payload = writePayload();
      if (!selectedNode) {
        const created = await createPrimaryCategory(payload);
        const node = mapPrimary(created);
        showToast(`Category "${payload.name}" created.`);
        await loadCategories(node.numericId ? node.id : undefined);
        setTreeData((prev) => {
          if (prev.some((item) => item.numericId && item.numericId === node.numericId)) return prev;
          if (prev.length === 0) return [node];
          return prev;
        });
        if (node.name) applyNodeToForm(node);
        return;
      }
      if (selectedNode.type === 'primary') {
        await updatePrimaryCategory(selectedNode.numericId, payload);
      } else {
        await updateSecondaryCategory(selectedNode.numericId, payload);
      }
      await loadCategories(selectedNode.id);
      showToast(`Category "${payload.name}" updated.`);
    } catch (err: any) {
      showToast(err.message || 'Failed to save category');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    if (selectedNode) {
      selectNode(selectedNode);
      showToast('Changes discarded.');
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedNode) return;
    const confirmed = window.confirm(`Delete "${selectedNode.name}"? This cannot be undone.`);
    if (!confirmed) return;
    try {
      if (selectedNode.type === 'primary') {
        await deletePrimaryCategory(selectedNode.numericId);
      } else {
        await deleteSecondaryCategory(selectedNode.numericId);
      }
      showToast(`Category "${selectedNode.name}" deleted.`);
      await loadCategories();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete category');
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

  const handleCreateNewCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    const payload = {
      name: newCategoryName.trim(),
      description: newCategoryDesc.trim(),
      seo: {
        page_title: newCategoryName.trim(),
        meta_desc: newCategoryDesc.trim(),
        url_slug: slugify(newCategoryName),
        keywords: [],
      },
      internalTags: [],
    };
    try {
      if (!modalTargetParent) {
        await createPrimaryCategory(payload);
      } else if (modalTargetParent.type === 'primary') {
        await createSecondaryCategory(modalTargetParent.id, payload);
      } else {
        await createSubCategory(modalTargetParent.id, payload);
      }
      showToast(`Category "${payload.name}" created.`);
      setNewCategoryName('');
      setNewCategoryDesc('');
      setShowAddModal(false);
      setModalTargetParent(null);
      await loadCategories();
    } catch (err: any) {
      showToast(err.message || 'Failed to create category');
    }
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
            {isLoadingTree && <p className="px-2 py-6 text-xs text-gray-400">Loading categories…</p>}
            {!isLoadingTree && filteredTreeData.length === 0 && (
              <p className="px-2 py-6 text-xs text-gray-400">No categories yet. Use + to create a root category.</p>
            )}
            {filteredTreeData.map((primary) => {
              const isExpanded = !!expandedNodes[primary.id];
              return (
                <div key={primary.id} className="space-y-0.5">
                  {/* Primary Category Row */}
                  <div
                    onClick={() => {
                      toggleExpand(primary.id);
                      selectNode(primary);
                    }}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-gray-100 text-xs font-bold text-gray-800 cursor-pointer transition-colors ${
                      selectedNode?.id === primary.id ? 'bg-gray-100' : ''
                    }`}
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
              {liveBreadcrumb || 'CATEGORY'}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleDiscard}
                className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg shadow-xs transition-colors"
              >
                Discard
              </button>
              {selectedNode && (
                <button
                  type="button"
                  onClick={handleDeleteCategory}
                  className="px-4 py-2 bg-white border border-red-200 hover:bg-red-50 text-red-600 text-xs font-semibold rounded-lg shadow-xs transition-colors"
                >
                  Delete
                </button>
              )}
              <button
                type="button"
                onClick={handleSaveCategory}
                disabled={isSaving}
                className="px-4 py-2 bg-black hover:bg-gray-800 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
              >
                {isSaving ? 'Saving…' : selectedNode ? 'Save Category' : 'Create Category'}
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

            <form onSubmit={handleCreateNewCategory} className="space-y-4" autoComplete="off">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  CATEGORY NAME
                </label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g. Walk-in Closets"
                  className="w-full text-xs font-medium text-gray-900 bg-white caret-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-black"
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
                  className="w-full text-xs font-medium text-gray-900 bg-white caret-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-black resize-none"
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
