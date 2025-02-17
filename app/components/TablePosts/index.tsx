'use client';

import { Post } from '@prisma/client';
import { useEffect, useState } from 'react';

export default function TablePosts() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts/list');
        if (!response.ok) {
          throw new Error('Falha ao buscar posts');
        }
        const { data } = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Erro ao carregar posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const handleProcessPost = async (post: Post) => {
    try {
      const payload = {
        og_post_url: post.url,
        og_post_title: post.title,
        og_post_content: post.content || ''
      };

      const response = await fetch(process.env.NEXT_PUBLIC_WEBHOOK_URL || '', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Falha ao processar o post');
      }

      const updatedPost = await fetch(`/api/posts/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: post.id, status: 'PROCESSED' }),
      });

      if (!updatedPost.ok) {
        throw new Error('Falha ao atualizar o status do post');
      }

      alert('Post processado com sucesso!');
    } catch (error) {
      console.error('Erro ao processar o post:', error);
      alert('Erro ao processar o post');
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900">Posts</h1>
          <p className="mt-2 text-sm text-gray-700">
            Lista de todos os posts importados no sistema.
          </p>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                    Título
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Domínio
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Data de Criação
                  </th>
                  <th scope="col" className="relative py-3.5 pr-4 pl-3 sm:pr-0">
                    Ver
                  </th>
                  <th scope="col" className="relative py-3.5 pr-4 pl-3 sm:pr-0">
                    Processar
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-0">
                      {post.title}
                    </td>
                    <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">{post.domain}</td>
                    <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">{post.status}</td>
                    <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-0">
                      <a href={post.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-900">
                        Ver post<span className="sr-only">, {post.title}</span>
                      </a>
                    </td>
                    <td className="relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-0">
                      <button
                        onClick={() => handleProcessPost(post)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Processar<span className="sr-only">, {post.title}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
  