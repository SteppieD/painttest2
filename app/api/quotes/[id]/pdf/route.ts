import { NextResponse } from 'next/server';
import { pdfQuoteGenerator } from '@/lib/pdf-generator';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Fetch quote data
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'}/api/quotes/${params.id}`, {
      headers: {
        'User-Agent': 'Quote-PDF-Generator'
      }
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      );
    }

    const quote = await response.json();

    // Generate PDF (currently returns HTML for browser rendering)
    // In production, this would use Puppeteer to generate actual PDF
    const pdfBuffer = await pdfQuoteGenerator.generateQuotePDF(quote);

    // For now, return HTML that can be used for print or PDF conversion
    return new NextResponse(pdfBuffer.toString(), {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `inline; filename="quote-${quote.quote_id}.html"`,
      },
    });

    // When Puppeteer is integrated, this would return:
    /*
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="quote-${quote.quote_id}.pdf"`,
        'Cache-Control': 'no-cache',
      },
    });
    */

  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}

// Alternative endpoint for HTML preview (useful for development)
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { action } = await request.json();
    
    if (action === 'preview') {
      // Return HTML preview for development
      const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'}/api/quotes/${params.id}`);
      const quote = await response.json();
      
      const htmlContent = await pdfQuoteGenerator.generateQuotePDF(quote);
      
      return new NextResponse(htmlContent.toString(), {
        headers: {
          'Content-Type': 'text/html',
        },
      });
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('PDF preview error:', error);
    return NextResponse.json(
      { error: 'Failed to generate preview' },
      { status: 500 }
    );
  }
}