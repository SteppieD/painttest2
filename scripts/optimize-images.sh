#!/bin/bash

# Image optimization script
# Converts JPG images to WebP with proper sizing for different use cases

SOURCE_DIR="/Users/sepg/Desktop/Paint Images"
DEST_DIR="/Users/sepg/Desktop/painttest2/public/images/professional"

# Create destination directory if it doesn't exist
mkdir -p "$DEST_DIR"

# Define image sizes for different use cases
# Hero images: 1920x1080 (full width, high quality)
# Feature cards: 800x600 (medium size)
# Thumbnails: 400x300 (small size)

echo "🖼️  Starting image optimization and WebP conversion..."

# Function to convert and resize image
convert_image() {
    local input_file="$1"
    local output_name="$2"
    local width="$3"
    local quality="$4"
    
    echo "Converting: $input_file -> ${output_name}.webp (${width}px wide, ${quality}% quality)"
    
    # Use cwebp with specific dimensions and quality
    cwebp -q "$quality" -resize "$width" 0 "$input_file" -o "$DEST_DIR/${output_name}.webp"
}

# Hero Images (1920px wide, 85% quality)
echo "📸 Processing hero images..."
convert_image "$SOURCE_DIR/man-painting-wall-light-blue.jpg" "hero-main" 1920 85
convert_image "$SOURCE_DIR/couple-picking-paint-color.jpg" "hero-secondary" 1920 85
convert_image "$SOURCE_DIR/contractor-customer-outdoor-handshake.jpg" "hero-tertiary" 1920 85

# Feature Section Images (800px wide, 80% quality)
echo "📸 Processing feature images..."
convert_image "$SOURCE_DIR/construction-contractor-using-computer-smiling.jpg" "feature-quote-creation" 800 80
convert_image "$SOURCE_DIR/construction-man-looking-at-paperwork-with-client-smiling.jpg" "feature-customer-meeting" 800 80
convert_image "$SOURCE_DIR/contractor-and-owner-with-blueprints-looking-at-wall.jpg" "feature-project-planning" 800 80
convert_image "$SOURCE_DIR/couple-in-house-with-construction-workers-looking-at-blueprints.jpg" "feature-team-work" 800 80

# Service Images (1200px wide, 80% quality)
echo "📸 Processing service images..."
convert_image "$SOURCE_DIR/man-painting-constructions-room-white-with-ladder.jpg" "service-residential" 1200 80
convert_image "$SOURCE_DIR/man-painting-exterior-highrise-tropical.jpg" "service-commercial" 1200 80
convert_image "$SOURCE_DIR/woman-painting-wall-grey-smiling.jpg" "service-interior" 1200 80
convert_image "$SOURCE_DIR/painting-home-light-brown-professional.jpg" "service-exterior" 1200 80

# Team Images (600px wide, 80% quality)
echo "📸 Processing team images..."
convert_image "$SOURCE_DIR/happy-contractor-working-on-blueprints-in-house.jpg" "team-contractor" 600 80
convert_image "$SOURCE_DIR/man-painting-wall-on-ladder.jpg" "team-painter1" 600 80
convert_image "$SOURCE_DIR/woman-painting-wall-orange.jpg" "team-painter2" 600 80
convert_image "$SOURCE_DIR/contruction-company-and-clinet-reviewing-plans.jpg" "team-consultation" 600 80

# Case Study Images (1200px wide, 85% quality)
echo "📸 Processing case study images..."
convert_image "$SOURCE_DIR/couple-reviewing-blueprints-in-construction-home.jpg" "case-study-planning" 1200 85
convert_image "$SOURCE_DIR/man-spraying-paint-balcony-white-facemask.jpg" "case-study-execution" 1200 85
convert_image "$SOURCE_DIR/man-staring-half-painted-wall.jpg" "case-study-completion" 1200 85
convert_image "$SOURCE_DIR/couple-in-framed-house-looking-at-blueprints-with-contractor.jpg" "case-study-satisfaction" 1200 85

# Blog Images (1000px wide, 80% quality)
echo "📸 Processing blog images..."
convert_image "$SOURCE_DIR/woman-picking-paint-clour-on-wall-older.jpg" "blog-color-selection" 1000 80
convert_image "$SOURCE_DIR/girl-painting-wall-yellow-hat.jpg" "blog-diy-vs-pro" 1000 80
convert_image "$SOURCE_DIR/woman-painting-wall-empty-roller.jpg" "blog-preparation" 1000 80
convert_image "$SOURCE_DIR/woman-painting-wall-grey-on-ladder.jpg" "blog-techniques" 1000 80
convert_image "$SOURCE_DIR/woman-painting-wall-grey-red-shirt.jpg" "blog-trends" 1000 80

# SEO Pages Images (1200px wide, 85% quality)
echo "📸 Processing SEO page images..."
convert_image "$SOURCE_DIR/construction-contractor-using-computer-smiling.jpg" "seo-calculator" 1200 85
convert_image "$SOURCE_DIR/construction-couple-looking-at-blueprints-hardhelmets.jpg" "seo-templates" 1200 85
convert_image "$SOURCE_DIR/happy-contractor-working-on-blueprints-in-house.jpg" "seo-guide" 1200 85
convert_image "$SOURCE_DIR/construction-man-looking-at-paperwork-with-client-smiling.jpg" "seo-software" 1200 85

echo "✅ Image optimization complete!"

# Show file size comparison
echo "📊 File size report:"
du -sh "$DEST_DIR"

# Clean up old JPG files if they exist
echo "🧹 Cleaning up old JPG files..."
rm -f "$DEST_DIR"/*.jpg

echo "🎉 All images converted to WebP format!"