'use client'

import { useEffect, useState } from "react";
import Header from "../../../src/components/Header";
import Link from "next/link";
import { ArrowsRightLeftIcon, GlobeAltIcon } from "@heroicons/react/24/solid";

interface Post {
  id: number;
  title: string;
  url: string;
  createdAt: string;
}

interface OriginData {
  domain: string;
  totalPosts: number;
  posts: Post[];
}

export default function Origins() {
  const [origins, setOrigins] = useState<OriginData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedDomains, setExpandedDomains] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchOrigins();
  }, []);

  const fetchOrigins = async () => {
    try {
      const response = await fetch('/api/posts/origin');
      if (!response.ok) throw new Error('Falha ao carregar origens');
      const data = await response.json();
      setOrigins(data);
    } catch (err) {
      setError('Erro ao carregar origens');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (domain: string) => {
    setExpandedDomains(prev => {
      const newSet = new Set(prev);
      if (newSet.has(domain)) {
        newSet.delete(domain);
      } else {
        newSet.add(domain);
      }
      return newSet;
    });
  };

  return (
    <div className="">
      <Header title="Origens" description="Lista de todas as origens de posts." icon={ArrowsRightLeftIcon} />
      
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
      )}
      {error && <p className="text-red-500 text-center">{error}</p>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
        {origins.map((origin) => {
          const isExpanded = expandedDomains.has(origin.domain);
          const displayPosts = isExpanded ? origin.posts : origin.posts.slice(0, 3);
          const hasMorePosts = origin.posts.length > 5;

          return (
            <div key={origin.domain} className="border rounded-lg p-4">
              <Link href={`https://${origin.domain}`} target="_blank" className="text-base font-bold flex items-center gap-2">
                {origin.domain} <GlobeAltIcon className="size-5 text-primary" />
              </Link>
              <p className="text-xs text-gray-600">Total de posts importados: <span className="font-bold">{origin.totalPosts}</span></p>
              
              <div className="mt-4">
                <h3 className="text-sm font-semibold mb-2">Posts:</h3>
                <ul className="list-disc pl-5">
                  {displayPosts.map((post) => (
                    <li key={post.id} className="text-sm">
                      <a href={post.url} target="_blank" rel="noopener noreferrer" 
                         className="text-brand-500 hover:underline">
                        {post.title.length > 100 
                          ? post.title.slice(0, 100).concat('...') 
                          : post.title}
                      </a>
                    </li>
                  ))}
                </ul>
                {hasMorePosts && (
                  <button
                    onClick={() => toggleExpand(origin.domain)}
                    className="text-sm text-black font-bold hover:underline mt-2"
                  >
                    {isExpanded ? 'Ver menos' : `Ver todos (${origin.posts.length})`}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
