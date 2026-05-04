# CV Custom Sections - Implementation Guide

## Overview
This document describes how to add custom CV sections (like Awards, Publications, Certifications) with dynamic add/remove functionality.

## Database Setup

### 1. Run the Migration
Execute the SQL in `/supabase-migration-cv-custom-sections.sql` in your Supabase SQL Editor. This creates the `cv_custom_sections` table.

### 2. Table Structure
```sql
cv_custom_sections (
  id: serial primary key
  section_id: text unique  -- e.g., 'awards', 'publications'
  section_name: text       -- e.g., 'Awards & Recognition'
  content: text            -- rich text content
  order_index: integer
  enabled: boolean
)
```

## Implementation Steps

### Step 1: Update CVAdmin State
Add these state variables to `CVAdmin`:

```typescript
const [customSections, setCustomSections] = useState<CVCustomSection[]>([]);
const [isAddingSectionconst, setIsAddingSection] = useState(false);
const [newSectionName, setNewSectionName] = useState('');
const [customSectionContent, setCustomSectionContent] = useState<Record<string, string>>({});
```

### Step 2: Load Custom Sections
Add a function to load custom sections from Supabase:

```typescript
const loadCustomSections = async () => {
  const { data, error } = await supabase
    .from('cv_custom_sections')
    .select('*')
    .order('order_index', { ascending: true });
  
  if (!error && data) {
    setCustomSections(data);
    
    // Merge custom sections into sections state for tab rendering
    const customSectionConfigs: CVSection[] = data.map(cs => ({
      id: cs.section_id,
      name: cs.section_id,
      label: cs.section_name,
      enabled: cs.enabled || true,
      order: DEFAULT_SECTIONS.length + (cs.order_index || 0),
      isCustom: true
    }));
    
    setSections([...DEFAULT_SECTIONS, ...customSectionConfigs]);
  }
};
```

Call this in useEffect:
```typescript
useEffect(() => {
  loadSections();
  loadCustomSections();
}, []);
```

### Step 3: Add Section Creation UI
In the "Manage Sections" tab, add an "Add New Section" button and form:

```typescript
{activeTab === 'manage-sections' && (
  <div>
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-semibold">Manage CV Sections</h2>
      <button
        onClick={() => setIsAddingSection(true)}
        className="flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-gray-800"
      >
        <Plus className="w-4 h-4" />
        Add New Section
      </button>
    </div>

    {/* Add Section Form */}
    {isAddingSection && (
      <div className="bg-gray-50 p-6 mb-6 border border-gray-200">
        <h3 className="font-semibold mb-4">Create New Section</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Section Name</label>
            <input
              type="text"
              value={newSectionName}
              onChange={(e) => setNewSectionName(e.target.value)}
              placeholder="e.g., Awards & Recognition, Publications, Certifications"
              className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-black"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                const sectionId = newSectionName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                const { error } = await supabase
                  .from('cv_custom_sections')
                  .insert([{
                    section_id: sectionId,
                    section_name: newSectionName,
                    content: '',
                    order_index: customSections.length,
                    enabled: true
                  }]);
                
                if (!error) {
                  setNewSectionName('');
                  setIsAddingSection(false);
                  loadCustomSections();
                }
              }}
              className="px-4 py-2 bg-black text-white hover:bg-gray-800"
            >
              <Save className="w-4 h-4" />
              Create Section
            </button>
            <button
              onClick={() => {
                setNewSectionName('');
                setIsAddingSection(false);
              }}
              className="px-4 py-2 border border-gray-300 hover:bg-gray-50"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Section List */}
    <div className="space-y-4">
      {sections.map((section, index) => (
        <DraggableSection
          key={section.id}
          section={section}
          index={index}
          onToggle={() => toggleSection(section.id)}
          onMove={reorderSections}
          onDelete={section.isCustom ? async () => {
            if (confirm(`Delete "${section.label}" section?`)) {
              await supabase
                .from('cv_custom_sections')
                .delete()
                .eq('section_id', section.id);
              loadCustomSections();
            }
          } : undefined}
        />
      ))}
    </div>
  </div>
)}
```

### Step 4: Update DraggableSection Component
Add support for delete button on custom sections:

