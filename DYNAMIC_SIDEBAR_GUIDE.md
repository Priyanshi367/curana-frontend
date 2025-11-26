# Dynamic Sidebar Implementation

## Overview
The sidebar now supports both static (hardcoded) and dynamic (API-driven) menu items. You can toggle between them using the Globe icon button at the bottom of the sidebar.

## Features
- **Static Menu**: Original hardcoded navigation items
- **Dynamic Menu**: Fetches menu items from Strapi API at `http://localhost:1337/api/menu-items?populate=*`
- **Hierarchical Structure**: Supports parent-child relationships
- **Automatic Sorting**: Menu items are sorted by the `order` field
- **Visibility Control**: Only shows items where `visible: true`

## How to Use

### Toggle Between Static and Dynamic
1. Look for the Globe icon button at the bottom of the sidebar (above the "Horizontal Layout" button)
2. Click it to switch between:
   - **Static Menu** (default): Uses the hardcoded `navItems` array
   - **Dynamic Menu**: Fetches from Strapi API

### API Response Structure
The dynamic menu expects this structure from Strapi:

```json
{
  "data": [
    {
      "id": 2,
      "title": "Home",
      "url": "/",
      "visible": true,
      "order": 1,
      "parent": null
    },
    {
      "id": 6,
      "title": "Mission & Vision",
      "url": "/about/mission-vision",
      "visible": true,
      "order": 1,
      "parent": {
        "id": 12,
        "title": "About Us",
        "url": "/about"
      }
    }
  ]
}
```

## Files Added/Modified

### New Files
- `src/services/menuService.ts` - API service to fetch menu items
- `src/hooks/useMenuItems.ts` - React hook to manage dynamic menu state

### Modified Files
- `src/components/Sidebar.tsx` - Added dynamic menu toggle and rendering logic

## Configuration
The API URL and token are configured in `.env`:
```
VITE_STRAPI_API_URL=http://localhost:1337/api
```

## Notes
- The dynamic menu uses the `Home` icon for all items by default
- Loading and error states are displayed when fetching dynamic menu
- All existing static menu functionality remains intact
- The toggle state is not persisted (resets on page refresh)
