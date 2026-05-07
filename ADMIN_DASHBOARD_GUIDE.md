# PHM Admin Dashboard - Frontend Guide

## 🎨 Overview

The Admin Dashboard is a world-class, Apple-style minimalist interface for managing patient and provider leads. Built with Next.js 14, Shadcn UI, and modern React patterns.

## 🚀 Quick Start

### 1. Ensure Backend is Running
```bash
# Start PostgreSQL (if not already running)
docker start phm-postgres

# Start Next.js dev server
cd apps/web
npm run dev
```

### 2. Access the Dashboard
```
http://localhost:3000/admin/leads
```

## 📁 File Structure

```
apps/web/src/
├── app/
│   ├── admin/
│   │   └── leads/
│   │       └── page.tsx                 # Main admin dashboard
│   └── layout.tsx                       # Updated with Toaster
├── components/
│   └── ui/
│       ├── sonner.tsx                   # Toast notification component
│       ├── table.tsx                    # Shadcn Table components
│       ├── select.tsx                   # Shadcn Select components
│       └── badge.tsx                    # Shadcn Badge components
└── lib/
    └── db.ts                            # Database utility
```

## 🎯 Features

### ✅ Implemented Features

1. **Client-Side Data Fetching**
   - Fetches leads from `/api/admin/leads` on mount
   - Automatic error handling and retry logic
   - Loading states with skeleton UI

2. **Premium UI Design**
   - Soft off-white background (`#F8FAFC`)
   - Pure white card with rounded corners (`rounded-2xl`)
   - Subtle shadows and borders
   - Navy (`#1B3A5C`) for headers
   - Teal (`#0D7377`) for active elements

3. **Responsive Data Table**
   - Built with Shadcn UI Table components
   - Displays: Date, Patient Name, Type, Program Interest, Contact Info, Status
   - Hover effects and smooth transitions
   - Mobile-responsive design

4. **Interactive Status Updates**
   - Status column uses Shadcn Select dropdown
   - Color-coded status badges:
     - **New**: Gray/Slate
     - **Contacted**: Yellow/Amber
     - **Enrolled**: Teal (`#0D7377`)
     - **Closed**: Navy (`#1B3A5C`)
   - Real-time PATCH requests to update database
   - Loading spinner during updates
   - Toast notifications for success/error

5. **Empty State Design**
   - Beautiful empty state with icon
   - Clear messaging when no leads exist
   - Encourages action

6. **Loading States**
   - Pulsing skeleton loaders
   - Smooth transitions
   - Professional appearance

7. **Error Handling**
   - Graceful error states
   - Retry functionality
   - User-friendly error messages

8. **Footer Statistics**
   - Real-time lead counts by status
   - Quick overview of pipeline

## 🎨 Design System

### Color Palette

```typescript
// Brand Colors
Navy: #1B3A5C      // Headers, primary text
Teal: #0D7377      // Active elements, enrolled status

// Background Colors
Page: #F8FAFC      // Soft off-white
Card: #FFFFFF      // Pure white

// Status Colors
New: Slate (100/700)
Contacted: Amber (100/700)
Enrolled: Teal (#0D7377)
Closed: Navy (#1B3A5C)

// Type Badge Colors
Referral: Blue (50/700)
Consultation: Purple (50/700)
Contact: Green (50/700)
```

### Typography

```typescript
// Headers
h1: text-3xl font-bold text-[#1B3A5C]

// Body Text
Primary: text-slate-700
Secondary: text-slate-600
Muted: text-slate-500

// Table Headers
font-semibold text-[#1B3A5C]
```

### Spacing & Layout

```typescript
// Container
max-w-7xl mx-auto

// Card
rounded-2xl border border-slate-200 bg-white shadow-sm

// Padding
Page: p-6
Card: p-6 (table has no padding for full-width)
```

## 🔌 API Integration

### GET All Leads

