'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Share2, Calendar, User, Loader2, MessageSquare, Send } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import api from '@/utils/api';
import { renderMarkdown } from '@/utils/markdown';
import { usePageMetadata } from '@/utils/seo';
import { Blog, Comment } from '@/types';
import ArticleCard from '@/components/ArticleCard';

export const dynamic = 'force-dynamic';

export default function BlogDetail() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentForm, setCommentForm] = useState({ name: '', email: '', content: '' });
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentMessage, setCommentMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const renderedContent = useMemo(() => renderMarkdown(blog?.content || ''), [blog?.content]);

  usePageMetadata({
    title: blog?.seoTitle || blog?.title || 'Blog Post',
    description: blog?.metaDescription || blog?.excerpt || '',
    url: `${typeof window !== 'undefined' ? window.location.origin : 'https://worldnow.news'}/blog/${slug}`,
    image: "/browserlogo.png",
    type: 'article',
  });

  useEffect(() => {
    async function fetchBlog() {
      try {
        setLoading(true);
        const res = await api.get(`/blogs/${slug}`);
        setBlog(res.data);

        const commentsRes = await api.get(`/blogs/${slug}/comments`);
        setComments(Array.isArray(commentsRes.data) ? commentsRes.data : []);

        if (res.data.category) {
          const relatedRes = await api.get('/blogs', {
            params: { category: res.data.category, status: 'published', limit: 6 }
          });
          const filtered = (relatedRes.data || []).filter((b: Blog) => b._id !== res.data._id).slice(0, 6);
          setRelatedBlogs(filtered);
        }
      } catch (err) {
        console.error('Failed to fetch blog:', err);
        setBlog(null);
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchBlog();
  }, [slug]);

  const handleShare = () => {
    const url = `${typeof window !== 'undefined' ? window.location.href : ''}`;
    if (navigator.share) {
      navigator.share({ title: blog?.title, url });
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  const handleCommentSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!blog) return;

    const name = commentForm.name.trim();
    const content = commentForm.content.trim();

    if (!name || !content) {
      setCommentMessage('Please enter your name and a comment.');
      return;
    }

    setSubmittingComment(true);
    setCommentMessage('');

    try {
      const response = await api.post(`/blogs/${slug}/comments`, {
        name,
        email: commentForm.email.trim(),
        content,
      });

      setComments((current) => [response.data, ...current]);
      setCommentForm({ name: '', email: '', content: '' });
      setCommentMessage('Your comment has been posted successfully.');
    } catch (error: any) {
      setCommentMessage(error.response?.data?.error || 'Unable to post your comment right now.');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8f4] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-[#b5150e] animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-serif italic">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-[#faf8f4] flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-serif font-bold text-[#0d0d0d] mb-2">Article Not Found</h1>
          <p className="text-gray-600 mb-6">The article you're looking for doesn't exist or has been removed.</p>
          <Link href="/" className="text-[#b5150e] hover:text-[#8a0f09] font-semibold">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f4]">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-[#b5150e] hover:text-[#8a0f09] mb-6 font-semibold">
          <ArrowLeft className="w-4 h-4" />
          Back to All News
        </Link>

        <article className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          {/* Article header */}
          <div className="mb-8 pb-6 border-b border-[#d4cbb8]">
            <span className="inline-block px-3 py-1 bg-[#f5f1e8] text-[#b5150e] text-xs uppercase tracking-wider font-bold rounded mb-4">
              {blog.category}
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-extrabold text-[#0d0d0d] mb-4 leading-tight">
              {blog.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 font-sans">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#b5150e]" />
                <strong>{blog.author}</strong>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#b5150e]" />
                <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>
          </div>

          {/* Featured image */}
          {blog.featuredImage && (
            <div className="mb-8 rounded overflow-hidden">
              <img
                src={blog.featuredImage}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article content */}
          <div className="prose prose-lg max-w-none mb-8">
            {blog.excerpt && (
              <p className="text-lg text-gray-700 font-serif italic mb-6 p-4 bg-[#f5f1e8] border-l-4 border-[#b5150e]">
                {blog.excerpt}
              </p>
            )}
            <div
              dangerouslySetInnerHTML={{ __html: renderedContent }}
              className="prose prose-lg max-w-none font-serif text-gray-800 leading-relaxed"
            />
          </div>

          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-6 pt-6 border-t border-[#d4cbb8]">
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full border border-[#d4cbb8] bg-[#f5f1e8] px-3 py-1.5 text-sm font-medium text-[#0d0d0d] shadow-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Share button */}
          <div className="py-6 border-t border-[#d4cbb8] flex flex-wrap items-center gap-3">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-[#b5150e] text-white rounded hover:bg-[#8a0f09] transition text-sm font-semibold"
            >
              <Share2 className="w-4 h-4" />
              Share Article
            </button>
            <span className="text-xs text-gray-500">Views: {blog.views}</span>
            <span className="rounded-full border border-[#d4cbb8] bg-[#f5f1e8] px-3 py-1 text-xs uppercase tracking-[0.25em] text-[#0d0d0d]">
              {comments.length} comment{comments.length === 1 ? '' : 's'}
            </span>
          </div>

          <section className="mt-8 rounded-3xl border border-[#d4cbb8] bg-[#faf8f4] p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-[#b5150e] font-semibold">Reader discussion</p>
                <h2 className="mt-2 font-serif text-2xl font-black text-[#0d0d0d]">Join the conversation</h2>
                <p className="mt-2 text-sm text-gray-600">Share your thoughts on this article. Comments are stored in MongoDB and appear instantly below.</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#d4cbb8] bg-white px-3 py-2 text-xs uppercase tracking-[0.25em] text-gray-700">
                <MessageSquare className="w-3.5 h-3.5 text-[#b5150e]" />
                {comments.length} live comments
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
              <form onSubmit={handleCommentSubmit} className="rounded-3xl border border-[#d4cbb8] bg-white p-5 shadow-sm space-y-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Name
                  <input
                    type="text"
                    value={commentForm.name}
                    onChange={(event) => setCommentForm((current) => ({ ...current, name: event.target.value }))}
                    className="mt-1 w-full rounded-xl border border-[#d4cbb8] bg-[#faf8f4] px-4 py-3 text-sm outline-none focus:border-[#b5150e] focus:bg-white"
                    placeholder="Your name"
                  />
                </label>

                <label className="block text-sm font-semibold text-gray-700">
                  Email (optional)
                  <input
                    type="email"
                    value={commentForm.email}
                    onChange={(event) => setCommentForm((current) => ({ ...current, email: event.target.value }))}
                    className="mt-1 w-full rounded-xl border border-[#d4cbb8] bg-[#faf8f4] px-4 py-3 text-sm outline-none focus:border-[#b5150e] focus:bg-white"
                    placeholder="you@example.com"
                  />
                </label>

                <label className="block text-sm font-semibold text-gray-700">
                  Comment
                  <textarea
                    rows={5}
                    value={commentForm.content}
                    onChange={(event) => setCommentForm((current) => ({ ...current, content: event.target.value }))}
                    className="mt-1 w-full rounded-xl border border-[#d4cbb8] bg-[#faf8f4] px-4 py-3 text-sm outline-none focus:border-[#b5150e] focus:bg-white"
                    placeholder="Write your thoughts about this story..."
                  />
                </label>

                {commentMessage ? <p className="rounded-xl border border-[#efe7db] bg-[#faf8f4] px-4 py-3 text-sm text-gray-700">{commentMessage}</p> : null}

                <button
                  type="submit"
                  disabled={submittingComment}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#b5150e] px-4 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-white hover:bg-[#8a0f09] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submittingComment ? 'Posting...' : 'Post comment'}
                  <Send className="w-4 h-4" />
                </button>
              </form>

              <div className="space-y-4">
                {comments.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-[#d4cbb8] bg-white p-6 text-sm text-gray-600 shadow-sm">
                    No comments yet. Be the first to share your perspective on this article.
                  </div>
                ) : (
                  comments.map((comment) => (
                    <article key={comment._id} className="rounded-3xl border border-[#d4cbb8] bg-white p-5 shadow-sm">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-[#0d0d0d]">{comment.name}</p>
                          {comment.email ? <p className="text-xs text-gray-500">{comment.email}</p> : null}
                        </div>
                        <span className="rounded-full bg-[#f5f1e8] px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-[#b5150e]">
                          {new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <p className="mt-4 text-sm text-gray-700 leading-6">{comment.content}</p>
                    </article>
                  ))
                )}
              </div>
            </div>
          </section>
        </article>

        {/* Related articles */}
        {relatedBlogs.length > 0 && (
          <div className="mt-16">
            <h2 className="font-serif text-2xl font-bold text-[#0d0d0d] mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogs.map((article) => (
                <ArticleCard key={article._id} blog={article} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
