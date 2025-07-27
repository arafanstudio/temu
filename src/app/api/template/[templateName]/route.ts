import { NextRequest, NextResponse } from 'next/server'
import TemplateEngine from '@/utils/templateEngine'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ templateName: string }> }
) {
  try {
    const { templateName } = await params
    const templateEngine = new TemplateEngine()
    
    // Validate template exists
    if (!templateEngine.validateTemplate(templateName)) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    // Get template assets
    const assets = templateEngine.getTemplateAssets(templateName)
    
    return NextResponse.json({
      success: true,
      assets
    })
  } catch (error) {
    console.error('Template API error:', error)
    return NextResponse.json(
      { error: 'Failed to get template' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ templateName: string }> }
) {
  try {
    const { templateName } = await params
    const templateEngine = new TemplateEngine()
    
    // Validate template exists
    if (!templateEngine.validateTemplate(templateName)) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    // Get template data from request body
    const templateData = await request.json()
    
    // Render template with data
    const renderedHtml = templateEngine.renderTemplate(templateName, templateData)
    
    return NextResponse.json({
      success: true,
      html: renderedHtml
    })
  } catch (error) {
    console.error('Template render error:', error)
    return NextResponse.json(
      { error: 'Failed to render template' },
      { status: 500 }
    )
  }
}

