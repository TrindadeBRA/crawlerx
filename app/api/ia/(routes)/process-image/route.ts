import { NextResponse } from 'next/server';
import { IAController } from "../../controllers/ia.controller";

const iaController = new IAController();

interface Result {
  error?: any;
}

export async function POST(request: Request) {
  try {
    const { articleProcessed, id } = await request.json();
    
    if (!articleProcessed) {
      return NextResponse.json(
        { error: 'Campos obrigatórios ausentes' },
        { status: 400 }
      );
    }

    const result = await iaController.processImage({ articleProcessed, id }) as Result;
    
    if (!result || result.error) {
      return NextResponse.json(
        { 
          error: typeof result?.error === 'object' ? result?.error?.message : result?.error || 'Falha no processamento da imagem',
          details: typeof result?.error === 'object' ? (result?.error?.code || result?.error?.type) : null
        },
        { status: result?.error?.status || 500 }
      );
    }

    return NextResponse.json({ result });
    
  } catch (error: any) {
    console.error('Erro ao processar imagem:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Erro ao processar a requisição',
        details: error.code || error.type || null
      },
      { status: error.status || 500 }
    );
  }
}