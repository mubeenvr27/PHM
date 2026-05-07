# PHM Forms Integration Guide

## ✅ Issue Fixed

Both the **Contact Form** and **Refer a Patient Form** now properly submit data to the database and display creative success feedback.

## 🔧 Changes Made

### 1. Created Referral API Endpoint
**File**: `apps/web/src/app/api/refer/route.ts`

- POST endpoint at `/api/refer`
- Accepts referral form data
- Inserts into `leads` table with `type='referral'`
- Returns success/error response

### 2. Updated Contact Form
**File**: `apps/web/src/app/contact/page.tsx`

**Changes:**
- ✅ Added actual API call to `/api/contact`
- ✅ Added creative success overlay animation
- ✅ Added toast notifications
- ✅ Form resets after successful submission
- ✅ Proper error handling

**Success Animation:**
- Full-screen teal overlay
- Animated checkmark icon
- "Message Sent!" heading
- Sparkle animations
- Auto-dismisses after 3 seconds

### 3. Updated Referral Form
**File**: `apps/web/src/app/refer/page.tsx`

**Changes:**
- ✅ Added actual API call to `/api/refer`
- ✅ Added creative success overlay animation
- ✅ Added toast notifications
- ✅ Form resets after successful submission
- ✅ Proper error handling

**Success Animation:**
- Full-screen teal overlay
- Animated checkmark icon
- "Referral Submitted!" heading
- Sparkle animations
- Auto-dismisses after 3 seconds

## 📊 Data Flow

### Contact Form Flow
```
User fills form
    ↓
Clicks "Request a Consultation"
    ↓
POST /api/contact
    ↓
Data inserted into leads table
    - type: 'contact'
    - patient_name: fullName
    - email, phone, condition_interest, message
    - source_page: '/contact'
    - status: 'new' (default)
    ↓
Success response
    ↓
Success overlay animation (3 seconds)
    ↓
Toast notification
    ↓
Form resets
    ↓
Data appears in Admin Dashboard
```

### Referral Form Flow
```
User fills form
    ↓
Clicks "Submit Referral"
    ↓
POST /api/refer
    ↓
Data inserted into leads table
    - type: 'referral'
    - patient_name: patientName
    - provider_name: providerName
    - email, phone, condition_interest, message
    - source_page: '/refer'
    - status: 'new' (default)
    ↓
Success response
    ↓
Success overlay animation (3 seconds)
    ↓
Toast notification
    ↓
Form resets
    ↓
Data appears in Admin Dashboard
```

## 🎨 Success Animation Details

### Visual Design
```typescript
// Overlay
- Background: Teal (#0D7377)
- Position: Absolute, covers entire form
- Animation: Fade in + Zoom in (500ms)

// Checkmark Icon
- Size: 48px (h-12 w-12)
- Container: 80px circle with white/20 background
- Animation: Zoom in (700ms delay)

// Text
- Heading: "Message Sent!" or "Referral Submitted!"
- Subtext: Response time expectation
- Animation: Slide in from bottom (700ms)

// Sparkles
- 3 sparkle icons
- Pulsing animation with staggered delays
- White with varying opacity
```

### Animation Timeline
```
0ms:    Overlay fades in
500ms:  Checkmark container zooms in
700ms:  Checkmark icon zooms in
700ms:  Heading slides in from bottom
800ms:  Subtext slides in from bottom
Ongoing: Sparkles pulse continuously
3000ms: Overlay fades out
```

## 🧪 Testing

### Test Contact Form

1. **Navigate to Contact Page**
   ```
   http://localhost:3000/contact
   ```

2. **Fill Out Form**
   - Full Name: "John Doe"
   - Phone: "(555) 123-4567"
   - Email: "john@example.com"
   - Program Interest: Select any programs
   - Message: "I'm interested in remote monitoring"

3. **Submit Form**
   - Click "Request a Consultation"
   - Watch for success animation
   - Check toast notification
   - Verify form resets

4. **Check Admin Dashboard**
   ```
   http://localhost:3000/admin/leads
   ```
   - Should see new lead with type "Contact"
   - Status should be "New"
   - All form data should be visible

### Test Referral Form

1. **Navigate to Referral Page**
   ```
   http://localhost:3000/refer
   ```

2. **Fill Out Form**
   - Patient Name: "Jane Smith"
   - Provider Name: "Dr. Johnson"
   - Phone: "(555) 987-6543"
   - Email: "clinic@example.com"
   - Program Interest: Select any programs
   - Notes: "Patient has CHF, needs monitoring"

3. **Submit Form**
   - Click "Submit Referral"
   - Watch for success animation
   - Check toast notification
   - Verify form resets

4. **Check Admin Dashboard**
   ```
   http://localhost:3000/admin/leads
   ```
   - Should see new lead with type "Referral"
   - Provider name should be visible
   - Status should be "New"
   - All form data should be visible

## 📋 Database Schema Mapping

### Contact Form → Database
```typescript
{
  fullName         → patient_name
  phone            → phone
  email            → email
  programInterest  → condition_interest (joined with ", ")
  message          → message
  (hardcoded)      → type: 'contact'
  (hardcoded)      → source_page: '/contact'
  (default)        → status: 'new'
  (auto)           → id: UUID
  (auto)           → created_at: timestamp
}
```

### Referral Form → Database
```typescript
{
  patientName      → patient_name
  providerName     → provider_name
  phone            → phone
  email            → email
  programInterest  → condition_interest (joined with ", ")
  notes            → message
  (hardcoded)      → type: 'referral'
  (hardcoded)      → source_page: '/refer'
  (default)        → status: 'new'
  (auto)           → id: UUID
  (auto)           → created_at: timestamp
}
```

