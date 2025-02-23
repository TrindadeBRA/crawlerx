import { NextResponse } from 'next/server';
import { IAController } from "../../controllers/ia.controller";

const iaController = new IAController();
interface Result {
  error?: any;
}

export async function POST(request: Request) {
  try {
    const { title, content, id } = await request.json();
    
    if (!title || !content || !id) {
      return NextResponse.json(
        { error: 'Campos obrigatórios ausentes' },
        { status: 400 }
      );
    }

    const result = await iaController.processText({ title, content, id }) as Result;
    
    if (!result || result.error) {
      return NextResponse.json(
        { 
          error: typeof result?.error === 'object' ? result?.error?.message : result?.error || 'Falha no processamento do texto',
          details: typeof result?.error === 'object' ? (result?.error?.code || result?.error?.type) : null
        },
        { status: result?.error?.status || 500 }
      );
    }

    return NextResponse.json({ result });
    
  } catch (error: any) {
    console.error('Erro ao processar o texto:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Erro ao processar a requisição',
        details: error.code || error.type || null
      },
      { status: error.status || 500 }
    );
  }
}