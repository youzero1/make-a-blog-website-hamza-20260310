import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-royal-900 text-royal-200 py-10 mt-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">👑</span>
              <span className="text-xl font-bold font-serif text-white">Crown Blogs</span>
            </div>
            <p className="text-sm text-royal-400 leading-relaxed">
              A royal platform for sharing your finest thoughts, stories, and ideas with the world.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-royal-400 hover:text-white transition-colors duration-200 text-sm">
                  🏠 Home
                </Link>
              </li>
              <li>
                <Link href="/posts/create" className="text-royal-400 hover:text-white transition-colors duration-200 text-sm">
                  ✍️ Create Post
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-white font-semibold mb-3">About</h3>
            <p className="text-sm text-royal-400 leading-relaxed">
              Built with Next.js, TypeScript, TypeORM and SQLite. A modern blogging platform with a royal touch.
            </p>
          </div>
        </div>

        <div className="border-t border-royal-800 pt-6 text-center">
          <p className="text-sm text-royal-500">
            &copy; {currentYear} Crown Blogs. All rights reserved. Made with ❤️ and royalty.
          </p>
        </div>
      </div>
    </footer>
  );
}
