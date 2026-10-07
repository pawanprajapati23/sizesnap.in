import re

with open('data/tools.ts', 'r') as f:
    text = f.read()

start_marker = "  // ==========================================\n  // PHASE 7: STUDENT & EXAM TOOLS"
end_marker = "];\n\nexport function getToolBySlug"

start_idx = text.find(start_marker)
end_idx = text.find(end_marker)

if start_idx != -1 and end_idx != -1:
    block_to_move = text[start_idx:end_idx]
    
    # Remove block from current location
    text = text[:start_idx] + text[end_idx:]
    
    # Insert block before closing of ALL_TOOLS
    all_tools_end_marker = "];\n\n// Sidebar quick links specified by the user"
    all_tools_end_idx = text.find(all_tools_end_marker)
    
    if all_tools_end_idx != -1:
        text = text[:all_tools_end_idx] + block_to_move + text[all_tools_end_idx:]
        
        with open('data/tools.ts', 'w') as f:
            f.write(text)
        print("Success!")
    else:
        print("Could not find ALL_TOOLS end")
else:
    print("Could not find block")