```typescript
function DraggableSection({
  section,
  index,
  onToggle,
  onMove,
  onDelete, // Add this prop
}: {
  section: CVSection;
  index: number;
  onToggle: () => void;
  onMove: (dragIndex: number, hoverIndex: number) => void;
  onDelete?: () => void; // Optional for custom sections only
}) {
  // ... existing drag/drop logic ...

  return (
    <div ref={dragDropRef} style={{ opacity, backgroundColor }} className="border border-gray-200 p-4 flex justify-between items-center">
      <div className="flex gap-3 items-center">
        <div className="cursor-move pt-1 text-gray-400 hover:text-gray-600 transition-colors" title="Drag to reorder">
          <GripVertical className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold">
            {section.label}
            {section.isCustom && <span className="ml-2 text-sm text-gray-500">(Custom)</span>}
          </h3>
          <p className="text-sm text-gray-500">Order: {section.order}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onToggle}
          className={`flex items-center gap-2 px-4 py-2 transition-colors ${
            section.enabled 
              ? 'bg-green-500 text-white hover:bg-green-600' 
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          {section.enabled ? (
            <>
              <Eye className="w-4 h-4" />
              <span>Enabled</span>
            </>
          ) : (
            <>
              <EyeOff className="w-4 h-4" />
              <span>Disabled</span>
            </>
          )}
        </button>
        {onDelete && (
          <button
            onClick={onDelete}
            className="p-2 hover:bg-gray-100 transition-colors text-red-600"
            title="Delete custom section"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
```

### Step 5: Render Custom Section Tabs Dynamically
Replace the hardcoded nav tabs with dynamic rendering:

```typescript
<nav className="flex gap-8">
  {/* Core sections */}
  {DEFAULT_SECTIONS.map(section => (
    <button
      key={section.id}
      onClick={() => setActiveTab(section.id)}
      className={`pb-4 px-2 border-b-2 transition-colors ${
        activeTab === section.id
          ? 'border-black text-black'
          : 'border-transparent text-gray-500 hover:text-gray-700'
      }`}
    >
      {section.label}
    </button>
  ))}
  
  {/* Custom sections */}
  {customSections.filter(cs => cs.enabled).map(cs => (
    <button
      key={cs.section_id}
      onClick={() => setActiveTab(cs.section_id)}
      className={`pb-4 px-2 border-b-2 transition-colors ${
        activeTab === cs.section_id
          ? 'border-black text-black'
          : 'border-transparent text-gray-500 hover:text-gray-700'
      }`}
    >
      {cs.section_name}
    </button>
  ))}
  
  {/* Manage Sections tab */}
  <button
    onClick={() => setActiveTab('manage-sections')}
    className={`pb-4 px-2 border-b-2 transition-colors ${
      activeTab === 'manage-sections'
        ? 'border-black text-black'
        : 'border-transparent text-gray-500 hover:text-gray-700'
    }`}
  >
    Manage Sections
  </button>
</nav>
```

### Step 6: Add Custom Section Content Editor
Add a content editor for when a custom section tab is selected:

```typescript
{/* Custom Section Content Editors */}
{customSections.map(cs => (
  activeTab === cs.section_id && (
    <div key={cs.section_id}>
      <h2 className="text-2xl font-semibold mb-6">{cs.section_name}</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Content</label>
          <textarea
            value={customSectionContent[cs.section_id] || cs.content || ''}
            onChange={(e) => setCustomSectionContent({
              ...customSectionContent,
              [cs.section_id]: e.target.value
            })}
            rows={15}
            placeholder="Enter content for this section (supports markdown)"
            className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-black font-mono text-sm"
          />
        </div>
        <button
          onClick={async () => {
            const { error } = await supabase
              .from('cv_custom_sections')
              .update({ content: customSectionContent[cs.section_id] || cs.content })
              .eq('id', cs.id);
            
            if (!error) {
              alert('Content saved successfully!');
              loadCustomSections();
            }
          }}
          className="flex items-center gap-2 px-6 py-3 bg-black text-white hover:bg-gray-800"
        >
          <Save className="w-4 h-4" />
          Save Content
        </button>
      </div>
    </div>
  )
))}
```

### Step 7: Update CVPage to Display Custom Sections
In `/src/app/components/CVPage.tsx`, load and display custom sections:

```typescript
// Add state for custom sections
const [customSections, setCustomSections] = useState<CVCustomSection[]>([]);

// In useEffect, load custom sections
const { data: customSectionsData } = await supabase
  .from('cv_custom_sections')
  .select('*')
  .eq('enabled', true)
  .order('order_index', { ascending: true });

if (customSectionsData) {
  setCustomSections(customSectionsData);
}

// Render custom sections after the default sections
{customSections.map(section => (
  <CollapsibleSection
    key={section.id}
    id={section.section_id}
    title={section.section_name}
    isOpen={openSection === section.section_id}
    onToggle={() => toggleSection(section.section_id)}
    sectionHeadingStyle={sectionHeadingStyle}
  >
    <div 
      className="prose prose-gray max-w-none"
      style={bodyTextStyle}
      dangerouslySetInnerHTML={{ __html: section.content || '' }}
    />
  </CollapsibleSection>
))}
```

## Usage Instructions

1. **Run the migration** in Supabase SQL Editor
2. **Go to CV Admin** → **Manage Sections** tab
3. **Click "Add New Section"** button
4. **Enter a section name** (e.g., "Awards & Recognition", "Publications")
5. **Click "Create Section"**
6. **The new tab appears** in the navigation
7. **Click the new tab** to edit its content
8. **Add content** using the text editor (supports plain text or HTML/Markdown)
9. **Click "Save Content"**
10. **View your CV** to see the new section displayed
11. **Drag sections** in "Manage Sections" to reorder them
12. **Toggle enable/disable** to show/hide sections
13. **Delete custom sections** using the trash icon (default sections cannot be deleted)

## Features

✅ Add unlimited custom CV sections  
✅ Edit section names and content  
✅ Reorder sections with drag & drop  
✅ Enable/disable sections  
✅ Delete custom sections  
✅ Custom sections appear as tabs  
✅ Custom sections display on public CV page  
✅ Content supports plain text, HTML, or Markdown  

## Notes

- Default sections (Profile, Work, Education, Languages, Skills) cannot be deleted
- Custom sections can be deleted at any time
- Section IDs are generated from names (e.g., "Awards & Recognition" → "awards-recognition")
- All changes are saved to Supabase database
- Section visibility is managed in "Manage Sections" tab
