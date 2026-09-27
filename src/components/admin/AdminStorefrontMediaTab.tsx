import React, { useState } from 'react';
import {
  Store,
  Plus,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  Eye,
  Check,
  X,
  Upload,
  Image as ImageIcon,
  Video,
  Tag,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StorefrontMediaItem } from '../../types';

export const AdminStorefrontMediaTab: React.FC = () => {
  const {
    storefrontMedia,
    addStorefrontMedia,
    updateStorefrontMedia,
    deleteStorefrontMedia,
    reorderStorefrontMedia,
    showToast,
  } = useApp();

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<StorefrontMediaItem> | null>(null);
  const [previewMedia, setPreviewMedia] = useState<StorefrontMediaItem | null>(null);

  const tags: NonNullable<StorefrontMediaItem['tag']>[] = [
    'storefront_exterior',
    'storefront_interior',
    'window_display',
    'jewelry_display',
    'promotional',
  ];

  const tagLabels: Record<NonNullable<StorefrontMediaItem['tag']>, string> = {
    storefront_exterior: 'Storefront Exterior',
    storefront_interior: 'Storefront Interior',
    window_display: 'Window Display',
    jewelry_display: 'Jewelry Display',
    promotional: 'Promotional Video',
  };

  const filteredMedia =
    activeCategoryFilter === 'all'
      ? storefrontMedia
      : storefrontMedia.filter((m) => (m.tag || 'storefront_exterior') === activeCategoryFilter);

  const handleOpenAdd = () => {
    setEditingItem({
      id: `sf-${Date.now()}`,
      title: '',
      caption: '',
      type: 'image',
      url: '',
      tag: 'storefront_exterior',
      isHeroCandidate: false,
      order: storefrontMedia.length + 1,
      displayOrder: storefrontMedia.length + 1,
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (item: StorefrontMediaItem) => {
    setEditingItem({ ...item });
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.title || !editingItem?.url) {
      showToast('Please provide a title and media URL.', 'error');
      return;
    }

    const finalized: StorefrontMediaItem = {
      id: editingItem.id || `sf-${Date.now()}`,
      title: editingItem.title,
      caption: editingItem.caption || '',
      type: editingItem.type || 'image',
      url: editingItem.url,
      thumbnailUrl: editingItem.thumbnailUrl || (editingItem.type !== 'video' ? editingItem.url : undefined),
      tag: editingItem.tag || 'storefront_exterior',
      isHeroCandidate: editingItem.isHeroCandidate ?? false,
      order: editingItem.order ?? storefrontMedia.length + 1,
      displayOrder: editingItem.displayOrder ?? storefrontMedia.length + 1,
      createdAt: editingItem.createdAt || new Date().toISOString(),
    };

    const exists = storefrontMedia.some((m) => m.id === finalized.id);
    if (exists) {
      updateStorefrontMedia(finalized);
    } else {
      addStorefrontMedia(finalized);
    }

    setIsEditing(false);
    setEditingItem(null);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= storefrontMedia.length) return;

    const reordered = [...storefrontMedia];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    const updated = reordered.map((item, i) => ({
      ...item,
      order: i + 1,
      displayOrder: i + 1,
    }));
    reorderStorefrontMedia(updated);
    showToast('Storefront media order updated.', 'info');
  };

  return (
    <div className="space-y-6 text-neutral-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#2C221D]">
        <div>
          <h2 className="font-serif text-2xl font-normal text-white">
            Storefront Media &amp; Architecture Gallery
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Manage authentic physical storefront photography, display window videos, interior lighting shots, and showroom assets.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#b8952b] text-black text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Storefront Media</span>
        </button>
      </div>

      {/* Tag Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveCategoryFilter('all')}
          className={`px-3 py-1.5 text-xs uppercase tracking-wider whitespace-nowrap transition-colors ${
            activeCategoryFilter === 'all'
              ? 'bg-[#D4AF37] text-black font-bold'
              : 'bg-[#1E1714] text-[#B8A78F] hover:text-white border border-[#362720]'
          }`}
        >
          All Media ({storefrontMedia.length})
        </button>

        {tags.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setActiveCategoryFilter(t)}
            className={`px-3 py-1.5 text-xs uppercase tracking-wider whitespace-nowrap transition-colors ${
              activeCategoryFilter === t
                ? 'bg-[#D4AF37] text-black font-bold'
                : 'bg-[#1E1714] text-[#B8A78F] hover:text-white border border-[#362720]'
            }`}
          >
            {tagLabels[t]}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMedia.map((item, index) => (
          <div
            key={item.id}
            className="bg-[#1A1412] border border-[#2F231D] hover:border-[#D4AF37]/50 flex flex-col justify-between overflow-hidden shadow-xl transition-all"
          >
            {/* Visual Container */}
            <div className="relative aspect-16/10 bg-black overflow-hidden group">
              {item.type === 'video' ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <img
                    src={item.thumbnailUrl || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600'}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => setPreviewMedia(item)}
                      className="w-10 h-10 rounded-full bg-black/80 hover:bg-[#D4AF37] text-white hover:text-black flex items-center justify-center transition-all cursor-pointer shadow-lg"
                    >
                      <Video className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              )}

              {/* Tag Badge */}
              <div className="absolute top-2 left-2 flex items-center gap-1.5">
                <span className="px-2 py-0.5 bg-black/85 text-[#D4AF37] text-[9px] uppercase font-bold tracking-wider border border-[#3E2D24]">
                  {item.tag ? tagLabels[item.tag] : 'Storefront Asset'}
                </span>
                {item.isHeroCandidate && (
                  <span className="px-2 py-0.5 bg-[#D4AF37] text-black text-[9px] uppercase font-bold">
                    Hero Candidate
                  </span>
                )}
              </div>

              <div className="absolute bottom-2 right-2">
                <button
                  type="button"
                  onClick={() => setPreviewMedia(item)}
                  className="p-1.5 bg-black/80 rounded-full text-white/80 hover:text-white"
                  title="Inspect Full Resolution"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Details */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h4 className="font-serif text-base text-white font-medium">
                  {item.title}
                </h4>
                {item.caption && (
                  <p className="text-xs text-[#9E8E7D] mt-1 leading-relaxed">
                    {item.caption}
                  </p>
                )}
              </div>

              {/* Action Toolbar */}
              <div className="pt-3 border-t border-[#291E18] flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    className="p-1.5 bg-[#251C17] hover:bg-[#34261F] text-[#D4AF37] disabled:opacity-30 border border-[#3E2D24]"
                    title="Move up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === storefrontMedia.length - 1}
                    className="p-1.5 bg-[#251C17] hover:bg-[#34261F] text-[#D4AF37] disabled:opacity-30 border border-[#3E2D24]"
                    title="Move down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 text-[#D4AF37] hover:text-white"
                    title="Edit media"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Delete storefront media "${item.title}"?`)) {
                        deleteStorefrontMedia(item.id);
                      }
                    }}
                    className="p-1.5 text-neutral-500 hover:text-red-400"
                    title="Delete media"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {isEditing && editingItem && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#1A1412] border border-[#3E2E25] max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#2C1F19]">
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="font-serif text-xl text-white">
                  {editingItem.id ? 'Edit Storefront Media' : 'Add Storefront Media'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs uppercase font-semibold text-neutral-300 block mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.title || ''}
                  onChange={(e) =>
                    setEditingItem((prev) => (prev ? { ...prev, title: e.target.value } : null))
                  }
                  placeholder="e.g., Broadway Night Façade &amp; Illuminated Window"
                  className="w-full bg-[#120E0C] border border-[#3E2D25] p-2.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs uppercase font-semibold text-neutral-300 block mb-1">
                  Caption / Architectural Context
                </label>
                <textarea
                  rows={2}
                  value={editingItem.caption || ''}
                  onChange={(e) =>
                    setEditingItem((prev) => (prev ? { ...prev, caption: e.target.value } : null))
                  }
                  placeholder="Historic dark brown fascia with warm gold lettering..."
                  className="w-full bg-[#120E0C] border border-[#3E2D25] p-2.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase font-semibold text-neutral-300 block mb-1">
                    Media Format
                  </label>
                  <select
                    value={editingItem.type || 'image'}
                    onChange={(e) =>
                      setEditingItem((prev) =>
                        prev ? { ...prev, type: e.target.value as StorefrontMediaItem['type'] } : null
                      )
                    }
                    className="w-full bg-[#120E0C] border border-[#3E2D25] p-2.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                  >
                    <option value="image">Still Photography (JPG/PNG/WebP)</option>
                    <option value="video">Cinematic Video (MP4/WebM)</option>
                    <option value="interior">Store Interior</option>
                    <option value="window_display">Window Display</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs uppercase font-semibold text-neutral-300 block mb-1">
                    Architectural Tag
                  </label>
                  <select
                    value={editingItem.tag || 'storefront_exterior'}
                    onChange={(e) =>
                      setEditingItem((prev) =>
                        prev ? { ...prev, tag: e.target.value as StorefrontMediaItem['tag'] } : null
                      )
                    }
                    className="w-full bg-[#120E0C] border border-[#3E2D25] p-2.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                  >
                    {tags.map((t) => (
                      <option key={t} value={t}>
                        {tagLabels[t]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs uppercase font-semibold text-neutral-300 block mb-1">
                  Media Asset URL
                </label>
                <input
                  type="url"
                  required
                  value={editingItem.url || ''}
                  onChange={(e) =>
                    setEditingItem((prev) => (prev ? { ...prev, url: e.target.value } : null))
                  }
                  placeholder="https://..."
                  className="w-full bg-[#120E0C] border border-[#3E2D25] p-2.5 text-xs text-white font-mono focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="heroCandidateSwitch"
                  checked={editingItem.isHeroCandidate ?? false}
                  onChange={(e) =>
                    setEditingItem((prev) =>
                      prev ? { ...prev, isHeroCandidate: e.target.checked } : null
                    )
                  }
                  className="accent-[#D4AF37] w-4 h-4 cursor-pointer"
                />
                <label htmlFor="heroCandidateSwitch" className="text-xs text-white cursor-pointer">
                  Tag as eligible Hero Background Candidate
                </label>
              </div>

              <div className="pt-4 border-t border-[#2C1F19] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 bg-transparent hover:bg-white/5 text-neutral-300 text-xs font-semibold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#b8952b] text-black text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Media</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Lightbox */}
      {previewMedia && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-[#181210] border border-[#443128] overflow-hidden shadow-2xl p-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#2C1F19] mb-4">
              <span className="font-serif text-lg text-[#FFF2B2]">{previewMedia.title}</span>
              <button
                type="button"
                onClick={() => setPreviewMedia(null)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="max-h-[70vh] flex items-center justify-center overflow-hidden">
              {previewMedia.type === 'video' ? (
                <video
                  src={previewMedia.url}
                  autoPlay
                  muted
                  playsInline
                  controls
                  className="max-h-[65vh] w-auto object-contain"
                />
              ) : (
                <img
                  src={previewMedia.url}
                  alt={previewMedia.title}
                  className="max-h-[65vh] w-auto object-contain"
                />
              )}
            </div>

            {previewMedia.caption && (
              <p className="text-xs text-[#B8A895] mt-3 font-light leading-relaxed">
                {previewMedia.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
