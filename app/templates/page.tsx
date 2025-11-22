/**
 * Contract Templates Page
 * 
 * SaaS-style browse and deploy contract templates with one click
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, Button, LoadingSpinner, Alert } from '@/components/example-components';
import { loadTemplates, ContractTemplate } from '@/lib/templates';
import { deployContract } from '@/lib/api';
import { saveContract } from '@/lib/storage';
import { useWallet } from '@/lib/useWallet';
import Navbar from '@/components/Navbar';
import { 
  FaRocket, 
  FaInfoCircle, 
  FaTag, 
  FaSearch, 
  FaFilter,
  FaCheck,
  FaClock,
  FaCode,
  FaArrowRight
} from 'react-icons/fa';

export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<ContractTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<ContractTemplate | null>(null);
  const [deploying, setDeploying] = useState(false);
  const [deployNetwork, setDeployNetwork] = useState<'testnet' | 'mainnet'>('testnet');
  const [deployerSecret, setDeployerSecret] = useState('');
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showDeployPanel, setShowDeployPanel] = useState(false);

  const { publicKey, isConnected, connect } = useWallet();

  useEffect(() => {
    loadTemplatesData();
  }, []);

  const loadTemplatesData = async () => {
    try {
      setLoading(true);
      const loadedTemplates = await loadTemplates();
      setTemplates(loadedTemplates);
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Failed to load templates',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTemplate = (template: ContractTemplate) => {
    setSelectedTemplate(template);
    setShowDeployPanel(true);
    setAlert(null);
    // Scroll to deploy panel
    setTimeout(() => {
      const panel = document.getElementById('deploy-panel');
      panel?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  };

  const handleConnectWallet = async () => {
    try {
      await connect();
      setAlert({
        type: 'info',
        message: 'Wallet connected! Please enter your secret key for deployment.',
      });
    } catch (error: any) {
      setAlert({
        type: 'error',
        message: `Failed to connect wallet: ${error.message}`,
      });
    }
  };

  const handleDeploy = async () => {
    if (!selectedTemplate) return;

    if (!deployerSecret) {
      setAlert({
        type: 'error',
        message: 'Please enter your deployer secret key',
      });
      return;
    }

    setDeploying(true);
    setAlert(null);

    try {
      const response = await deployContract({
        contractPath: selectedTemplate.contractPath,
        contractName: selectedTemplate.contractName,
        network: deployNetwork,
        deployerSecret,
      });

      if (response.success && response.contractId) {
        saveContract({
          contractId: response.contractId,
          contractName: selectedTemplate.contractName,
          network: deployNetwork,
        });

        setAlert({
          type: 'success',
          message: `Contract deployed successfully! Redirecting to analytics...`,
        });

        setTimeout(() => {
          router.push(`/contract-analytics/${response.contractId}`);
        }, 2000);
      } else {
        // Extract more helpful error message
        let errorMessage = response.error || 'Deployment failed';
        
        // Check for common errors and provide helpful messages
        if (errorMessage.includes('Contract directory not found')) {
          errorMessage = `Contract "${selectedTemplate.name}" is not available. Only the "Counter Contract" is currently available for deployment.`;
        } else if (errorMessage.includes('not found') || errorMessage.includes('ENOENT')) {
          errorMessage = `Contract files not found. Please ensure the contract exists at ${selectedTemplate.contractPath}`;
        }
        
        setAlert({
          type: 'error',
          message: errorMessage,
        });
      }
    } catch (error: any) {
      setAlert({
        type: 'error',
        message: `Deployment error: ${error.message}`,
      });
    } finally {
      setDeploying(false);
    }
  };

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      searchQuery === '' ||
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' || template.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(templates.map((t) => t.category).filter(Boolean))];

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'intermediate':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'advanced':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Shared Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Alert */}
        {alert && (
          <div className="mb-6">
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          </div>
        )}

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Browse Contract Templates</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-4">
            Deploy pre-built smart contracts with one click. Choose from our collection of tested and ready-to-use templates.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates by name, description, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg pl-11 pr-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg pl-11 pr-8 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Showing {filteredTemplates.length} of {templates.length} templates
          </div>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <div className="bg-white rounded-xl p-12 border border-gray-200 shadow-sm text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Templates Found</h3>
            <p className="text-gray-600">No templates match your search criteria. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className={`bg-white rounded-xl p-6 border-2 transition-all cursor-pointer hover:shadow-lg ${
                  selectedTemplate?.id === template.id
                    ? 'border-blue-500 shadow-lg'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => handleSelectTemplate(template)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-5xl">{template.icon || '📄'}</div>
                  {template.difficulty && (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(template.difficulty)}`}>
                      {template.difficulty}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{template.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{template.description}</p>

                {template.features && template.features.length > 0 && (
                  <div className="mb-4">
                    <div className="text-gray-500 text-xs font-semibold mb-2 uppercase tracking-wide">Features</div>
                    <div className="flex flex-wrap gap-2">
                      {template.features.slice(0, 3).map((feature, i) => (
                        <span
                          key={i}
                          className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-xs font-medium border border-blue-200"
                        >
                          {feature}
                        </span>
                      ))}
                      {template.features.length > 3 && (
                        <span className="text-gray-400 text-xs">+{template.features.length - 3} more</span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  {template.estimatedDeployTime && (
                    <div className="flex items-center gap-2 text-gray-500 text-xs">
                      <FaClock />
                      <span>{template.estimatedDeployTime}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-blue-600 text-sm font-semibold">
                    <span>Deploy</span>
                    <FaArrowRight className="text-xs" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Deployment Panel */}
        {selectedTemplate && showDeployPanel && (
          <div id="deploy-panel" className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <FaRocket className="text-blue-600 text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Deploy: {selectedTemplate.name}</h2>
                <p className="text-gray-600 text-sm">{selectedTemplate.description}</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Template Info */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="text-5xl">{selectedTemplate.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h4 className="text-gray-900 font-semibold">{selectedTemplate.name}</h4>
                      {selectedTemplate.version && (
                        <span className="text-gray-500 text-xs">v{selectedTemplate.version}</span>
                      )}
                    </div>
                    
                    {selectedTemplate.functions && selectedTemplate.functions.length > 0 && (
                      <div className="mb-3">
                        <div className="text-gray-600 text-xs font-semibold mb-2 uppercase tracking-wide">Functions</div>
                        <div className="flex flex-wrap gap-2">
                          {selectedTemplate.functions.map((fn, i) => (
                            <code
                              key={i}
                              className="bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-md text-xs font-mono"
                            >
                              {fn.name}()
                            </code>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedTemplate.features && (
                      <div>
                        <div className="text-gray-600 text-xs font-semibold mb-2 uppercase tracking-wide">Key Features</div>
                        <ul className="space-y-1">
                          {selectedTemplate.features.map((feature, i) => (
                            <li key={i} className="flex items-center gap-2 text-gray-700 text-sm">
                              <FaCheck className="text-green-500 text-xs" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Network Selection */}
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-3">Network</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setDeployNetwork('testnet')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      deployNetwork === 'testnet'
                        ? 'border-blue-500 bg-blue-50 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="text-gray-900 font-semibold mb-1">Testnet</div>
                    <div className="text-gray-600 text-sm">For testing and development</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeployNetwork('mainnet')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      deployNetwork === 'mainnet'
                        ? 'border-red-500 bg-red-50 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="text-gray-900 font-semibold mb-1">Mainnet</div>
                    <div className="text-gray-600 text-sm">Production environment</div>
                  </button>
                </div>
              </div>

              {/* Deployer Secret */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-gray-700 text-sm font-semibold">Deployer Secret Key</label>
                  {!isConnected && (
                    <button
                      type="button"
                      onClick={handleConnectWallet}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                    >
                      <span>Connect Wallet</span>
                    </button>
                  )}
                  {isConnected && (
                    <div className="text-green-600 text-sm font-medium flex items-center gap-1">
                      <FaCheck />
                      <span>Wallet Connected</span>
                    </div>
                  )}
                </div>
                <input
                  type="password"
                  placeholder="S..."
                  value={deployerSecret}
                  onChange={(e) => setDeployerSecret(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-gray-500 text-xs mt-2 flex items-center gap-1">
                  <FaInfoCircle className="text-gray-400" />
                  Your secret key is used only for deployment and is not stored
                </p>
              </div>

              {/* Deploy Button */}
              <button
                onClick={handleDeploy}
                disabled={deploying || !deployerSecret}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
              >
                {deploying ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Deploying...</span>
                  </>
                ) : (
                  <>
                    <FaRocket />
                    <span>Deploy Contract</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Professional Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">A</span>
                </div>
                <span className="text-gray-900 font-semibold">AstroDeploy</span>
              </div>
              <p className="text-gray-500 text-sm">Smart Contract Platform on Stellar Testnet</p>
            </div>
            <div className="flex items-center gap-8 text-gray-600 text-sm">
              <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
              <Link href="/deploy" className="hover:text-gray-900 transition-colors">Deploy</Link>
              <Link href="/my-contracts" className="hover:text-gray-900 transition-colors">My Contracts</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-500 text-sm">
              © 2024 AstroDeploy. Built on Stellar Testnet.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
