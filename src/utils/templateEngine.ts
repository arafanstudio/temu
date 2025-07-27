import fs from 'fs'
import path from 'path'

export interface TemplateData {
  groom_name: string
  bride_name: string
  guest_name: string
  event_date: string
  event_date_formatted: string
  event_time: string
  event_location: string
  event_address: string
  couple_slug: string
  guest_slug: string
}

export interface Template {
  name: string
  display_name: string
  description: string
  preview_image?: string
}

export class TemplateEngine {
  private templatesPath: string

  constructor() {
    this.templatesPath = path.join(process.cwd(), 'public', 'templates')
  }

  /**
   * Get list of available templates
   */
  getAvailableTemplates(): Template[] {
    try {
      const templateDirs = fs.readdirSync(this.templatesPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)

      return templateDirs.map(templateName => {
        const configPath = path.join(this.templatesPath, templateName, 'config.json')
        
        // Default template config
        let config = {
          name: templateName,
          display_name: this.formatDisplayName(templateName),
          description: `Template ${templateName}`,
          preview_image: `/templates/${templateName}/preview.jpg`
        }

        // Load custom config if exists
        if (fs.existsSync(configPath)) {
          try {
            const customConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
            config = { ...config, ...customConfig }
          } catch (err) {
            console.warn(`Failed to load config for template ${templateName}:`, err)
          }
        }

        return config
      })
    } catch (err) {
      console.error('Failed to get available templates:', error)
      return []
    }
  }

  /**
   * Render template with data
   */
  renderTemplate(templateName: string, data: TemplateData): string {
    try {
      const templatePath = path.join(this.templatesPath, templateName, 'index.html')
      
      if (!fs.existsSync(templatePath)) {
        throw new Error(`Template ${templateName} not found`)
      }

      let htmlContent = fs.readFileSync(templatePath, 'utf-8')
      
      // Replace all tokens with actual data
      htmlContent = this.replaceTokens(htmlContent, data)
      
      return htmlContent
    } catch (err) {
      console.error(`Failed to render template ${templateName}:`, error)
      throw error
    }
  }

  /**
   * Get template assets (CSS, JS)
   */
  getTemplateAssets(templateName: string): { css?: string; js?: string } {
    const assets: { css?: string; js?: string } = {}
    
    try {
      const cssPath = path.join(this.templatesPath, templateName, 'style.css')
      const jsPath = path.join(this.templatesPath, templateName, 'script.js')
      
      if (fs.existsSync(cssPath)) {
        assets.css = fs.readFileSync(cssPath, 'utf-8')
      }
      
      if (fs.existsSync(jsPath)) {
        assets.js = fs.readFileSync(jsPath, 'utf-8')
      }
    } catch (err) {
      console.error(`Failed to get assets for template ${templateName}:`, error)
    }
    
    return assets
  }

  /**
   * Replace tokens in content with actual data
   */
  private replaceTokens(content: string, data: TemplateData): string {
    let result = content

    // Replace all {{token}} patterns
    Object.entries(data).forEach(([key, value]) => {
      const token = `{{${key}}}`
      const regex = new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
      result = result.replace(regex, String(value))
    })

    return result
  }

  /**
   * Format template name for display
   */
  private formatDisplayName(templateName: string): string {
    return templateName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  /**
   * Validate template structure
   */
  validateTemplate(templateName: string): boolean {
    try {
      const templateDir = path.join(this.templatesPath, templateName)
      const requiredFiles = ['index.html']
      
      if (!fs.existsSync(templateDir)) {
        return false
      }

      return requiredFiles.every(file => {
        const filePath = path.join(templateDir, file)
        return fs.existsSync(filePath)
      })
    } catch (err) {
      console.error(`Failed to validate template ${templateName}:`, error)
      return false
    }
  }

  /**
   * Format date for display
   */
  static formatDate(dateString: string): string {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch (err) {
      return dateString
    }
  }

  /**
   * Create template data object
   */
  static createTemplateData(
    coupleData: {
      groom_name: string
      bride_name: string
      event_date: string
      event_time: string
      event_location: string
      event_address: string
      slug: string
    },
    guestData: {
      name: string
      slug: string
    }
  ): TemplateData {
    return {
      groom_name: coupleData.groom_name,
      bride_name: coupleData.bride_name,
      guest_name: guestData.name,
      event_date: coupleData.event_date,
      event_date_formatted: this.formatDate(coupleData.event_date),
      event_time: coupleData.event_time,
      event_location: coupleData.event_location,
      event_address: coupleData.event_address,
      couple_slug: coupleData.slug,
      guest_slug: guestData.slug
    }
  }
}

export default TemplateEngine

