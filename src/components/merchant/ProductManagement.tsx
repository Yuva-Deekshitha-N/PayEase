import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Package,
  DollarSign,
  Calendar,
  Percent
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { toast } from 'sonner';

interface ProductManagementProps {
  user: any;
}

export function ProductManagement({ user }: ProductManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'iPhone 15 Pro Max',
      category: 'Electronics',
      price: 1199,
      stock: 45,
      bnplEnabled: true,
      installmentOptions: [3, 6, 12],
      interestRates: { 3: 0, 6: 2.9, 12: 4.9 },
      sales: 234,
      revenue: 279780,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1705037282052-f6b776980f8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpcGhvbmUlMjAxNSUyMHBybyUyMHNtYXJ0cGhvbmV8ZW58MXx8fHwxNzU2MDMyNDQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 2,
      name: 'MacBook Pro M3 16"',
      category: 'Electronics',
      price: 2999,
      stock: 23,
      bnplEnabled: true,
      installmentOptions: [3, 6, 12],
      interestRates: { 3: 0, 6: 3.9, 12: 5.9 },
      sales: 156,
      revenue: 467640,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1629491697442-7d67fc25d897?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWNib29rJTIwcHJvJTIwbGFwdG9wJTIwY29tcHV0ZXJ8ZW58MXx8fHwxNzU1OTc1MzQ4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 3,
      name: 'AirPods Pro 2',
      category: 'Audio',
      price: 249,
      stock: 89,
      bnplEnabled: true,
      installmentOptions: [3, 6],
      interestRates: { 3: 0, 6: 2.9 },
      sales: 312,
      revenue: 77688,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1695634463848-4db4e47703a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhaXJwb2RzJTIwd2lyZWxlc3MlMjBoZWFkcGhvbmVzfGVufDF8fHx8MTc1NjAzMjQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 4,
      name: 'Samsung Galaxy Watch',
      category: 'Wearables',
      price: 399,
      stock: 0,
      bnplEnabled: false,
      installmentOptions: [3, 6],
      interestRates: { 3: 0, 6: 2.9 },
      sales: 78,
      revenue: 31122,
      status: 'out_of_stock',
      image: 'https://images.unsplash.com/photo-1722156465633-0be603df7f8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW1zdW5nJTIwZ2FsYXh5JTIwc21hcnR3YXRjaHxlbnwxfHx8fDE3NTYwMzI0NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    }
  ]);

  const categories = ['all', 'Electronics', 'Audio', 'Wearables', 'Gaming'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDeleteProduct = (productId: number) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    toast.success('Product deleted successfully');
  };

  const handleToggleBNPL = (productId: number) => {
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, bnplEnabled: !p.bnplEnabled } : p
    ));
    toast.success('BNPL settings updated');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'out_of_stock': return 'destructive';
      case 'inactive': return 'secondary';
      default: return 'default';
    }
  };

  const ProductForm = ({ product, onSave, onCancel }: any) => {
    const [formData, setFormData] = useState(product || {
      name: '',
      category: '',
      price: '',
      stock: '',
      bnplEnabled: true,
      installmentOptions: [3, 6],
      interestRates: { 3: 0, 6: 2.9 },
      image: ''
    });

    const handleSave = () => {
      if (product) {
        setProducts(prev => prev.map(p => 
          p.id === product.id ? { ...p, ...formData } : p
        ));
        toast.success('Product updated successfully');
      } else {
        const newProduct = {
          ...formData,
          id: Date.now(),
          sales: 0,
          revenue: 0,
          status: 'active'
        };
        setProducts(prev => [...prev, newProduct]);
        toast.success('Product added successfully');
      }
      onSave();
    };

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Enter product name"
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.filter(c => c !== 'all').map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
              placeholder="0.00"
            />
          </div>
          <div>
            <Label htmlFor="stock">Stock Quantity</Label>
            <Input
              id="stock"
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})}
              placeholder="0"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="image">Image URL</Label>
          <Input
            id="image"
            value={formData.image}
            onChange={(e) => setFormData({...formData, image: e.target.value})}
            placeholder="https://..."
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="bnpl">Enable BNPL</Label>
            <p className="text-sm text-muted-foreground">Allow customers to buy with installments</p>
          </div>
          <Switch 
            id="bnpl"
            checked={formData.bnplEnabled} 
            onCheckedChange={(checked) => setFormData({...formData, bnplEnabled: checked})}
          />
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex-1">
            {product ? 'Update' : 'Add'} Product
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Product Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage your products and BNPL settings
          </p>
        </div>
        <Dialog open={isAddingProduct} onOpenChange={setIsAddingProduct}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Add a new product to your store with BNPL options
              </DialogDescription>
            </DialogHeader>
            <ProductForm 
              onSave={() => setIsAddingProduct(false)}
              onCancel={() => setIsAddingProduct(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="card-hover">
            <div className="aspect-video overflow-hidden rounded-t-lg bg-muted/20">
              <ImageWithFallback 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription>{product.category}</CardDescription>
                </div>
                <Badge variant={getStatusColor(product.status)}>
                  {product.status.replace('_', ' ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="font-bold">${product.price}</div>
                  <div className="text-xs text-muted-foreground">Price</div>
                </div>
                <div>
                  <div className="font-bold">{product.stock}</div>
                  <div className="text-xs text-muted-foreground">Stock</div>
                </div>
                <div>
                  <div className="font-bold">{product.sales}</div>
                  <div className="text-xs text-muted-foreground">Sales</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm">BNPL Enabled</Label>
                  <p className="text-xs text-muted-foreground">
                    {product.bnplEnabled ? 'Installments available' : 'Cash only'}
                  </p>
                </div>
                <Switch 
                  checked={product.bnplEnabled} 
                  onCheckedChange={() => handleToggleBNPL(product.id)}
                />
              </div>

              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Product</DialogTitle>
                      <DialogDescription>
                        Update product details and BNPL settings
                      </DialogDescription>
                    </DialogHeader>
                    <ProductForm 
                      product={product}
                      onSave={() => {}}
                      onCancel={() => {}}
                    />
                  </DialogContent>
                </Dialog>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDeleteProduct(product.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No products found</h3>
          <p className="text-muted-foreground">Try adjusting your search or add a new product</p>
        </div>
      )}
    </div>
  );
}