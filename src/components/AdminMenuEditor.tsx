import { useState } from 'react';
import { GripVertical, Save, X, ChevronDown, ChevronRight } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MenuItem } from '@/types/menu';
import { getIconComponent } from '@/utils/iconMapping';
import { Button } from '@/components/ui/button';
import { updateMenuOrder } from '@/services/menuService';
import { toast } from 'sonner';

interface SortableMenuItemProps {
  item: MenuItem;
  isChild?: boolean;
  onToggleChildren?: () => void;
  hasChildren?: boolean;
  isExpanded?: boolean;
}

function SortableMenuItem({ 
  item, 
  isChild = false, 
  onToggleChildren,
  hasChildren = false,
  isExpanded = false 
}: SortableMenuItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const IconComponent = getIconComponent(item.icon);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 bg-white border-2 rounded-lg transition-all ${
        isChild ? 'ml-8 border-gray-200' : 'border-gray-300'
      } ${isDragging ? 'opacity-0' : 'opacity-100'}`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing touch-none hover:bg-gray-100 p-1 rounded"
      >
        <GripVertical className="h-5 w-5 text-gray-500" />
      </div>
      
      {hasChildren && (
        <button
          onClick={onToggleChildren}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-gray-600" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-600" />
          )}
        </button>
      )}
      
      <IconComponent className="h-5 w-5 text-gray-600 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{item.title}</p>
        <p className="text-xs text-gray-500 truncate">{item.url}</p>
      </div>
      <span className="text-xs text-gray-400 flex-shrink-0">
        Order: {item.order || 'N/A'}
      </span>
    </div>
  );
}

function DragOverlayItem({ item }: { item: MenuItem }) {
  const IconComponent = getIconComponent(item.icon);
  
  return (
    <div className="flex items-center gap-3 p-3 bg-white border-2 border-primary rounded-lg shadow-2xl">
      <GripVertical className="h-5 w-5 text-gray-500" />
      <IconComponent className="h-5 w-5 text-gray-600" />
      <div className="flex-1">
        <p className="text-sm font-medium">{item.title}</p>
        <p className="text-xs text-gray-500">{item.url}</p>
      </div>
    </div>
  );
}

interface AdminMenuEditorProps {
  menuItems: MenuItem[];
  onClose: () => void;
  onSave: () => void;
}

export function AdminMenuEditor({ menuItems, onClose, onSave }: AdminMenuEditorProps) {
  // Flatten the menu tree to include all items (parents and children)
  const flattenedItems = useState<MenuItem[]>(() => {
    const flattened: MenuItem[] = [];
    const flatten = (items: MenuItem[]) => {
      items.forEach((item) => {
        flattened.push(item);
        if (item.children && item.children.length > 0) {
          flatten(item.children);
        }
      });
    };
    flatten(menuItems);
    return flattened;
  })[0];

  const [items, setItems] = useState<MenuItem[]>(flattenedItems);
  const [saving, setSaving] = useState(false);
  const [activeId, setActiveId] = useState<number | null>(null);
  
  // Initialize with all parent items expanded to show submenus
  const [expandedItems, setExpandedItems] = useState<Set<number>>(() => {
    const initialExpanded = new Set<number>();
    items.forEach((item) => {
      if (!item.parent) {
        // Check if this item has children
        const hasChildren = items.some((child) => {
          return child.parent && (child.parent.id === item.id || child.parent.documentId === item.documentId);
        });
        if (hasChildren) {
          initialExpanded.add(item.id);
        }
      }
    });
    return initialExpanded;
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as number);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // Update order values based on position
        return newItems.map((item, index) => ({
          ...item,
          order: index + 1,
        }));
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const toastId = toast.loading('Saving menu order...');
    
    try {
      // Prepare updates for API
      const updates = items.map((item, index) => ({
        id: item.id,
        documentId: item.documentId,
        order: index + 1,
      }));

      await updateMenuOrder(updates);
      toast.success('Menu order updated successfully!', { id: toastId });
      onClose();
      // Call onSave to refresh menu from API
      onSave();
    } catch (error) {
      console.error('Error saving menu order:', error);
      toast.error('Failed to update menu order', { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const toggleExpanded = (itemId: number) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  // Get all items in display order (parents with their children)
  const displayItems: MenuItem[] = [];
  const parentItems = items.filter((item) => !item.parent);
  
  parentItems.forEach((item) => {
    displayItems.push(item);
    // Add children if parent is expanded
    if (expandedItems.has(item.id)) {
      const children = items.filter((child) => {
        return child.parent && (child.parent.id === item.id || child.parent.documentId === item.documentId);
      });
      displayItems.push(...children);
    }
  });

  const activeItem = items.find((item) => item.id === activeId);

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-lg font-semibold">Edit Menu Order</h2>
            <p className="text-xs text-gray-500 mt-1">
              {items.length} items total
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            disabled={saving}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-blue-800">
              <strong>💡 Tip:</strong> Drag items by the grip handle to reorder. 
              Click arrows to expand/collapse parent items. All items can be reordered regardless of parent-child relationships.
            </p>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={items.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {displayItems.map((item) => {
                  console.log(item,'itemitemitem')
                  const hasChildren = items.some((child) => {
                    return child.parent && (child.parent.id === item.id || child.parent.documentId === item.documentId);
                  });

                  const isChild = !!item.parent;
                  const isExpanded = expandedItems.has(item.id);
                  
                  return (
                    <SortableMenuItem
                      key={item.id}
                      item={item}
                      isChild={isChild}
                      hasChildren={hasChildren}
                      isExpanded={isExpanded}
                      onToggleChildren={() => toggleExpanded(item.id)}
                    />
                  );
                })}
              </div>
            </SortableContext>
            
            <DragOverlay>
              {activeItem ? <DragOverlayItem item={activeItem} /> : null}
            </DragOverlay>
          </DndContext>
        </div>

        <div className="flex items-center justify-between p-4 border-t bg-gray-50">
          <p className="text-xs text-gray-600">
            Changes will be saved to the database
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
