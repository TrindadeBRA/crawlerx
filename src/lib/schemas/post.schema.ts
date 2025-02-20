import { z } from 'zod'

export const createPostSchema = z.object({
  title: z.string()
    .min(1, 'O título é obrigatório')
    .min(3, 'O título deve ter pelo menos 3 caracteres'),
  content: z.string()
    .min(1, 'O conteúdo é obrigatório')
    .min(10, 'O conteúdo deve ter pelo menos 10 caracteres'),
  url: z.string()
    .min(1, 'A URL é obrigatória')
    .url('URL inválida')
})

export type CreatePostInput = z.infer<typeof createPostSchema>

export const importPostsSchema = z.object({
  platform: z.string()
    .min(1, 'A plataforma é obrigatória'),
  searchTerm: z.string()
    .optional()
    .default('')
    .transform(val => val ?? ''),
  quantity: z.number()
    .min(1, 'A quantidade deve ser maior que 0')
    .max(10, 'A quantidade máxima é 10')
})

export type ImportPostsInput = z.infer<typeof importPostsSchema> 