const fs = require('fs');

let content = fs.readFileSync('components/ToolDirectory.tsx', 'utf-8');

content = content.replace(`  const filteredTools = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return ALL_TOOLS;
    return ALL_TOOLS.filter((tool) =>
      tool.name.toLowerCase().includes(query) ||
      tool.categoryTitle.toLowerCase().includes(query)
    );
  }, [searchQuery]);`, `  const filteredTools = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return ALL_TOOLS;
    return ALL_TOOLS.filter((tool) =>
      tool.name.toLowerCase().includes(query) ||
      tool.categoryTitle.toLowerCase().includes(query) ||
      (tool.keywords || []).some(k => k.toLowerCase().includes(query)) ||
      (tool.aliases || []).some(a => a.toLowerCase().includes(query))
    );
  }, [searchQuery]);`);

fs.writeFileSync('components/ToolDirectory.tsx', content, 'utf-8');
