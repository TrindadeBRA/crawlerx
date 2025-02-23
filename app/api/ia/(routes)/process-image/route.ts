import { NextResponse } from 'next/server';
import { IAController } from "../../controllers/ia.controller";

const iaController = new IAController();

export async function POST(request: Request) {
  try {
    const { articleProcessed, id } = await request.json();
    
    if (!articleProcessed) {
      return NextResponse.json(
        { error: 'Campos obrigatórios ausentes' },
        { status: 400 }
      );
    }

    const result = await iaController.processImage({ articleProcessed, id });
    return NextResponse.json({ result });
    
  } catch (error) {
    console.error('Erro ao processar texto:', error);
    return NextResponse.json(
      { error: 'Erro ao processar a requisição' },
      { status: 500 }
    );
  }
}