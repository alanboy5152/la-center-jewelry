import React, { useState } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Video as VideoIcon,
  Trash2,
  Copy,
  Check,
  Search,
  Plus,
  Eye,
  Edit2,
  RefreshCw,
  X,
  AlertCircle,
  Film,
  Calendar,
  HardDrive,
} from 'lucide-react';
import { MediaItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { storageService } from '../../services/storageService';

export const AdminMediaTab: React.FC = () => {
  const { mediaItems, addMediaItem, deleteMediaItem, showToast } = useApp();

  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Modal states
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [renameItem, setRenameItem] = useState<MediaItem | null>(null);
  const [renameValue, setRenameValue] = useState('');

  // External Link Form
  const [customMediaUrl, setCustomMediaUrl] = useState('');
  const [customMediaType, setCustomMediaType] = useState<'image' | 'video'>('video');
  const [customMediaName, setCustomMediaName] = useState('');

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '1.2 MB';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return 'Recent';
    try {
      return new Date(isoString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'Recent';
    }
  };

  const validateAndUploadFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setValidationError(null);

    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'video/mp4',
      'video/webm',
    ];

    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (!allowedMimeTypes.includes(f.type)) {
        setValidationError(`"${f.name}" is not a supported format. Please upload JPG, PNG, WebP, MP4, or WebM.`);
        showToast('Unsupported file type.', 'error');
        return;
      }
      if (f.size > 100 * 1024 * 1024) {
        setValidationError(`"${f.name}" exceeds 100MB maximum file size limit.`);
        showToast('File exceeds 100MB limit.', 'error');
        return;
      }
    }

    setIsUploading(true);
    setUploadProgress(20);

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => (prev < 90 ? prev + 15 : prev));
    }, 150);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const uploaded = await storageService.uploadMedia(file);
        addMediaItem(uploaded);
      }
      clearInterval(progressInterval);
      setUploadProgress(100);
      showToast(`${files.length} file(s) ingested into media vault.`, 'success');
    } catch {
      clearInterval(progressInterval);
      showToast('Error uploading some files.', 'error');
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
    }
  };

  const handleAddExternalMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMediaUrl.trim()) return;

    const newMedia: MediaItem = {
      id: `media-${Date.now()}`,
      name: customMediaName.trim() || 'Showroom Media Asset',
      url: customMediaUrl.trim(),
      type: customMediaType,
      mimeType: customMediaType === 'video' ? 'video/mp4' : 'image/jpeg',
      sizeBytes: customMediaType === 'video' ? 18 * 1024 * 1024 : 2.4 * 1024 * 1024,
      createdAt: new Date().toISOString(),
    };

    addMediaItem(newMedia);
    showToast('Media asset registered successfully.', 'success');
    setCustomMediaUrl('');
    setCustomMediaName('');
  };

  const handleCopyUrl = (url: string, id: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedId(id);
      showToast('Asset URL copied to clipboard.', 'info');
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!renameItem || !renameValue.trim()) return;

    const updated: MediaItem = {
      ...renameItem,
      name: renameValue.trim(),
    };
    addMediaItem(updated); // replaces or appends
    setRenameItem(null);
    showToast('Asset name updated.', 'success');
  };

  const filteredMedia = mediaItems.filter((m) => {
    const matchesFilter = filterType === 'all' || m.type === filterType;
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 text-neutral-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2C221D]">
        <div>
          <h2 className="font-serif text-2xl font-normal text-white">
            Media &amp; Video Library ({mediaItems.length})
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Central repository for jewelry photography, 4K b-roll videos, storefront display scans, and promotional assets.
          </p>
        </div>

        <label className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#b59226] text-black text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-sm">
          <Upload className="w-4 h-4" />
          <span>Upload Media Files</span>
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
            onChange={(e) => validateAndUploadFiles(e.target.files)}
            className="hidden"
          />
        </label>
      </div>

      {validationError && (
        <div className="p-3 bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{validationError}</span>
          </div>
          <button type="button" onClick={() => setValidationError(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          validateAndUploadFiles(e.dataTransfer.files);
        }}
        className="p-8 border-2 border-dashed border-[#3A2D26] hover:border-[#D4AF37] bg-[#16110F] text-center transition-all relative overflow-hidden"
      >
        <Upload className="w-8 h-8 text-[#D4AF37] mx-auto mb-2" />
        <p className="text-sm text-neutral-200 font-medium">
          Drag &amp; drop jewelry photos or videos here, or click to browse
        </p>
        <p className="text-xs text-neutral-400 mt-1">
          Supported: JPG, PNG, WEBP, MP4, WebM (up to 100MB per file)
        </p>

        {/* Upload Progress Bar */}
        {isUploading && (
          <div className="mt-4 max-w-md mx-auto space-y-1">
            <div className="flex justify-between text-[11px] text-[#D4AF37]">
              <span>Ingesting media assets...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#2A201A] overflow-hidden rounded-full">
              <div
                className="h-full bg-[#D4AF37] transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* External URL Linker Form */}
      <form
        onSubmit={handleAddExternalMedia}
        className="p-4 bg-[#1A1412] border border-[#2D211B] flex flex-col md:flex-row gap-3 items-center shadow-lg"
      >
        <span className="text-xs uppercase font-semibold text-[#D4AF37] whitespace-nowrap">
          Register URL Asset:
        </span>
        <select
          value={customMediaType}
          onChange={(e) => setCustomMediaType(e.target.value as 'image' | 'video')}
          className="bg-[#120E0C] border border-[#3E2D25] text-xs text-neutral-300 p-2 focus:border-[#D4AF37] focus:outline-none"
        >
          <option value="video">Video (MP4 / WebM)</option>
          <option value="image">Image (JPG / PNG / WebP)</option>
        </select>
        <input
          type="text"
          placeholder="Asset Name (e.g. Broadway Storefront Dusk Shot)"
          value={customMediaName}
          onChange={(e) => setCustomMediaName(e.target.value)}
          className="bg-[#120E0C] border border-[#3E2D25] text-xs text-white p-2 flex-1 focus:border-[#D4AF37] focus:outline-none"
        />
        <input
          type="url"
          required
          placeholder="https://..."
          value={customMediaUrl}
          onChange={(e) => setCustomMediaUrl(e.target.value)}
          className="bg-[#120E0C] border border-[#3E2D25] text-xs text-white p-2 flex-1 font-mono focus:border-[#D4AF37] focus:outline-none"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-[#261E1A] hover:bg-[#382C26] border border-[#443329] text-[#D4AF37] text-xs font-semibold uppercase tracking-wider whitespace-nowrap cursor-pointer"
        >
          Add Asset
        </button>
      </form>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider ${
              filterType === 'all'
                ? 'bg-[#D4AF37] text-black font-bold'
                : 'bg-[#1A1412] text-neutral-400 hover:text-white border border-[#33261F]'
            }`}
          >
            All ({mediaItems.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('image')}
            className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 ${
              filterType === 'image'
                ? 'bg-[#D4AF37] text-black font-bold'
                : 'bg-[#1A1412] text-neutral-400 hover:text-white border border-[#33261F]'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Images</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterType('video')}
            className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 ${
              filterType === 'video'
                ? 'bg-[#D4AF37] text-black font-bold'
                : 'bg-[#1A1412] text-neutral-400 hover:text-white border border-[#33261F]'
            }`}
          >
            <VideoIcon className="w-3.5 h-3.5" />
            <span>Videos</span>
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search filenames, tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1A1412] border border-[#33261F] text-white text-xs pl-9 pr-3 py-2 focus:outline-none focus:border-[#D4AF37]"
          />
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredMedia.map((item) => (
          <div
            key={item.id}
            className="group bg-[#1A1412] border border-[#2F231D] hover:border-[#D4AF37] overflow-hidden flex flex-col justify-between shadow-lg transition-all"
          >
            {/* Visual Preview */}
            <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
              {item.type === 'video' ? (
                <video
                  src={item.url}
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={item.url}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              )}

              {/* Badges */}
              <div className="absolute top-2 left-2 flex items-center gap-1">
                <span className="bg-black/80 text-[#D4AF37] text-[9px] uppercase font-bold px-2 py-0.5 border border-[#443128]">
                  {item.type}
                </span>
                <span className="bg-black/80 text-white text-[9px] px-1.5 py-0.5 border border-white/10 font-mono">
                  {formatFileSize(item.sizeBytes)}
                </span>
              </div>

              {/* Hover Preview Overlay */}
              <button
                type="button"
                onClick={() => setPreviewItem(item)}
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white hover:text-[#D4AF37]"
                title="Full Preview"
              >
                <Eye className="w-6 h-6" />
              </button>
            </div>

            {/* Info & Metadata */}
            <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-xs text-white font-medium truncate" title={item.name}>
                  {item.name}
                </p>
                <div className="flex items-center justify-between text-[10px] text-[#9E8E7D] mt-1 font-mono">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(item.createdAt)}
                  </span>
                  <span>{item.type === 'video' ? '1080p MP4' : 'High-Res'}</span>
                </div>
              </div>

              {/* Actions Toolbar */}
              <div className="pt-2 border-t border-[#291E18] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleCopyUrl(item.url, item.id)}
                  className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1 font-semibold"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3 h-3" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> Copy URL
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setRenameItem(item);
                      setRenameValue(item.name);
                    }}
                    className="text-neutral-400 hover:text-white p-1"
                    title="Rename Asset"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Permanently remove asset "${item.name}"?`)) {
                        deleteMediaItem(item.id);
                        showToast('Asset deleted from library.', 'info');
                      }
                    }}
                    className="text-neutral-500 hover:text-rose-400 p-1"
                    title="Delete Asset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Full Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-fade-in">
          <div className="relative max-w-4xl w-full bg-[#181210] border border-[#443128] overflow-hidden shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#2C1F19] mb-4">
              <div>
                <h3 className="font-serif text-lg text-[#FFF2B2]">{previewItem.name}</h3>
                <p className="text-xs text-neutral-400 font-mono mt-0.5 truncate max-w-lg">
                  {previewItem.url}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="max-h-[65vh] flex items-center justify-center overflow-hidden bg-black/50">
              {previewItem.type === 'video' ? (
                <video
                  src={previewItem.url}
                  autoPlay
                  controls
                  playsInline
                  className="max-h-[60vh] w-auto object-contain"
                />
              ) : (
                <img
                  src={previewItem.url}
                  alt={previewItem.name}
                  className="max-h-[60vh] w-auto object-contain"
                />
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-[#2C1F19] flex items-center justify-between">
              <span className="text-xs text-[#A89681] font-mono">
                {formatFileSize(previewItem.sizeBytes)} • {formatDate(previewItem.createdAt)}
              </span>
              <button
                type="button"
                onClick={() => handleCopyUrl(previewItem.url, previewItem.id)}
                className="px-4 py-2 bg-[#D4AF37] hover:bg-[#b8952b] text-black text-xs font-bold uppercase tracking-wider flex items-center gap-2"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Asset URL</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rename Dialog */}
      {renameItem && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 animate-fade-in">
          <form
            onSubmit={handleRenameSubmit}
            className="bg-[#1A1412] border border-[#3E2E25] max-w-md w-full p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#2C1F19]">
              <h4 className="font-serif text-lg text-white">Rename Media Asset</h4>
              <button
                type="button"
                onClick={() => setRenameItem(null)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs uppercase font-semibold text-neutral-300 block mb-1">
                Asset Name
              </label>
              <input
                type="text"
                required
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                className="w-full bg-[#120E0C] border border-[#3E2D25] p-2.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRenameItem(null)}
                className="px-4 py-2 text-xs text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#D4AF37] hover:bg-[#b8952b] text-black text-xs font-bold uppercase tracking-wider"
              >
                Save Name
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
