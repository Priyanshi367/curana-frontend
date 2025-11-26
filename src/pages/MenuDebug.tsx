// Debug page to view menu data and test role filtering
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useDynamicMenu } from '@/hooks/useDynamicMenu';
import { getUserRole, getStoredUser } from '@/services/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MenuDebug = () => {
  const { menuItems, loading, error } = useDynamicMenu();
  const userRole = getUserRole();
  const user = getStoredUser();
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const toggleExpand = (id: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const renderMenuItem = (item: any, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);

    return (
      <div key={item.id} style={{ marginLeft: `${level * 20}px` }} className="my-2">
        <div className="flex items-center gap-2 p-2 bg-muted rounded">
          {hasChildren && (
            <button
              onClick={() => toggleExpand(item.id)}
              className="text-sm font-bold"
            >
              {isExpanded ? '▼' : '▶'}
            </button>
          )}
          <div className="flex-1">
            <div className="font-semibold">{item.title}</div>
            <div className="text-xs text-muted-foreground">
              URL: {item.url} | Icon: {item.icon} | Order: {item.order ?? 'null'}
            </div>
            <div className="text-xs text-muted-foreground">
              Roles: {item.visible_roles?.map((vr: any) => vr.role).join(', ') || 'all'}
            </div>
          </div>
        </div>
        {hasChildren && isExpanded && (
          <div className="mt-1">
            {item.children.map((child: any) => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Menu Debug Page</h1>

        <div className="grid gap-6">
          {/* User Info */}
          <Card>
            <CardHeader>
              <CardTitle>Current User</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Username:</strong> {user?.username || 'N/A'}</p>
                <p><strong>Role Type:</strong> {userRole}</p>
                <p><strong>Role Name:</strong> {user?.role?.name}</p>
              </div>
            </CardContent>
          </Card>

          {/* Menu Items */}
          <Card>
            <CardHeader>
              <CardTitle>Menu Items (Filtered by Role: {userRole})</CardTitle>
            </CardHeader>
            <CardContent>
              {loading && <p>Loading menu items...</p>}
              {error && <p className="text-red-500">Error: {error}</p>}
              {!loading && !error && (
                <div>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Total items: {menuItems.length}
                  </p>
                  {menuItems.length === 0 ? (
                    <p className="text-muted-foreground">No menu items found for your role.</p>
                  ) : (
                    menuItems.map((item) => renderMenuItem(item))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MenuDebug;
