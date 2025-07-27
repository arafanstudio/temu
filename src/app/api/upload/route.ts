import { NextRequest, NextResponse } from 'next/server'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { r2Client, R2_BUCKET } from '@/lib/r2'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' 
      }, { status: 400 })
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 5MB.' 
      }, { status: 400 })
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop()
    const fileName = `payment-proofs/${uuidv4()}.${fileExtension}`

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Upload to Cloudflare R2
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    })

    await r2Client.send(command)

    // Return the file URL
    const fileUrl = `${process.env.AWS_S3_ENDPOINT}/${R2_BUCKET}/${fileName}`

    return NextResponse.json({ 
      success: true, 
      url: fileUrl,
      fileName 
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ 
      error: 'Failed to upload file' 
    }, { status: 500 })
  }
}

