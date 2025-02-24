import { 
  CreatePostRequest, 
  CreatePostResponse, 
  UploadImageRequest, 
  UploadImageResponse,
  ApiError 
} from '../types';

export class WordPressRepository {
  private readonly apiBaseUrl: string;
  private readonly apiKey: string;

  constructor() {
    this.apiKey = process.env.CRAWLERX_WP_API_KEY || '';
    this.apiBaseUrl = process.env.CRAWLERX_WP_API_URL || '';
  }

  private get headers() {
    return {
      'X-API-Key': this.apiKey,
      'Content-Type': 'application/json',
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const text = await response.text();
    
    try {
      const data = JSON.parse(text);
      
      if (!response.ok) {
        const error = data as ApiError;
        throw new Error(error.message || `Erro na requisição: ${response.status}`);
      }
      
      return data as T;
    } catch (error) {
      if (error instanceof Error) {
        throw error; // Re-throw se já for um Error
      }
      console.error('Erro ao processar resposta:', text);
      throw new Error('Resposta inválida do servidor');
    }
  }

  async createPost(params: CreatePostRequest): Promise<CreatePostResponse> {
    try {
      // Validação local dos dados
      if (!params.title?.trim()) {
        throw new Error('Título é obrigatório');
      }
      if (!params.content?.trim()) {
        throw new Error('Conteúdo é obrigatório');
      }
      if (!params.excerpt?.trim()) {
        throw new Error('Resumo (excerpt) é obrigatório');
      }

      const response = await fetch(`${this.apiBaseUrl}create-post`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(params),
      });

      return this.handleResponse<CreatePostResponse>(response);
    } catch (error) {
      console.error('Erro ao criar post:', error);
      throw error instanceof Error ? error : new Error('Erro ao criar post');
    }
  }

  async uploadImage(params: UploadImageRequest): Promise<UploadImageResponse> {
    try {
      // Validação local dos dados
      if (!params.post_id) {
        throw new Error('ID do post é obrigatório');
      }
      if (!params.image_base64) {
        throw new Error('Imagem é obrigatória');
      }
      if (!params.title) {
        throw new Error('Título da imagem é obrigatório');
      }

      const response = await fetch(`${this.apiBaseUrl}upload-image`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(params),
      });

      return this.handleResponse<UploadImageResponse>(response);
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      throw error instanceof Error ? error : new Error('Erro ao fazer upload da imagem');
    }
  }
} 