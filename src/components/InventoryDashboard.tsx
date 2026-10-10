import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Package,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Plus,
  Search,
  Download,
  Check,
  Edit2,
  X,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { GarmentProduct } from '../types';

export const InventoryDashboard: React.FC = () => {
  const {
    products,
    updateStock,
    addNewGarment,
    formatPrice,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStockStatus, setFilterStockStatus] = useState<'all' | 'low' | 'out'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Garment Form State
  const [newGarment, setNewGarment] = useState({
    title: '',
    subtitle: '',
    category: 'knitwear' as GarmentProduct['category'],
    season: 'SS26' as GarmentProduct['season'],
    gender: 'unisex' as GarmentProduct['gender'],
    priceUSD: 380,
    costUSD: 95,
    composition: '100% Merino Wool, 18.5 micron gauge',
    description: 'Precision knitwear crafted with fine Italian yarns.',
    fitDetails: 'Tailored relaxed silhouette with standard drape.',
    modelMeasurements: 'Model is 180cm wearing size Medium.',
    careInstructions: ['Hand wash cold', 'Dry flat', 'Do not bleach'],
    image: '/src/assets/images/product_cashmere_knit_1791643421788.jpg',
  });

  const allVariants = useMemo(() => {
    return products.flatMap((p) =>
      p.variants.map((v) => ({
        productId: p.id,
        productTitle: p.title,
        productImage: p.image,
        category: p.category,
        season: p.season,
        costUSD: p.costUSD,
        priceUSD: p.priceUSD,
        ...v,
      }))
    );
  }, [products]);

  const totalUnits = allVariants.reduce((acc, v) => acc + v.stock, 0);
  const lowStockCount = allVariants.filter((v) => v.stock > 0 && v.stock <= 5).length;
  const outOfStockCount = allVariants.filter((v) => v.stock === 0).length;
  const totalValuationUSD = allVariants.reduce((acc, v) => acc + v.stock * v.priceUSD, 0);

  const filteredVariants = useMemo(() => {
    return allVariants.filter((v) => {
      const matchSearch =
        v.productTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.sku.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchSearch) return false;
      if (filterCategory !== 'all' && v.category !== filterCategory) return false;
      if (filterStockStatus === 'low' && (v.stock > 5 || v.stock === 0)) return false;
      if (filterStockStatus === 'out' && v.stock !== 0) return false;
      return true;
    });
  }, [allVariants, searchQuery, filterCategory, filterStockStatus]);

  const handleExportCSV = () => {
    const headers = 'SKU,Product Name,Category,Season,Size,Color,Available Stock,Cost USD,Price USD\n';
    const rows = allVariants
      .map((v) => `"${v.sku}","${v.productTitle}","${v.category}","${v.season}","${v.size}","${v.color}",${v.stock},${v.costUSD},${v.priceUSD}`)
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Munsi_World_Seller_Inventory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateGarment = (e: React.FormEvent) => {
    e.preventDefault();
    addNewGarment({
      ...newGarment,
      variants: [
        { id: `v-${Date.now()}-s`, size: 'S', color: 'Ivory Cream', colorHex: '#f5f5f4', sku: `MW-NEW-${Date.now().toString().slice(-4)}-S`, stock: 15, reservedStock: 0 },
        { id: `v-${Date.now()}-m`, size: 'M', color: 'Ivory Cream', colorHex: '#f5f5f4', sku: `MW-NEW-${Date.now().toString().slice(-4)}-M`, stock: 20, reservedStock: 0 },
        { id: `v-${Date.now()}-l`, size: 'L', color: 'Ivory Cream', colorHex: '#f5f5f4', sku: `MW-NEW-${Date.now().toString().slice(-4)}-L`, stock: 10, reservedStock: 0 },
      ],
    });
    setIsAddModalOpen(false);
  };

  return (
    <div className="bg-white border border-[#d5d9d9] rounded-md shadow-xs overflow-hidden text-xs">
      {/* Amazon Seller Inventory Header */}
      <div className="p-4 border-b border-[#d5d9d9] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#0f1111]">Manage All Inventory</h2>
          <p className="text-xs text-stone-500">
            {allVariants.length} total garment listings &bull; {totalUnits} units available across European &amp; Asian fulfillment centers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 btn-amazon-white text-xs font-medium flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Inventory Report</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-1.5 btn-amazon-primary text-xs font-bold flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add a Product</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 bg-[#f0f2f2] border-b border-[#d5d9d9] flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <input
            type="text"
            placeholder="Search by SKU, Product Name, or ASIN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#d5d9d9] pl-8 pr-3 py-1.5 text-xs text-[#0f1111] rounded focus:outline-none focus:ring-1 focus:ring-[#e77600]"
          />
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-white border border-[#d5d9d9] px-2.5 py-1 text-xs text-[#0f1111] rounded focus:outline-none"
          >
            <option value="all">All Departments</option>
            <option value="outerwear">Outerwear</option>
            <option value="knitwear">Knitwear</option>
            <option value="trousers">Trousers</option>
            <option value="overshirts">Overshirts</option>
            <option value="essentials">Essentials</option>
          </select>

          <select
            value={filterStockStatus}
            onChange={(e) => setFilterStockStatus(e.target.value as any)}
            className="bg-white border border-[#d5d9d9] px-2.5 py-1 text-xs text-[#0f1111] rounded focus:outline-none"
          >
            <option value="all">All Listing Statuses</option>
            <option value="low">Low Inventory (&le; 5 units)</option>
            <option value="out">Out of Stock (0 units)</option>
          </select>
        </div>
      </div>

      {/* Inventory Table (Amazon Seller Central Style) */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#f0f2f2] text-stone-700 border-b border-[#d5d9d9] uppercase text-[11px]">
              <th className="py-2.5 px-4 font-bold">Status</th>
              <th className="py-2.5 px-4 font-bold">Image &amp; Product Name</th>
              <th className="py-2.5 px-4 font-bold">SKU / Size</th>
              <th className="py-2.5 px-4 font-bold text-center">Available Stock</th>
              <th className="py-2.5 px-4 font-bold text-right">Unit Cost</th>
              <th className="py-2.5 px-4 font-bold text-right">Price + Shipping</th>
              <th className="py-2.5 px-4 font-bold text-right">Gross Margin</th>
              <th className="py-2.5 px-4 font-bold text-right">Quick Restock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#d5d9d9]">
            {filteredVariants.map((item) => {
              const margin = (((item.priceUSD - item.costUSD) / item.priceUSD) * 100).toFixed(1);
              const isOut = item.stock === 0;
              const isLow = item.stock > 0 && item.stock <= 5;

              return (
                <tr key={item.id} className="hover:bg-stone-50 transition-colors">
                  {/* Status */}
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-xs font-bold text-[10px] ${
                        isOut
                          ? 'bg-rose-100 text-rose-800'
                          : isLow
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isOut ? 'bg-rose-600' : isLow ? 'bg-amber-600' : 'bg-emerald-600'
                        }`}
                      />
                      {isOut ? 'Inactive' : isLow ? 'Low Stock' : 'Active'}
                    </span>
                  </td>

                  {/* Product Image & Title */}
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img
                      src={item.productImage}
                      alt={item.productTitle}
                      className="w-10 h-12 object-cover border border-[#d5d9d9] shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <p className="font-bold text-[#007185] hover:underline cursor-pointer leading-snug line-clamp-1">
                        {item.productTitle}
                      </p>
                      <span className="text-[11px] text-stone-500 capitalize">
                        {item.category} &bull; {item.season}
                      </span>
                    </div>
                  </td>

                  {/* SKU & Size */}
                  <td className="py-3 px-4 font-mono">
                    <p className="font-semibold text-stone-900">{item.sku}</p>
                    <p className="text-[11px] text-stone-500 font-sans">
                      Size: {item.size} ({item.color})
                    </p>
                  </td>

                  {/* Available Stock with inline buttons */}
                  <td className="py-3 px-4 text-center">
                    <div className="inline-flex items-center border border-[#d5d9d9] rounded bg-white">
                      <button
                        onClick={() => updateStock(item.productId, item.id, item.stock - 1)}
                        className="px-2 py-0.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 font-bold"
                      >
                        -
                      </button>
                      <span
                        className={`px-3 py-0.5 font-bold font-mono ${
                          isOut ? 'text-rose-600' : isLow ? 'text-amber-600' : 'text-[#0f1111]'
                        }`}
                      >
                        {item.stock}
                      </span>
                      <button
                        onClick={() => updateStock(item.productId, item.id, item.stock + 1)}
                        className="px-2 py-0.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 font-bold"
                      >
                        +
                      </button>
                    </div>
                  </td>

                  {/* Cost */}
                  <td className="py-3 px-4 text-right font-mono text-stone-600 tabular-nums">
                    {formatPrice(item.costUSD)}
                  </td>

                  {/* Retail Price */}
                  <td className="py-3 px-4 text-right font-bold text-[#0f1111] font-mono tabular-nums">
                    {formatPrice(item.priceUSD)}
                  </td>

                  {/* Gross Margin */}
                  <td className="py-3 px-4 text-right font-bold text-emerald-800 font-mono tabular-nums">
                    {margin}%
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => updateStock(item.productId, item.id, item.stock + 20)}
                      className="px-2.5 py-1 btn-amazon-white font-medium text-[11px]"
                    >
                      Restock +20
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
          <div className="relative w-full max-w-lg bg-white border border-[#d5d9d9] shadow-2xl rounded-md p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#d5d9d9]">
              <h3 className="text-base font-bold text-[#0f1111]">
                Add a Product to MUNSI WORLD Garments Catalog
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGarment} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ribbed Cashmere Turtleneck"
                  value={newGarment.title}
                  onChange={(e) => setNewGarment({ ...newGarment, title: e.target.value })}
                  className="w-full bg-[#f0f2f2] border border-[#d5d9d9] p-2 rounded"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Fabric Subtitle</label>
                <input
                  type="text"
                  required
                  value={newGarment.subtitle}
                  onChange={(e) => setNewGarment({ ...newGarment, subtitle: e.target.value })}
                  className="w-full bg-[#f0f2f2] border border-[#d5d9d9] p-2 rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Category</label>
                  <select
                    value={newGarment.category}
                    onChange={(e) => setNewGarment({ ...newGarment, category: e.target.value as any })}
                    className="w-full bg-[#f0f2f2] border border-[#d5d9d9] p-2 rounded"
                  >
                    <option value="outerwear">Outerwear</option>
                    <option value="knitwear">Knitwear</option>
                    <option value="trousers">Trousers</option>
                    <option value="overshirts">Overshirts</option>
                    <option value="essentials">Essentials</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Price (USD)</label>
                  <input
                    type="number"
                    required
                    value={newGarment.priceUSD}
                    onChange={(e) => setNewGarment({ ...newGarment, priceUSD: Number(e.target.value) })}
                    className="w-full bg-[#f0f2f2] border border-[#d5d9d9] p-2 rounded font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#d5d9d9] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-1.5 btn-amazon-white font-medium text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 btn-amazon-primary font-bold text-xs"
                >
                  Save and finish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