```typescript
const response = await fetch("/api/admin/leads")
const data: ApiResponse = await response.json()

// Response structure
{
  success: boolean
  data: Lead[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
```

### PATCH Lead Status

```typescript
const response = await fetch(`/api/admin/leads/${leadId}`, {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ status: newStatus }),
})

// Response structure
{
  success: boolean
  data: Lead
  message: string
}
```

## 🧩 Component Breakdown

### Main Page Component

```typescript
// State Management
const [leads, setLeads] = useState<Lead[]>([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)
const [updatingLeadId, setUpdatingLeadId] = useState<string | null>(null)

// Key Functions
fetchLeads()           // Fetch all leads from API
updateLeadStatus()     // Update single lead status
formatDate()           // Format timestamp for display
```

### Status Select Component

```typescript
<Select
  value={lead.status}
  onValueChange={(value) => updateLeadStatus(lead.id, value)}
  disabled={updatingLeadId === lead.id}
>
  <SelectTrigger className={statusConfig[lead.status].className}>
    <SelectValue>
      {updatingLeadId === lead.id && <Loader2 className="animate-spin" />}
      {statusConfig[lead.status].label}
    </SelectValue>
  </SelectTrigger>
  <SelectContent>
    {/* Status options */}
  </SelectContent>
</Select>
```

## 📊 Data Flow

```
1. Component Mounts
   ↓
2. useEffect triggers fetchLeads()
   ↓
3. Loading state shows skeleton
   ↓
4. API call to /api/admin/leads
   ↓
5. Data stored in state
   ↓
6. Table renders with data
   ↓
7. User changes status dropdown
   ↓
8. updateLeadStatus() called
   ↓
9. PATCH request to /api/admin/leads/[id]
   ↓
10. Local state updated
    ↓
11. Toast notification shown
```

## 🎭 UI States

### 1. Loading State
- Skeleton loaders for header and table
- Pulsing animation
- Professional appearance

### 2. Empty State
- Inbox icon
- "No Leads Found" message
- Helpful description

### 3. Error State
- Alert icon
- Error message
- "Try Again" button

### 4. Data State
- Full table with all leads
- Interactive status dropdowns
- Footer statistics

### 5. Updating State
- Loading spinner in status dropdown
- Disabled dropdown during update
- Toast notification on completion

## 🧪 Testing the Dashboard

### Manual Testing Checklist

```bash
# 1. Start the application
cd apps/web
npm run dev

# 2. Navigate to dashboard
# Open: http://localhost:3000/admin/leads

# 3. Test scenarios:
□ Page loads with skeleton
□ Data appears after loading
□ Empty state shows when no data
□ Status dropdown opens on click
□ Status updates trigger API call
□ Toast notification appears
□ Loading spinner shows during update
□ Table updates after status change
□ Footer stats update correctly
□ Error state shows on API failure
□ Retry button works
```

### Test with Sample Data

```bash
# Insert test data if not already done
docker exec -i phm-postgres psql -U postgres -d phm < test_data.sql

# Refresh the dashboard
# You should see 10 sample leads
```

### Test Status Updates

1. Click any status dropdown
2. Select a different status
3. Observe:
   - Loading spinner appears
   - Toast notification shows
   - Status badge updates
   - Footer stats update

## 🔧 Customization

### Adding New Status Types

```typescript
// 1. Update LeadStatus type
type LeadStatus = "new" | "contacted" | "enrolled" | "closed" | "archived"

// 2. Add to statusConfig
const statusConfig = {
  // ... existing statuses
  archived: {
    label: "Archived",
    className: "bg-gray-100 text-gray-700 border-gray-200",
    bgColor: "bg-gray-50",
  },
}

// 3. Update database ENUM (see schema.sql)
```

### Changing Colors

```typescript
// Update in statusConfig or typeConfig
const statusConfig = {
  enrolled: {
    label: "Enrolled",
    className: "bg-green-100 text-green-700 border-green-200", // Changed
    bgColor: "bg-green-50",
  },
}
```

