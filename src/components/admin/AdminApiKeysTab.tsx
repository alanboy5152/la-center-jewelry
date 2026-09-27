import React, { useState } from 'react';
import {
  Key,
  Plus,
  Copy,
  Check,
  Trash2,
  Ban,
  Shield,
  Code2,
  Terminal,
  ExternalLink,
  Layers,
  AlertTriangle,
  Sparkles,
  X,
  Eye,
  EyeOff,
  Play,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ApiKeyCredential } from '../../types';
import { copyTextToClipboard } from '../../utils/clipboard';

export const AdminApiKeysTab: React.FC = () => {
  const { apiKeys, generateApiKey, revokeApiKey, deleteApiKey, showToast, products, orders } = useApp();

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [keyName, setKeyName] = useState('');
  const [environment, setEnvironment] = useState<'production' | 'sandbox'>('production');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([
    'products:read',
    'orders:read',
  ]);

  // Newly generated credential banner
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<ApiKeyCredential | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<'curl' | 'javascript' | 'python'>('curl');

  // Interactive API Tester State
  const [selectedTestKey, setSelectedTestKey] = useState<string>(() => apiKeys[0]?.apiKey || '');
  const [testEndpoint, setTestEndpoint] = useState<string>('/api/v1/products');
  const [isTesting, setIsTesting] = useState(false);
  const [testResponse, setTestResponse] = useState<{
    status: number;
    latency: number;
    data: any;
    timestamp: string;
  } | null>(null);

  const availablePermissions = [
    { id: 'products:read', label: 'Read Products & Catalog', desc: 'Query fine jewelry pieces, metals, and stones' },
    { id: 'products:write', label: 'Manage Inventory', desc: 'Create, edit, or adjust stock quantity' },
    { id: 'orders:read', label: 'Read Customer Orders', desc: 'Retrieve order items, totals, and shipping details' },
    { id: 'orders:write', label: 'Update Order Status', desc: 'Mark orders as confirmed, shipped, or delivered' },
    { id: 'customers:read', label: 'Read Patron Accounts', desc: 'Query registered salon customers' },
    { id: 'webhooks:manage', label: 'Manage Webhooks', desc: 'Listen to real-time purchase and stock triggers' },
  ];

  const handleTogglePermission = (id: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName.trim()) {
      showToast('Please provide a name for this API credential.', 'error');
      return;
    }
    if (selectedPermissions.length === 0) {
      showToast('Select at least one permission scope.', 'error');
      return;
    }

    const created = generateApiKey(keyName.trim(), environment, selectedPermissions);
    setNewlyCreatedKey(created);
    setSelectedTestKey(created.apiKey);
    setIsCreateModalOpen(false);
    setKeyName('');
    setSelectedPermissions(['products:read', 'orders:read']);
  };

  const handleCopy = async (text: string, fieldName: string) => {
    const ok = await copyTextToClipboard(text);
    if (ok) {
      setCopiedField(fieldName);
      showToast(`Copied ${fieldName} to clipboard`, 'info');
      setTimeout(() => {
        setCopiedField(null);
      }, 2500);
    } else {
      showToast(`Could not copy ${fieldName}`, 'error');
    }
  };

  const handleRunApiTest = () => {
    setIsTesting(true);
    const start = performance.now();

    setTimeout(() => {
      const activeKeyObj = apiKeys.find((k) => k.apiKey === selectedTestKey) || apiKeys[0];
      const isRevoked = activeKeyObj?.status === 'revoked';

      let mockData: any = {};
      let status = 200;

      if (isRevoked) {
        status = 401;
        mockData = {
          error: 'Unauthorized',
          message: 'The provided API key has been revoked by the salon administrator.',
          code: 'KEY_REVOKED',
        };
      } else if (testEndpoint === '/api/v1/products') {
        mockData = {
          success: true,
          count: products.length,
          environment: activeKeyObj?.environment || 'production',
          items: products.slice(0, 3).map((p) => ({
            id: p.id,
            name: p.name,
            sku: p.sku,
            price: p.price,
            categoryId: p.categoryId,
            stockQuantity: p.stockQuantity,
          })),
        };
      } else if (testEndpoint === '/api/v1/orders') {
        mockData = {
          success: true,
          count: orders.length,
          environment: activeKeyObj?.environment || 'production',
          orders: orders.slice(0, 2).map((o) => ({
            id: o.id,
            orderNumber: o.orderNumber,
            total: o.total,
            status: o.status,
            customerName: o.customer ? `${o.customer.firstName} ${o.customer.lastName}`.trim() : 'Salon Client',
          })),
        };
      } else {
        mockData = {
          success: true,
          status: 'healthy',
          salon: 'L.A Center Jewelry Inc',
          timestamp: new Date().toISOString(),
        };
      }

      const latency = Math.round(performance.now() - start + 45);
      setTestResponse({
        status,
        latency,
        data: mockData,
        timestamp: new Date().toLocaleTimeString(),
      });
      setIsTesting(false);
      showToast(`API Request to "${testEndpoint}" completed (${status} OK).`, 'success');
    }, 350);
  };

  const activeKeyForSnippet =
    newlyCreatedKey?.apiKey || selectedTestKey || apiKeys[0]?.apiKey || 'lac_live_your_api_key_here';

  return (
    <div className="space-y-3 sm:space-y-6 w-full max-w-5xl min-w-0 overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
        <div>
          <h2 className="font-serif text-lg sm:text-2xl font-normal text-white flex items-center gap-2">
            <span>API Credentials &amp; Integrations</span>
            <span className="text-[9.5px] sm:text-[10px] bg-[#D4AF37]/20 text-[#D4AF37] px-1.5 py-0.5 uppercase tracking-wider font-mono font-bold">
              REST v1
            </span>
          </h2>
          <p className="text-[11px] sm:text-xs text-neutral-400 mt-0.5">
            Generate secure API keys to connect ERP, Point of Sale, custom mobile apps, and inventory pipelines.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="w-full sm:w-auto px-4 py-2 sm:px-4 sm:py-2.5 bg-[#D4AF37] hover:bg-[#b59226] text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors shrink-0 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Generate New Key</span>
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4">
        <div className="p-3 sm:p-4 bg-[#181210] border border-[#2D211B] rounded-xs">
          <span className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">
            Total Credentials
          </span>
          <span className="font-mono text-xl sm:text-2xl font-bold text-white">{apiKeys.length}</span>
        </div>

        <div className="p-3 sm:p-4 bg-[#181210] border border-[#2D211B] rounded-xs">
          <span className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">
            Active Keys
          </span>
          <span className="font-mono text-xl sm:text-2xl font-bold text-emerald-400">
            {apiKeys.filter((k) => k.status === 'active').length}
          </span>
        </div>

        <div className="p-3 sm:p-4 bg-[#181210] border border-[#2D211B] rounded-xs">
          <span className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">
            Production Environment
          </span>
          <span className="font-mono text-xl sm:text-2xl font-bold text-[#D4AF37]">
            {apiKeys.filter((k) => k.environment === 'production' && k.status === 'active').length}
          </span>
        </div>
      </div>

      {/* Newly Created Key Alert Box */}
      {newlyCreatedKey && (
        <div className="p-5 bg-gradient-to-r from-[#201815] to-[#181210] border border-[#D4AF37] rounded-xs space-y-3 relative">
          <button
            type="button"
            onClick={() => setNewlyCreatedKey(null)}
            className="absolute top-4 right-4 text-neutral-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
            <Check className="w-4 h-4" />
            <span>API Credentials Successfully Generated</span>
          </div>

          <p className="text-xs text-neutral-300 leading-relaxed">
            Please copy your <strong>Client Secret</strong> now. For security purposes, this secret key will not be shown again.
          </p>

          <div className="space-y-2 pt-2">
            <div>
              <span className="text-[10px] uppercase text-neutral-400 font-mono block mb-1">
                API Key (Public Identifier)
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={newlyCreatedKey.apiKey}
                  className="w-full bg-[#120E0C] border border-[#3E2D25] text-white p-2 text-xs font-mono select-all"
                />
                <button
                  type="button"
                  onClick={() => handleCopy(newlyCreatedKey.apiKey, 'API Key')}
                  className="px-3 py-2 bg-[#261E1A] hover:bg-[#3E2D25] text-neutral-200 text-xs font-mono flex items-center gap-1 cursor-pointer shrink-0"
                >
                  {copiedField === 'API Key' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === 'API Key' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase text-neutral-400 font-mono block mb-1">
                API Client Secret (Private Key)
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={newlyCreatedKey.apiSecret}
                  className="w-full bg-[#120E0C] border border-[#D4AF37]/50 text-[#D4AF37] p-2 text-xs font-mono select-all"
                />
                <button
                  type="button"
                  onClick={() => handleCopy(newlyCreatedKey.apiSecret, 'Client Secret')}
                  className="px-3 py-2 bg-[#D4AF37] hover:bg-[#b59226] text-black text-xs font-bold font-mono flex items-center gap-1 cursor-pointer shrink-0"
                >
                  {copiedField === 'Client Secret' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === 'Client Secret' ? 'Copied' : 'Copy Secret'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* API Keys Table */}
      <div className="bg-[#181210] border border-[#2D211B] rounded-xs overflow-hidden">
        <div className="p-4 border-b border-[#261E1A] flex items-center justify-between">
          <h3 className="font-serif text-sm text-white font-medium">Configured API Keys</h3>
          <span className="text-[11px] text-neutral-500 font-mono">{apiKeys.length} Key(s) Registered</span>
        </div>

        {apiKeys.length === 0 ? (
          <div className="p-8 text-center text-neutral-500 space-y-2">
            <Key className="w-8 h-8 mx-auto text-neutral-600" />
            <p className="text-xs">No API credentials generated yet.</p>
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Generate First Key
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#130E0C] text-neutral-400 uppercase tracking-wider border-b border-[#2D211B]">
                <tr>
                  <th className="py-3 px-4">Key Name</th>
                  <th className="py-3 px-4">Environment</th>
                  <th className="py-3 px-4">API Key Token</th>
                  <th className="py-3 px-4">Permissions</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#261E1A]">
                {apiKeys.map((key) => {
                  const isRevoked = key.status === 'revoked';
                  return (
                    <tr key={key.id} className="hover:bg-[#1E1714]">
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-white block">{key.name}</span>
                        <span className="text-[10px] text-neutral-500 font-mono">
                          Created {new Date(key.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-xs font-bold ${
                            key.environment === 'production'
                              ? 'bg-amber-950/60 border border-amber-800 text-amber-300'
                              : 'bg-blue-950/60 border border-blue-800 text-blue-300'
                          }`}
                        >
                          {key.environment}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        <div className="flex items-center gap-1.5">
                          <span className="text-neutral-300 bg-[#120E0C] px-2 py-1 border border-[#2D211B] text-[11px]">
                            {key.apiKey.slice(0, 14)}•••••••••
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(key.apiKey, 'API Key')}
                            className="p-1 text-neutral-400 hover:text-white cursor-pointer"
                            title="Copy full API Key"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {key.permissions.map((p) => (
                            <span
                              key={p}
                              className="text-[9px] bg-[#120E0C] border border-[#2D211B] px-1.5 py-0.5 text-neutral-400 font-mono"
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        {isRevoked ? (
                          <span className="text-rose-400 text-[10px] uppercase font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                            Revoked
                          </span>
                        ) : (
                          <span className="text-emerald-400 text-[10px] uppercase font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Active
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!isRevoked ? (
                            <button
                              type="button"
                              onClick={() => revokeApiKey(key.id)}
                              className="px-2.5 py-1 bg-amber-950/60 hover:bg-amber-900 border border-amber-800 text-amber-200 text-[10px] font-semibold uppercase cursor-pointer"
                              title="Revoke Key Token"
                            >
                              Revoke
                            </button>
                          ) : (
                            <span className="text-neutral-500 text-[10px] italic">Revoked</span>
                          )}

                          <button
                            type="button"
                            onClick={() => deleteApiKey(key.id)}
                            className="p-1.5 text-neutral-500 hover:text-rose-400 cursor-pointer"
                            title="Delete Credential"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Interactive REST API Live Tester */}
      <div className="bg-[#181210] border border-[#2D211B] p-4 sm:p-6 space-y-4 text-xs">
        <div className="border-b border-[#261E1A] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-serif text-sm text-white font-medium flex items-center gap-2">
              <Play className="w-4 h-4 text-[#D4AF37]" />
              <span>Interactive REST API Key Tester</span>
            </h3>
            <p className="text-[11px] text-neutral-400">
              Execute live simulated requests using your configured API keys to verify payload response and headers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedTestKey}
              onChange={(e) => setSelectedTestKey(e.target.value)}
              className="bg-[#120E0C] border border-[#3E2D25] text-white px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:border-[#D4AF37] w-full sm:w-auto"
            >
              {apiKeys.map((k) => (
                <option key={k.id} value={k.apiKey}>
                  {k.name} ({k.status})
                </option>
              ))}
            </select>

            <select
              value={testEndpoint}
              onChange={(e) => setTestEndpoint(e.target.value)}
              className="bg-[#120E0C] border border-[#3E2D25] text-white px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:border-[#D4AF37] w-full sm:w-auto"
            >
              <option value="/api/v1/products">GET /api/v1/products</option>
              <option value="/api/v1/orders">GET /api/v1/orders</option>
              <option value="/api/v1/health">GET /api/v1/health</option>
            </select>

            <button
              type="button"
              onClick={handleRunApiTest}
              disabled={isTesting || apiKeys.length === 0}
              className="px-4 py-1.5 bg-[#D4AF37] hover:bg-[#b59226] text-black font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 w-full sm:w-auto"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{isTesting ? 'Sending...' : 'Test Request'}</span>
            </button>
          </div>
        </div>

        {testResponse ? (
          <div className="bg-[#120E0C] border border-[#2D211B] p-4 font-mono text-[11px] space-y-2 rounded-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#201815] pb-2 text-[10px] gap-1">
              <div className="flex items-center gap-2">
                <span
                  className={`font-bold px-1.5 py-0.5 ${
                    testResponse.status === 200
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-rose-950 text-rose-400 border border-rose-800'
                  }`}
                >
                  HTTP {testResponse.status} OK
                </span>
                <span className="text-neutral-400">Endpoint: {testEndpoint}</span>
              </div>
              <div className="text-neutral-500">
                Latency: <span className="text-[#D4AF37]">{testResponse.latency}ms</span> • {testResponse.timestamp}
              </div>
            </div>
            <pre className="text-emerald-300 max-h-48 overflow-y-auto whitespace-pre-wrap">
              {JSON.stringify(testResponse.data, null, 2)}
            </pre>
          </div>
        ) : (
          <div className="py-4 text-center text-neutral-500 font-mono text-[11px]">
            Select an API key and endpoint above, then click "Test Request" to inspect the live response.
          </div>
        )}
      </div>

      {/* Developer Integration Code Snippets */}
      <div className="bg-[#181210] border border-[#2D211B] p-4 sm:p-6 space-y-4 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#261E1A] pb-3 gap-3">
          <div>
            <h3 className="font-serif text-sm text-white font-medium flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#D4AF37]" />
              <span>Integration Quickstart</span>
            </h3>
            <p className="text-[11px] text-neutral-400">
              Sample implementation snippets for developers connecting to L.A Center Jewelry REST APIs.
            </p>
          </div>

          <div className="flex border border-[#3E2D25] text-xs font-mono">
            <button
              type="button"
              onClick={() => setActiveCodeTab('curl')}
              className={`px-3 py-1 cursor-pointer ${
                activeCodeTab === 'curl' ? 'bg-[#D4AF37] text-black font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              cURL
            </button>
            <button
              type="button"
              onClick={() => setActiveCodeTab('javascript')}
              className={`px-3 py-1 cursor-pointer ${
                activeCodeTab === 'javascript' ? 'bg-[#D4AF37] text-black font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Node.js
            </button>
            <button
              type="button"
              onClick={() => setActiveCodeTab('python')}
              className={`px-3 py-1 cursor-pointer ${
                activeCodeTab === 'python' ? 'bg-[#D4AF37] text-black font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Python
            </button>
          </div>
        </div>

        <div className="bg-[#120E0C] p-4 border border-[#261E1A] font-mono text-[11px] overflow-x-auto relative">
          <button
            type="button"
            onClick={() => {
              const code =
                activeCodeTab === 'curl'
                  ? `curl -X GET "https://lacenterjewelry.com/api/v1/products" \\\n  -H "Authorization: Bearer ${activeKeyForSnippet}" \\\n  -H "Content-Type: application/json"`
                  : activeCodeTab === 'javascript'
                  ? `const response = await fetch("https://lacenterjewelry.com/api/v1/products", {\n  headers: {\n    "Authorization": "Bearer ${activeKeyForSnippet}",\n    "Content-Type": "application/json"\n  }\n});\nconst data = await response.json();`
                  : `import requests\n\nheaders = {\n    "Authorization": "Bearer ${activeKeyForSnippet}",\n    "Content-Type": "application/json"\n}\nresponse = requests.get("https://lacenterjewelry.com/api/v1/products", headers=headers)\nprint(response.json())`;
              handleCopy(code, 'Code Snippet');
            }}
            className="absolute top-3 right-3 text-neutral-400 hover:text-white bg-[#1E1714] px-2 py-1 border border-[#33251E] flex items-center gap-1 cursor-pointer"
          >
            <Copy className="w-3 h-3" />
            <span>Copy Snippet</span>
          </button>

          {activeCodeTab === 'curl' && (
            <pre className="text-neutral-300">
              {`curl -X GET "https://lacenterjewelry.com/api/v1/products" \\
  -H "Authorization: Bearer ${activeKeyForSnippet}" \\
  -H "Content-Type: application/json"`}
            </pre>
          )}

          {activeCodeTab === 'javascript' && (
            <pre className="text-neutral-300">
              {`// Node.js / JavaScript Fetch
const response = await fetch("https://lacenterjewelry.com/api/v1/products", {
  headers: {
    "Authorization": "Bearer ${activeKeyForSnippet}",
    "Content-Type": "application/json"
  }
});
const data = await response.json();
console.log(data);`}
            </pre>
          )}

          {activeCodeTab === 'python' && (
            <pre className="text-neutral-300">
              {`# Python requests
import requests

headers = {
    "Authorization": "Bearer ${activeKeyForSnippet}",
    "Content-Type": "application/json"
}

response = requests.get("https://lacenterjewelry.com/api/v1/products", headers=headers)
print(response.json())`}
            </pre>
          )}
        </div>
      </div>

      {/* Create Key Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#181210] border border-[#2D211B] max-w-lg w-full p-6 space-y-5 text-xs shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="font-serif text-lg font-medium text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-[#D4AF37]" />
                <span>Generate New API Key</span>
              </h3>
              <p className="text-[11px] text-neutral-400">
                Create a scoped credential for third-party tools, ERP systems, or private developer integrations.
              </p>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="uppercase font-semibold text-neutral-300 block mb-1.5">
                  Application / Client Name *
                </label>
                <input
                  type="text"
                  required
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  placeholder="e.g. Salon POS Inventory Sync or Mobile App"
                  className="w-full bg-[#120E0C] border border-[#3E2D25] text-white p-2.5 text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="uppercase font-semibold text-neutral-300 block mb-1.5">
                  Deployment Environment
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`p-3 border flex flex-col cursor-pointer ${
                      environment === 'production'
                        ? 'bg-[#201815] border-[#D4AF37] text-white'
                        : 'bg-[#120E0C] border-[#2D211B] text-neutral-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="env"
                      value="production"
                      checked={environment === 'production'}
                      onChange={() => setEnvironment('production')}
                      className="sr-only"
                    />
                    <span className="font-bold uppercase tracking-wider text-xs text-[#D4AF37]">
                      Production (Live)
                    </span>
                    <span className="text-[10px] text-neutral-400 mt-1">
                      Prefix: <code>lac_live_...</code>
                    </span>
                  </label>

                  <label
                    className={`p-3 border flex flex-col cursor-pointer ${
                      environment === 'sandbox'
                        ? 'bg-[#151D2A] border-blue-500 text-white'
                        : 'bg-[#120E0C] border-[#2D211B] text-neutral-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="env"
                      value="sandbox"
                      checked={environment === 'sandbox'}
                      onChange={() => setEnvironment('sandbox')}
                      className="sr-only"
                    />
                    <span className="font-bold uppercase tracking-wider text-xs text-blue-400">
                      Sandbox (Testing)
                    </span>
                    <span className="text-[10px] text-neutral-400 mt-1">
                      Prefix: <code>lac_test_...</code>
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="uppercase font-semibold text-neutral-300 block mb-1.5">
                  Granted Scopes &amp; Permissions *
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {availablePermissions.map((perm) => {
                    const isChecked = selectedPermissions.includes(perm.id);
                    return (
                      <label
                        key={perm.id}
                        className={`flex items-start gap-2.5 p-2.5 border cursor-pointer ${
                          isChecked
                            ? 'bg-[#201815] border-[#3E2D25]'
                            : 'bg-[#120E0C] border-[#261E1A] hover:border-[#332822]'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleTogglePermission(perm.id)}
                          className="mt-0.5 accent-[#D4AF37]"
                        />
                        <div>
                          <span className="font-semibold text-white block">{perm.label}</span>
                          <span className="text-[10px] text-neutral-400">{perm.desc}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-[#261E1A] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-[#3E2D25] text-neutral-300 hover:text-white text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#D4AF37] hover:bg-[#b59226] text-black text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Generate Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
