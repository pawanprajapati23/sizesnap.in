import sys
from PIL import Image

def process_image(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    pixels = img.load()
    width, height = img.size
    
    # Flood fill exterior background from top-left (0,0)
    # Target color is roughly white
    
    def flood_fill(start_x, start_y):
        target_color = pixels[start_x, start_y]
        # Only fill if it's near white
        if target_color[0] < 240 or target_color[1] < 240 or target_color[2] < 240:
            return
            
        stack = [(start_x, start_y)]
        visited = set()
        
        while stack:
            x, y = stack.pop()
            if (x, y) in visited:
                continue
            visited.add((x, y))
            
            c = pixels[x, y]
            # If color is close to the target color (white)
            if abs(c[0]-255) < 30 and abs(c[1]-255) < 30 and abs(c[2]-255) < 30 and c[3] != 0:
                pixels[x, y] = (255, 255, 255, 0) # Make transparent
                if x > 0: stack.append((x-1, y))
                if x < width - 1: stack.append((x+1, y))
                if y > 0: stack.append((x, y-1))
                if y < height - 1: stack.append((x, y+1))
                
    # Fill from corners
    flood_fill(0, 0)
    flood_fill(width-1, 0)
    flood_fill(0, height-1)
    flood_fill(width-1, height-1)
    
    # Fill neck area (top center)
    flood_fill(width // 2, 0)
    # Fill a bit lower in the neck just in case
    for y in range(0, height // 3):
        if pixels[width//2, y][3] != 0: # find first non-transparent
            # wait, the neck might be drawn as white inside the collar
            c = pixels[width//2, y]
            if abs(c[0]-255) < 30 and abs(c[1]-255) < 30 and abs(c[2]-255) < 30:
                flood_fill(width//2, y)
            break

    # Save
    img.save(output_path, "PNG")
    print(f"Saved to {output_path}")

process_image('/home/techiedevang/.gemini/antigravity-cli/brain/d3c1892d-08a3-4eb1-b7ec-5753e5f1ccb7/mens_formal_suit_transparent_1787325018209.jpg', 'public/mens_suit.png')
