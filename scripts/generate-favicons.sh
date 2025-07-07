#!/bin/bash

# Generate Favicons Script
# This script converts the SVG favicon to multiple PNG sizes for better browser and Google support

echo "🎨 Generating favicon files for ProPaint Quote..."

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick is not installed. Please install it first:"
    echo "   Mac: brew install imagemagick"
    echo "   Ubuntu: sudo apt-get install imagemagick"
    exit 1
fi

# Source SVG file
SOURCE_SVG="public/favicon-palette.svg"
PUBLIC_DIR="public"

# Check if source file exists
if [ ! -f "$SOURCE_SVG" ]; then
    echo "❌ Source file $SOURCE_SVG not found!"
    exit 1
fi

echo "📁 Using source: $SOURCE_SVG"

# Generate PNG files in various sizes
echo "🔄 Generating PNG files..."

# Standard favicon sizes
convert -background none -resize 16x16 "$SOURCE_SVG" "$PUBLIC_DIR/favicon-16x16.png"
convert -background none -resize 32x32 "$SOURCE_SVG" "$PUBLIC_DIR/favicon-32x32.png"
convert -background none -resize 48x48 "$SOURCE_SVG" "$PUBLIC_DIR/favicon-48x48.png"

# PWA and mobile sizes
convert -background none -resize 192x192 "$SOURCE_SVG" "$PUBLIC_DIR/favicon-192x192.png"
convert -background none -resize 512x512 "$SOURCE_SVG" "$PUBLIC_DIR/favicon-512x512.png"

# Apple Touch Icons
convert -background none -resize 120x120 "$SOURCE_SVG" "$PUBLIC_DIR/apple-touch-icon-120x120.png"
convert -background none -resize 152x152 "$SOURCE_SVG" "$PUBLIC_DIR/apple-touch-icon-152x152.png"
convert -background none -resize 180x180 "$SOURCE_SVG" "$PUBLIC_DIR/apple-touch-icon.png"

# Android Chrome
convert -background none -resize 192x192 "$SOURCE_SVG" "$PUBLIC_DIR/android-chrome-192x192.png"
convert -background none -resize 512x512 "$SOURCE_SVG" "$PUBLIC_DIR/android-chrome-512x512.png"

# Microsoft Tiles
convert -background "#FF6B35" -resize 144x144 "$SOURCE_SVG" "$PUBLIC_DIR/mstile-144x144.png"
convert -background "#FF6B35" -resize 150x150 "$SOURCE_SVG" "$PUBLIC_DIR/mstile-150x150.png"

echo "🔄 Creating multi-resolution ICO file..."
# Create ICO file with multiple resolutions
convert "$PUBLIC_DIR/favicon-16x16.png" "$PUBLIC_DIR/favicon-32x32.png" "$PUBLIC_DIR/favicon-48x48.png" "$PUBLIC_DIR/favicon.ico"

echo "🔄 Copying Safari pinned tab SVG..."
cp "$SOURCE_SVG" "$PUBLIC_DIR/safari-pinned-tab.svg"

echo "✅ Favicon generation complete!"
echo ""
echo "📋 Generated files:"
ls -la "$PUBLIC_DIR"/favicon* "$PUBLIC_DIR"/apple* "$PUBLIC_DIR"/android* "$PUBLIC_DIR"/mstile* 2>/dev/null | grep -E '\.(png|ico|svg)$'

echo ""
echo "💡 Next steps:"
echo "1. Verify the generated files look correct"
echo "2. Commit and push to Git"
echo "3. Deploy to production"
echo "4. Submit sitemap to Google Search Console"