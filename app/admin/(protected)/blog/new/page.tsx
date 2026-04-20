import BlogPostForm from "@/components/BlogPostForm";

export default function AdminNewBlogPostPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-stone-900">New Blog Post</h1>
        <p className="text-stone-500 font-sans text-sm mt-1">
          Create a new article for the blog
        </p>
      </div>
      <BlogPostForm mode="create" />
    </div>
  );
}
