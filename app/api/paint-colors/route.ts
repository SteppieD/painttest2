import { NextRequest, NextResponse } from "next/server";
import Database from "better-sqlite3";

const db = new Database("./painting_quotes_app.db");

export async function POST(req: NextRequest) {
  try {
    const { userId, colors } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Common default colors
    const defaultColors = [
      { name: "Pure White", code: "SW 7005", brand: "Sherwin-Williams", hex: "#F8F8F8" },
      { name: "Agreeable Gray", code: "SW 7029", brand: "Sherwin-Williams", hex: "#D1CDC7" },
      { name: "Accessible Beige", code: "SW 7036", brand: "Sherwin-Williams", hex: "#D4C7B8" },
      { name: "Repose Gray", code: "SW 7015", brand: "Sherwin-Williams", hex: "#C9C5C1" },
      { name: "Alabaster", code: "SW 7008", brand: "Sherwin-Williams", hex: "#EDEAE0" },
      { name: "Swiss Coffee", code: "OC-45", brand: "Benjamin Moore", hex: "#F6F3ED" },
      { name: "Cloud White", code: "OC-130", brand: "Benjamin Moore", hex: "#F1EFE8" },
      { name: "Simply White", code: "OC-117", brand: "Benjamin Moore", hex: "#F7F5F1" },
      { name: "Chantilly Lace", code: "OC-65", brand: "Benjamin Moore", hex: "#F5F5F0" },
      { name: "White Dove", code: "OC-17", brand: "Benjamin Moore", hex: "#F2F0E6" },
    ];

    // Insert default colors for new users
    const insertStmt = db.prepare(`
      INSERT OR IGNORE INTO paint_colors (
        user_id,
        color_name,
        color_code,
        color_brand,
        hex_color,
        is_custom
      ) VALUES (?, ?, ?, ?, ?, ?)
    `);

    const insertMany = db.transaction(() => {
      for (const color of defaultColors) {
        insertStmt.run(
          userId,
          color.name,
          color.code,
          color.brand,
          color.hex,
          false
        );
      }
    });

    insertMany();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving paint colors:", error);
    return NextResponse.json(
      { error: "Failed to save paint colors" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const colors = db.prepare(`
      SELECT * FROM paint_colors
      WHERE user_id = ? AND is_active = TRUE
      ORDER BY color_brand, color_name
    `).all(userId);

    return NextResponse.json({ colors });
  } catch (error) {
    console.error("Error fetching paint colors:", error);
    return NextResponse.json(
      { error: "Failed to fetch paint colors" },
      { status: 500 }
    );
  }
}