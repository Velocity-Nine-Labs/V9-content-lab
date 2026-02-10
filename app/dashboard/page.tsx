import { auth } from "@/libs/next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import config from "@/config";
import { 
  Key, 
  Plug, 
  FileText, 
  Send, 
  BarChart3,
  Sparkles,
  ArrowRight,
  Zap
} from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session) {
    redirect(config.auth.loginUrl);
  }

  const quickActions = [
    {
      title: "Create Content",
      description: "Generate text, images, videos with AI",
      href: "/dashboard/create",
      icon: Sparkles,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "API Keys",
      description: "Manage your API access",
      href: "/dashboard/api-keys",
      icon: Key,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Connected Accounts",
      description: "Manage social media connections",
      href: "/dashboard/accounts",
      icon: Plug,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Content Library",
      description: "View and manage your content",
      href: "/dashboard/content",
      icon: FileText,
      color: "from-orange-500 to-yellow-500",
    },
  ];

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back{session.user?.name ? `, ${session.user.name}` : ""}! 👋
          </h1>
          <p className="text-base-content/70">
            Create, generate, and publish content from one place.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="stat bg-base-200 rounded-xl">
            <div className="stat-figure text-primary">
              <FileText size={24} />
            </div>
            <div className="stat-title">Content Created</div>
            <div className="stat-value text-primary">0</div>
            <div className="stat-desc">This month</div>
          </div>
          <div className="stat bg-base-200 rounded-xl">
            <div className="stat-figure text-secondary">
              <Send size={24} />
            </div>
            <div className="stat-title">Posts Published</div>
            <div className="stat-value text-secondary">0</div>
            <div className="stat-desc">This month</div>
          </div>
          <div className="stat bg-base-200 rounded-xl">
            <div className="stat-figure text-accent">
              <Plug size={24} />
            </div>
            <div className="stat-title">Connected Accounts</div>
            <div className="stat-value text-accent">0</div>
            <div className="stat-desc">Active</div>
          </div>
          <div className="stat bg-base-200 rounded-xl">
            <div className="stat-figure text-info">
              <Zap size={24} />
            </div>
            <div className="stat-title">API Requests</div>
            <div className="stat-value text-info">0</div>
            <div className="stat-desc">This month</div>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="card bg-base-200 hover:bg-base-300 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <div className="card-body">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <h3 className="card-title text-lg">{action.title}</h3>
                  <p className="text-sm text-base-content/70">{action.description}</p>
                  <div className="card-actions justify-end mt-2">
                    <ArrowRight size={18} className="text-base-content/50" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* API Documentation Preview */}
        <div className="card bg-gradient-to-br from-base-200 to-base-300">
          <div className="card-body">
            <h2 className="card-title">
              <Key size={20} />
              API Quick Start
            </h2>
            <p className="text-base-content/70 mb-4">
              Use your API key to create and publish content programmatically.
            </p>
            <div className="mockup-code bg-base-300 text-sm">
              <pre data-prefix="$"><code>curl -X POST https://api.contentfactory.velocitynine-labs.com/v1/generate \</code></pre>
              <pre data-prefix=" "><code>  -H "Authorization: Bearer v9cf_your_api_key" \</code></pre>
              <pre data-prefix=" "><code>  -H "Content-Type: application/json" \</code></pre>
              <pre data-prefix=" "><code>  -d '{`{"type": "text", "prompt": "Write a tweet about AI"}`}'</code></pre>
            </div>
            <div className="card-actions justify-end mt-4">
              <Link href="/docs/api" className="btn btn-ghost btn-sm">
                View Full Docs
              </Link>
              <Link href="/dashboard/api-keys" className="btn btn-primary btn-sm">
                Get API Key
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
