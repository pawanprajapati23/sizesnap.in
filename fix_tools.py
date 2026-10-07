import re

with open('data/tools.ts', 'r') as f:
    lines = f.readlines()

# Find end of ALL_TOOLS
all_tools_end = -1
for i, line in enumerate(lines):
    if line.startswith('export const SIDEBAR_QUICK_LINKS'):
        all_tools_end = i - 2
        break

# Find start and end of PHASE 7 in NAV_MENUS
phase_7_start = -1
for i in range(len(lines)):
    if 'PHASE 7: STUDENT & EXAM TOOLS' in lines[i]:
        phase_7_start = i - 1
        break

phase_7_end = len(lines) - 5  # roughly before "export function getToolBySlug"

if all_tools_end != -1 and phase_7_start != -1:
    phase_7_lines = lines[phase_7_start:phase_7_end]
    # Remove from NAV_MENUS
    del lines[phase_7_start:phase_7_end]
    
    # Also remove the '];' from phase_7_lines if it's there
    if '];\n' in phase_7_lines[-1] or '];' in phase_7_lines[-1]:
        phase_7_lines.pop()
        
    # Insert at end of ALL_TOOLS
    # Wait, all_tools_end is the line with "];". We want to insert BEFORE that line.
    for i, line in enumerate(lines):
        if line.startswith('export const SIDEBAR_QUICK_LINKS'):
            all_tools_end = i - 2
            break
            
    lines = lines[:all_tools_end] + phase_7_lines + lines[all_tools_end:]
    
    with open('data/tools.ts', 'w') as f:
        f.writelines(lines)
    print("Fixed!")
else:
    print("Could not find boundaries")
