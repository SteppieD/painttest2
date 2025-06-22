import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  try {
    const { 
      companyId, 
      productId, 
      newPrice, 
      action = 'update_price' 
    } = await request.json();

    if (!companyId || !productId) {
      return NextResponse.json({ 
        error: 'Missing required fields: companyId and productId' 
      }, { status: 400 });
    }

    // Update existing favorite paint price
    if (action === 'update_price' && newPrice) {
      const updateResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/api/paint-products/single?id=${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId,
          product: { costPerGallon: newPrice }
        })
      });

      if (updateResponse.ok) {
        return NextResponse.json({
          success: true,
          message: 'Paint price updated successfully',
          newPrice
        });
      } else {
        throw new Error('Failed to update paint price');
      }
    }

    return NextResponse.json({ 
      error: 'Invalid action or missing data' 
    }, { status: 400 });

  } catch (error) {
    console.error('Paint favorites API error:', error);
    
    return NextResponse.json({ 
      success: false,
      error: 'Failed to update paint favorite'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { 
      companyId, 
      paintProduct,
      category
    } = await request.json();

    if (!companyId || !paintProduct) {
      return NextResponse.json({ 
        error: 'Missing required fields: companyId and paintProduct' 
      }, { status: 400 });
    }

    // Save new paint as favorite
    const newProduct = {
      id: '',
      projectType: category?.includes('exterior') ? 'exterior' : 'interior',
      productCategory: category || 'wall_paint',
      supplier: paintProduct.brand || paintProduct.supplier,
      productName: paintProduct.product || paintProduct.productName,
      costPerGallon: paintProduct.cost || paintProduct.costPerGallon,
      displayOrder: 1
    };

    const saveResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/api/paint-products/single`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        companyId,
        product: newProduct
      })
    });

    if (saveResponse.ok) {
      const result = await saveResponse.json();
      return NextResponse.json({
        success: true,
        message: 'New paint favorite saved successfully',
        product: result.product
      });
    } else {
      throw new Error('Failed to save new paint favorite');
    }

  } catch (error) {
    console.error('Save paint favorite API error:', error);
    
    return NextResponse.json({ 
      success: false,
      error: 'Failed to save paint favorite'
    }, { status: 500 });
  }
}