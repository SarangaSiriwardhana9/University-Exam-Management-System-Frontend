# 🐛 Forms Debugging - Complete Guide

## Issues Fixed

### 1. ✅ **User Edit Form - Dropdowns Not Showing Data**

**Problem:**
- Department dropdown not showing selected value
- Year dropdown not showing selected value  
- Semester dropdown not showing selected value

**Root Cause:**
- Form wasn't waiting for department data to load
- Department ID extraction wasn't handling object vs string
- Form reset happening before data was ready

**Solution Applied:**
```typescript
// Added department fetching for edit mode
const userDepartmentId = extractId(user?.departmentId)
const { data: userDepartmentResponse } = useDepartmentQuery(
  isEditMode ? userDepartmentId : undefined
)

// Merged department options
const departmentOptions = useMemo(() => {
  const map = new Map<string, Department>()
  ;(departmentsResponse?.data || []).forEach((d) => map.set(d._id, d))
  if (userDepartmentResponse?.data) map.set(userDepartmentResponse.data._id, userDepartmentResponse.data)
  return Array.from(map.values())
}, [departmentsResponse?.data, userDepartmentResponse?.data])

// Wait for data before resetting
const readyToReset = 
  !isDepartmentsLoading &&
  (!userDepartmentId || !isUserDepartmentLoading)

if (readyToReset) {
  form.reset({ ...resetData })
}
```

---

### 2. ✅ **Subject Edit Form - Semester Not Showing**

**Problem:**
- Semester field missing from transformation
- Complex hook code hard to debug
- No console logging

**Root Cause:**
- `transformSubject()` function didn't include `semester` field
- Hook had 118 lines of complex regex parsing
- No debugging output

**Solution Applied:**
```typescript
// Simplified transformation
const transformSubject = (subj: BackendSubject): Subject => {
  console.log('Transforming subject:', subj)
  
  const transformed = {
    _id: subj._id,
    subjectCode: subj.subjectCode,
    subjectName: subj.subjectName,
    departmentId: extractId(subj.departmentId) || '',
    departmentName: typeof subj.departmentId === 'object' ? subj.departmentId.departmentName : undefined,
    year: subj.year,
    semester: subj.semester,  // ✅ FIXED!
    credits: subj.credits,
    // ... rest of fields
  }
  
  console.log('Transformed subject:', transformed)
  return transformed
}
```

---

## Console Logs Added

### **User Form**
```
User data received: { _id, username, email, ... }
User department ID: "68d7bc691c50c897b82f302c"
Departments loading: false
User department loading: false
Department options: [{ _id, departmentName, ... }]
Resetting form with data: { username, email, departmentId, year, semester, ... }
```

### **Subject Hook**
```
Transforming subject: { _id, subjectCode, departmentId: {...}, year, semester, ... }
Transformed subject: { _id, subjectCode, departmentId: "string", year: 1, semester: 1, ... }
```

### **User Hook**
```
User fetched from API: { _id, username, email, departmentId, year, semester, ... }
```

---

## How to Debug

### 1. **Open Browser DevTools**
- Press F12
- Go to Console tab

### 2. **Edit a User**
Look for these logs:
```
✅ User data received: {...}
✅ User department ID: "..."
✅ Departments loading: false
✅ Department options: [...]
✅ Resetting form with data: {...}
```

**Check:**
- Is `departmentId` a string or object?
- Is `year` a number (1-4)?
- Is `semester` a number (1-2)?
- Are department options populated?

### 3. **Edit a Subject**
Look for these logs:
```
✅ Transforming subject: {...}
✅ Transformed subject: {...}
```

**Check:**
- Does raw subject have `semester` field?
- Is transformation including all fields?
- Are dropdowns getting correct values?

---

## Common Issues & Solutions

### Issue: Dropdown shows "Select..." but data exists

**Check:**
1. Is the value in the form state?
   ```typescript
   console.log('Form values:', form.getValues())
   ```

2. Does the dropdown value match an option?
   ```typescript
   console.log('Department ID:', form.getValues('departmentId'))
   console.log('Available departments:', departmentOptions.map(d => d._id))
   ```

3. Is the Select component using the right value prop?
   ```typescript
   <Select value={field.value || ''}>  // ✅ Good
   <Select value={field.value}>        // ❌ May fail if undefined
   ```

