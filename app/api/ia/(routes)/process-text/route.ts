import { NextResponse } from 'next/server';
import { IAController } from "../../controllers/ia.controller";

const iaController = new IAController();

export async function POST(request: Request) {
  try {
    const { title, content } = await request.json();
    
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Campos obrigatórios ausentes' },
        { status: 400 }
      );
    }

    const result = await iaController.processText({ title, content });
    return NextResponse.json({ result });
    
  } catch (error) {
    console.error('Erro ao processar texto:', error);
    return NextResponse.json(
      { error: 'Erro ao processar a requisição' },
      { status: 500 }
    );
  }
}