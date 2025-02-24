import { NextResponse } from 'next/server';
import { WordPressController } from '../../controllers/wordpress.controller';

const wordpressController = new WordPressController();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.post) {
      return NextResponse.json(
        { 
          code: 'missing_post',
          message: 'Dados do post são obrigatórios',
          data: { status: 400 }
        },
        { status: 400 }
      );
    }

    const result = await wordpressController.publishPost({ post: body.post });
    
    if (!result.success) {
      return NextResponse.json(
        { 
          code: 'publish_failed',
          message: result.error || 'Erro desconhecido ao publicar post',
          data: { status: 500 }
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data || {}
    });
    
  } catch (error: any) {
    console.error('Erro ao publicar post:', error);
    return NextResponse.json(
      { 
        code: 'internal_error',
        message: error.message || 'Erro ao processar a requisição',
        data: { 
          status: 500,
          details: error.stack
        }
      },
      { status: 500 }
    );
  }
} 