## 🎯 Success Feedback Features

### 1. Success Overlay
- **Purpose**: Immediate visual confirmation
- **Duration**: 3 seconds
- **Design**: Full-screen teal overlay with animations
- **UX**: Non-intrusive, auto-dismisses

### 2. Toast Notifications
- **Purpose**: Persistent confirmation message
- **Duration**: 5 seconds
- **Position**: Top-right corner
- **Content**: Success message + description
- **UX**: Can be dismissed manually

### 3. Form Reset
- **Purpose**: Ready for next submission
- **Timing**: After success animation starts
- **Behavior**: All fields cleared, validation reset

## 🔍 Troubleshooting

### Issue: Form submits but no data in dashboard

**Solution:**
1. Check browser console for errors
2. Verify database is running: `docker ps | grep phm-postgres`
3. Test API directly:
   ```bash
   curl -X POST http://localhost:3000/api/contact \
     -H "Content-Type: application/json" \
     -d '{"fullName":"Test","phone":"555-1234","email":"test@test.com","message":"Test message"}'
   ```
4. Check database:
   ```bash
   docker exec phm-postgres psql -U postgres -d phm -c "SELECT * FROM leads ORDER BY created_at DESC LIMIT 5"
   ```

### Issue: Success animation doesn't show

**Solution:**
1. Check browser console for React errors
2. Verify Tailwind animations are working
3. Check if `showSuccess` state is being set
4. Ensure no CSS conflicts

### Issue: Toast notifications don't appear

**Solution:**
1. Verify Toaster is in layout.tsx
2. Check sonner is installed: `npm list sonner`
3. Restart dev server
4. Check browser console for errors

### Issue: Form doesn't reset after submission

**Solution:**
1. Check if `form.reset()` is being called
2. Verify form submission completes successfully
3. Check browser console for errors

## 📊 Admin Dashboard Integration

### Viewing Submitted Leads

1. **Access Dashboard**
   ```
   http://localhost:3000/admin/leads
   ```

2. **Filter by Type**
   - Contact leads: Type badge shows "Contact" (green)
   - Referral leads: Type badge shows "Referral" (blue)

3. **View Details**
   - Patient Name
   - Provider Name (referrals only)
   - Contact Info (email + phone)
   - Program Interest
   - Message/Notes
   - Submission Date

4. **Update Status**
   - Click status dropdown
   - Select new status (Contacted, Enrolled, Closed)
   - Watch toast confirmation
   - Status updates in real-time

## 🚀 Next Steps

### Immediate Enhancements

1. **Email Notifications**
   - Send email to admin when new lead submitted
   - Send confirmation email to user
   - Use SendGrid or AWS SES

2. **Lead Assignment**
   - Assign leads to team members
   - Track who's handling each lead
   - Add assignment dropdown in dashboard

3. **Follow-up Reminders**
   - Automatic reminders for uncontacted leads
   - Email/SMS notifications
   - Integration with calendar

4. **Analytics**
   - Track conversion rates
   - Response time metrics
   - Program interest trends

### Future Features

1. **Duplicate Detection**
   - Check for existing leads by email/phone
   - Warn before creating duplicate
   - Merge duplicate leads

2. **Lead Scoring**
   - Prioritize leads based on criteria
   - Automatic scoring algorithm
   - Visual priority indicators

3. **Integration with CRM**
   - Sync with Salesforce/HubSpot
   - Bi-directional data flow
   - Automated workflows

4. **Advanced Validation**
   - Phone number formatting
   - Email verification
   - Address validation

## 📝 Code Examples

### Adding Custom Success Message

```typescript
// In onSubmit function
if (result.success) {
  setShowSuccess(true)
  
  toast.success("Custom Success Title!", {
    description: "Your custom description here.",
    duration: 5000,
  })
  
  // ... rest of code
}
```

### Customizing Success Animation

```typescript
// In the success overlay JSX
<div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#0D7377] animate-in fade-in zoom-in duration-500">
  <div className="text-center">
    {/* Change icon */}
    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20">
      <YourCustomIcon className="h-12 w-12 text-white" />
    </div>
    
    {/* Change text */}
    <h3 className="mb-2 text-2xl font-bold text-white">
      Your Custom Title!
    </h3>
    <p className="text-white/90">
      Your custom description
    </p>
  </div>
</div>
```

### Adding Additional Form Fields

```typescript
// 1. Update schema
const formSchema = z.object({
  // ... existing fields
  newField: z.string().min(1, { message: "Required" }),
})

// 2. Add to form
<FormField
  control={form.control}
  name="newField"
  render={({ field }) => (
    <FormItem>
      <FormLabel>New Field</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

// 3. Update API to handle new field
const newField = body.newField;
// Add to INSERT query
```

## ✅ Verification Checklist

- [x] Contact form submits to `/api/contact`
- [x] Referral form submits to `/api/refer`
- [x] Data appears in admin dashboard
- [x] Success animations display correctly
- [x] Toast notifications appear
- [x] Forms reset after submission
- [x] Error handling works
- [x] Database records created with correct type
- [x] All form fields map to database columns
- [x] Status defaults to 'new'
- [x] Timestamps are recorded
- [x] Provider name captured for referrals
- [x] Program interests joined correctly

---

**Implementation Date**: May 7, 2026  
**Status**: ✅ Complete and Tested  
**Forms**: Contact + Referral  
**Success Feedback**: Creative animations + Toast notifications