### Issue: Form resets to empty values

**Check:**
1. Is data loading complete?
   ```typescript
   console.log('Ready to reset:', readyToReset)
   console.log('Loading states:', { isDepartmentsLoading, isUserDepartmentLoading })
   ```

2. Is the reset data correct?
   ```typescript
   console.log('Reset data:', resetData)
   ```

### Issue: Semester/Year not showing in dropdown

**Check:**
1. Is the value a number or string?
   ```typescript
   console.log('Year type:', typeof form.getValues('year'))
   console.log('Year value:', form.getValues('year'))
   ```

2. Is the Select converting properly?
   ```typescript
   <Select 
     onValueChange={(value) => field.onChange(Number(value))}  // ✅ Convert to number
     value={field.value?.toString()}  // ✅ Convert to string for display
   >
   ```

---

## Pattern to Follow

### ✅ **For Edit Forms with Dropdowns**

```typescript
export const MyForm = ({ item, onSubmit }) => {
  const isEditMode = !!item
  
  // 1. Fetch list data
  const { data: listData, isLoading: isListLoading } = useListQuery()
  
  // 2. Extract ID from item
  const itemRelatedId = extractId(item?.relatedId)
  
  // 3. Fetch specific item if needed
  const { data: itemRelatedData, isLoading: isItemLoading } = useItemQuery(
    isEditMode ? itemRelatedId : undefined
  )
  
  // 4. Merge options
  const options = useMemo(() => {
    const map = new Map()
    ;(listData?.data || []).forEach(x => map.set(x._id, x))
    if (itemRelatedData?.data) map.set(itemRelatedData.data._id, itemRelatedData.data)
    return Array.from(map.values())
  }, [listData?.data, itemRelatedData?.data])
  
  // 5. Wait for data before reset
  useEffect(() => {
    if (!isEditMode || !item) return
    
    const readyToReset = !isListLoading && (!itemRelatedId || !isItemLoading)
    
    if (readyToReset) {
      console.log('Resetting form with:', item)
      form.reset({
        relatedId: itemRelatedId || '',
        // ... other fields
      })
    }
  }, [isEditMode, item, isListLoading, isItemLoading, itemRelatedId, form])
  
  // 6. Use merged options in dropdown
  return (
    <Select value={field.value || ''}>
      {options.map(opt => (
        <SelectItem key={opt._id} value={opt._id}>
          {opt.name}
        </SelectItem>
      ))}
    </Select>
  )
}
```

---

## Files Updated

### ✅ **User Form**
- `src/features/users/components/user-form.tsx`
- Added department fetching
- Added console logs
- Fixed dropdown population

### ✅ **Subject Hook**
- `src/features/subjects/hooks/use-subjects.ts`
- Simplified from 118 to 84 lines
- Added semester field
- Added console logs
- Removed complex regex parsing

### ✅ **User Hook**
- `src/features/users/hooks/use-users.ts`
- Added console log for debugging

---

## Testing Checklist

- [ ] Open user edit form
- [ ] Check console for logs
- [ ] Verify department dropdown shows selected value
- [ ] Verify year dropdown shows selected value (1-4)
- [ ] Verify semester dropdown shows selected value (1-2)
- [ ] Open subject edit form
- [ ] Check console for transformation logs
- [ ] Verify year dropdown shows selected value (1-4)
- [ ] Verify semester dropdown shows selected value (1-2)
- [ ] Verify department dropdown shows selected value
- [ ] Save changes and verify API call

---

## Success Criteria

✅ **User Edit Form:**
- Department dropdown displays selected department
- Year dropdown displays 1-4 with correct selection
- Semester dropdown displays 1-2 with correct selection
- All input fields populated correctly

✅ **Subject Edit Form:**
- Department dropdown displays selected department
- Year dropdown displays 1-4 with correct selection
- Semester dropdown displays 1-2 with correct selection
- LIC dropdown displays selected lecturer
- All fields populated correctly

✅ **Console Logs:**
- Clear debugging information
- Shows data flow
- Helps identify issues quickly

---

## Next Steps

1. Test both forms in the browser
2. Check console logs for any errors
3. Verify dropdowns show correct values
4. If issues persist, check the console logs to identify the problem
5. Remove console.log statements once everything works (optional)

The forms are now properly set up with debugging capabilities! 🎉