### Adding Filters

```typescript
// Add filter state
const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all")

// Filter leads
const filteredLeads = leads.filter(
  (lead) => statusFilter === "all" || lead.status === statusFilter
)

// Add filter UI above table
<Select value={statusFilter} onValueChange={setStatusFilter}>
  <SelectItem value="all">All Leads</SelectItem>
  <SelectItem value="new">New</SelectItem>
  {/* ... more options */}
</Select>
```

## 🚀 Performance Optimizations

### Current Optimizations

1. **Client-side caching**: Leads stored in state
2. **Optimistic updates**: UI updates before API confirmation
3. **Conditional rendering**: Only render what's needed
4. **Efficient re-renders**: Proper key usage in lists

### Future Optimizations

1. **Pagination**: Implement server-side pagination
2. **Virtual scrolling**: For large datasets
3. **Debounced search**: Add search functionality
4. **React Query**: Better cache management
5. **Memoization**: useMemo for expensive calculations

## 📱 Responsive Design

The dashboard is fully responsive:

- **Desktop (1024px+)**: Full table layout
- **Tablet (768px-1023px)**: Scrollable table
- **Mobile (<768px)**: Horizontal scroll with sticky columns

## ♿ Accessibility

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus indicators
- Screen reader friendly
- Color contrast compliance (WCAG AA)

## 🔐 Security Considerations

### Current State (Development)
- ⚠️ No authentication
- ⚠️ Public access to /admin/leads
- ⚠️ For local development only

### Phase 4 (Production)
- 🔒 AWS Cognito authentication
- 🔒 Protected routes with middleware
- 🔒 Role-based access control
- 🔒 Session management
- 🔒 CSRF protection

## 🐛 Troubleshooting

### Issue: Page shows empty state but data exists

**Solution**:
1. Check browser console for errors
2. Verify API is running: `curl http://localhost:3000/api/admin/leads`
3. Check database: `docker exec phm-postgres psql -U postgres -d phm -c "SELECT COUNT(*) FROM leads"`

### Issue: Status updates don't work

**Solution**:
1. Check browser console for errors
2. Verify PATCH endpoint: `curl -X PATCH http://localhost:3000/api/admin/leads/{id} -H "Content-Type: application/json" -d '{"status":"contacted"}'`
3. Check database connection

### Issue: Toast notifications don't appear

**Solution**:
1. Verify Toaster is in layout.tsx
2. Check sonner is installed: `npm list sonner`
3. Restart dev server

### Issue: Styling looks broken

**Solution**:
1. Verify Tailwind is configured
2. Check globals.css is imported
3. Clear Next.js cache: `rm -rf .next`
4. Restart dev server

## 📚 Next Steps

### Immediate Enhancements

1. **Search & Filters**
   - Add search by patient name
   - Filter by type and status
   - Date range filtering

2. **Pagination**
   - Implement server-side pagination
   - Page size selector
   - Jump to page

3. **Sorting**
   - Click column headers to sort
   - Multi-column sorting
   - Sort direction indicators

4. **Lead Details Modal**
   - Click row to view full details
   - Show complete message
   - Display source page

5. **Bulk Actions**
   - Select multiple leads
   - Bulk status updates
   - Export to CSV

### Phase 4 Features

1. **Authentication**
   - AWS Cognito integration
   - Protected routes
   - User roles

2. **Advanced Analytics**
   - Lead conversion rates
   - Response time metrics
   - Program interest trends

3. **Notifications**
   - Email alerts for new leads
   - Daily digest
   - Status change notifications

4. **Audit Log**
   - Track all status changes
   - User activity log
   - CloudWatch integration

## 📞 Support

For issues or questions:
- Check this guide first
- Review browser console for errors
- Check API endpoints are working
- Verify database connection

---

**Implementation Date**: May 7, 2026  
**Status**: ✅ Complete and Ready for Use  
**Access**: http://localhost:3000/admin/leads
