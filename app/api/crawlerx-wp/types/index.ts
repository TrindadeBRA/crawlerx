// Tipos para requisições
export interface CreatePostRequest {
  title: string;
  content: string;
  excerpt: string;
  user_id?: number;
}

export interface UploadImageRequest {
  post_id: number;
  image_base64: string;
  title: string;
  cover_image_url?: string;
}

// Tipos para respostas
export interface CreatePostResponse {
  wp_post_id: number;
  wp_slug: string;
}

export interface UploadImageResponse {
  wp_image_id: number;
  wp_image_url: string;
  wp_post_id: number;
}

// Tipo para erros
export interface ApiError {
  code: string;
  message: string;
  data: {
    status: number;
  };
}

// Tipo para publicação de post
export interface PublishPostRequest {
  post: {
    title: string;
    content: string;
    seoDescription: string;
    imageUrl: string;
  };
} 