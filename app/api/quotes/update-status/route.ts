import { NextRequest, NextResponse } from "next/server";
import { dbRun } from "@/lib/database";

// PUT endpoint - Update quote status
export async function PUT(request: NextRequest) {
  try {
    const { quoteId, status } = await request.json();

    if (!quoteId || !status) {
      return NextResponse.json(
        { error: "Missing quoteId or status" },
        { status: 400 },
      );
    }

    // Valid status values
    const validStatuses = ["pending", "accepted", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 },
      );
    }

    // Update quote status with timestamp
    const result = dbRun(`
      UPDATE quotes 
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [status, quoteId]);

    if (result.changes === 0) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    console.log(`✅ Quote ${quoteId} status updated to: ${status}`);

    return NextResponse.json({
      success: true,
      message: "Quote status updated successfully",
    });
  } catch (error) {
    console.error("Error updating quote status:", error);
    return NextResponse.json(
      { error: "Failed to update quote status" },
      { status: 500 },
    );
  }
}
