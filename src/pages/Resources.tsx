import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Package, 
  Plus, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  TrendingDown,
  Edit,
  Trash2,
  Search
} from 'lucide-react';
import { dummyResources, Resource } from '@/data/dummyData';
import { toast } from '@/hooks/use-toast';

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>(dummyResources);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [newResource, setNewResource] = useState({
    name: '',
    category: '',
    quantity: 0,
    minStock: 0,
    expiryDate: '',
    supplier: '',
    cost: 0
  });

  const filteredResources = resources.filter(resource =>
    resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getResourceStatus = (resource: Resource): Resource['status'] => {
    const now = new Date();
    const expiry = new Date(resource.expiryDate);
    
    if (expiry < now) return 'expired';
    if (resource.quantity === 0) return 'out-of-stock';
    if (resource.quantity <= resource.minStock) return 'low-stock';
    return 'in-stock';
  };

  const getStatusConfig = (status: Resource['status']) => {
    const configs = {
      'in-stock': { variant: 'secondary' as const, icon: CheckCircle, color: 'text-success' },
      'low-stock': { variant: 'default' as const, icon: AlertTriangle, color: 'text-warning' },
      'out-of-stock': { variant: 'destructive' as const, icon: XCircle, color: 'text-destructive' },
      'expired': { variant: 'destructive' as const, icon: TrendingDown, color: 'text-destructive' }
    };
    return configs[status];
  };

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    
    const resource: Resource = {
      id: `r${resources.length + 1}`,
      ...newResource,
      status: getResourceStatus({
        ...newResource,
        id: '',
        status: 'in-stock'
      } as Resource)
    };

    setResources([...resources, resource]);
    resetForm();
    
    toast({
      title: "Resource Added Successfully",
      description: `${resource.name} has been added to inventory.`,
    });
  };

  const handleEditResource = (resource: Resource) => {
    setEditingResource(resource);
    setNewResource({
      name: resource.name,
      category: resource.category,
      quantity: resource.quantity,
      minStock: resource.minStock,
      expiryDate: resource.expiryDate,
      supplier: resource.supplier,
      cost: resource.cost
    });
    setShowAddForm(true);
  };

  const handleUpdateResource = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingResource) {
      const updatedResource = {
        ...editingResource,
        ...newResource,
        status: getResourceStatus({
          ...editingResource,
          ...newResource
        } as Resource)
      };
      
      const updatedResources = resources.map(r => 
        r.id === editingResource.id ? updatedResource : r
      );
      setResources(updatedResources);
      resetForm();
      
      toast({
        title: "Resource Updated Successfully",
        description: `${newResource.name} has been updated.`,
      });
    }
  };

  const handleDeleteResource = (resourceId: string) => {
    const resource = resources.find(r => r.id === resourceId);
    setResources(resources.filter(r => r.id !== resourceId));
    
    toast({
      title: "Resource Deleted",
      description: `${resource?.name} has been removed from inventory.`,
      variant: "destructive",
    });
  };

  const resetForm = () => {
    setNewResource({
      name: '',
      category: '',
      quantity: 0,
      minStock: 0,
      expiryDate: '',
      supplier: '',
      cost: 0
    });
    setShowAddForm(false);
    setEditingResource(null);
  };

  // Calculate statistics
  const totalResources = resources.length;
  const lowStockCount = resources.filter(r => getResourceStatus(r) === 'low-stock').length;
  const expiredCount = resources.filter(r => getResourceStatus(r) === 'expired').length;
  const outOfStockCount = resources.filter(r => getResourceStatus(r) === 'out-of-stock').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Resource Management</h1>
          <p className="text-muted-foreground mt-1">
            Track medical supplies and equipment inventory
          </p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          {totalResources} Items
        </Badge>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="medical-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Resources</p>
              <p className="text-2xl font-bold text-foreground">{totalResources}</p>
            </div>
            <Package className="w-8 h-8 text-primary" />
          </div>
        </Card>
        
        <Card className="medical-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Low Stock</p>
              <p className="text-2xl font-bold text-warning">{lowStockCount}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-warning" />
          </div>
        </Card>
        
        <Card className="medical-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Expired</p>
              <p className="text-2xl font-bold text-destructive">{expiredCount}</p>
            </div>
            <TrendingDown className="w-8 h-8 text-destructive" />
          </div>
        </Card>
        
        <Card className="medical-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Out of Stock</p>
              <p className="text-2xl font-bold text-destructive">{outOfStockCount}</p>
            </div>
            <XCircle className="w-8 h-8 text-destructive" />
          </div>
        </Card>
      </div>

      {/* Search and Add */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search resources by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button 
          onClick={() => setShowAddForm(true)}
          className="medical-gradient medical-shadow"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Resource
        </Button>
      </div>

      {/* Add/Edit Resource Form */}
      {showAddForm && (
        <Card className="medical-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              {editingResource ? 'Edit Resource' : 'Add New Resource'}
            </h3>
            <Button variant="ghost" onClick={resetForm}>×</Button>
          </div>
          
          <form onSubmit={editingResource ? handleUpdateResource : handleAddResource} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Resource Name</Label>
                <Input
                  id="name"
                  value={newResource.name}
                  onChange={(e) => setNewResource(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Surgical Masks"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={newResource.category} onValueChange={(value) => setNewResource(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PPE">PPE</SelectItem>
                    <SelectItem value="Medical Equipment">Medical Equipment</SelectItem>
                    <SelectItem value="Medication">Medication</SelectItem>
                    <SelectItem value="First Aid">First Aid</SelectItem>
                    <SelectItem value="Surgical Supplies">Surgical Supplies</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="quantity">Current Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={newResource.quantity}
                  onChange={(e) => setNewResource(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                  min="0"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="minStock">Minimum Stock Level</Label>
                <Input
                  id="minStock"
                  type="number"
                  value={newResource.minStock}
                  onChange={(e) => setNewResource(prev => ({ ...prev, minStock: Number(e.target.value) }))}
                  min="0"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={newResource.expiryDate}
                  onChange={(e) => setNewResource(prev => ({ ...prev, expiryDate: e.target.value }))}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="cost">Unit Cost ($)</Label>
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  value={newResource.cost}
                  onChange={(e) => setNewResource(prev => ({ ...prev, cost: Number(e.target.value) }))}
                  min="0"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="supplier">Supplier</Label>
              <Input
                id="supplier"
                value={newResource.supplier}
                onChange={(e) => setNewResource(prev => ({ ...prev, supplier: e.target.value }))}
                placeholder="MedSupply Co."
                required
              />
            </div>
            
            <div className="flex space-x-2">
              <Button type="submit" className="flex-1 medical-gradient">
                {editingResource ? 'Update Resource' : 'Add Resource'}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Low Stock Alerts */}
      {lowStockCount > 0 && (
        <Card className="medical-card border-warning/20 bg-warning/5">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-warning" />
            <div>
              <h3 className="text-lg font-semibold text-foreground">Low Stock Alert</h3>
              <p className="text-sm text-muted-foreground">
                {lowStockCount} items need immediate restocking
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {resources
              .filter(r => getResourceStatus(r) === 'low-stock')
              .map(resource => (
                <div key={resource.id} className="flex items-center justify-between p-3 bg-background rounded-lg border">
                  <div>
                    <p className="font-medium text-sm">{resource.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {resource.quantity} remaining (min: {resource.minStock})
                    </p>
                  </div>
                  <Badge variant="default" className="bg-warning text-warning-foreground">
                    Low Stock
                  </Badge>
                </div>
              ))}
          </div>
        </Card>
      )}

      {/* Resource List */}
      <Card className="medical-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Inventory</h3>
          <Badge variant="secondary">{filteredResources.length} Found</Badge>
        </div>
        
        <div className="space-y-3">
          {filteredResources.map((resource) => {
            const status = getResourceStatus(resource);
            const statusConfig = getStatusConfig(status);
            const StatusIcon = statusConfig.icon;
            
            return (
              <div key={resource.id} className="p-4 border border-border rounded-lg hover:bg-muted/50 smooth-transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-primary" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-foreground">{resource.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {resource.category}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Quantity:</span> {resource.quantity}
                        </div>
                        <div>
                          <span className="font-medium">Min Stock:</span> {resource.minStock}
                        </div>
                        <div>
                          <span className="font-medium">Expires:</span> {resource.expiryDate}
                        </div>
                        <div>
                          <span className="font-medium">Cost:</span> ${resource.cost}
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mt-1">
                        <span className="font-medium">Supplier:</span> {resource.supplier}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant={statusConfig.variant} className="flex items-center space-x-1">
                      <StatusIcon className="w-3 h-3" />
                      <span className="capitalize">{status.replace('-', ' ')}</span>
                    </Badge>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditResource(resource)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteResource(resource.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
          
          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No resources found matching your search.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}